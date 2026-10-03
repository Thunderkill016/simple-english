import { expect, test, type Page, type Request } from "@playwright/test";

const OPTION_LABEL = "Hello!";

async function openLesson(page: Page) {
  await page.goto("/");
  await page.getByRole("link", { name: "Learn" }).click();
  await expect(page.getByRole("heading", { name: "Learn" })).toBeVisible();
  await page.getByRole("link", { name: "Start" }).click();
  await expect(
    page.getByRole("heading", { name: "Greetings" }),
  ).toBeVisible();
}

async function answerAndComplete(page: Page) {
  await page.getByRole("radio", { name: OPTION_LABEL }).check();
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByText("Correct — well done.")).toBeVisible();
  await page.getByRole("button", { name: "Complete lesson" }).click();
  await expect(page.getByText("Lesson complete.")).toBeVisible();
}

test.describe("local-first learning slice", () => {
  test("acceptance: answer → complete → reload → still completed", async ({
    page,
  }) => {
    await openLesson(page);
    await answerAndComplete(page);

    // Reload — completion must come back from IndexedDB, not the network.
    await page.reload();
    await expect(page.getByText("Lesson complete.")).toBeVisible();
    await expect(page.getByRole("radio", { name: OPTION_LABEL })).toBeChecked();

    // Today reflects completion
    await page.getByRole("link", { name: "Today" }).click();
    await expect(page.getByText("Completed")).toBeVisible();

    // Progress derives from local state
    await page.getByRole("link", { name: "Progress" }).click();
    await expect(page.getByText("Lessons completed: 1")).toBeVisible();
  });

  test("learning interaction needs no network: works fully offline after load", async ({
    page,
    context,
  }) => {
    const apiRequests: Request[] = [];
    page.on("request", (req) => {
      const type = req.resourceType();
      if (type === "xhr" || type === "fetch") apiRequests.push(req);
    });

    await openLesson(page);

    // Kill the network entirely — answer + complete must still work.
    await context.setOffline(true);
    await answerAndComplete(page);

    // Progress landed in IndexedDB while offline
    const persisted = await page.evaluate(async () => {
      const req = indexedDB.open("simple-english");
      const database: IDBDatabase = await new Promise((resolve, reject) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      const tx = database.transaction("lessonProgress", "readonly");
      const record = await new Promise<{ status?: string } | undefined>(
        (resolve, reject) => {
          const get = tx.objectStore("lessonProgress").get("greetings");
          get.onsuccess = () => resolve(get.result as { status?: string } | undefined);
          get.onerror = () => reject(get.error);
        },
      );
      database.close();
      return record;
    });
    expect(persisted?.status).toBe("completed");

    // And no runtime API calls were made at any point
    expect(apiRequests).toEqual([]);
  });

  test("deep links render routes directly (SPA static hosting)", async ({
    page,
  }) => {
    await page.goto("/learn");
    await expect(page.getByRole("heading", { name: "Learn" })).toBeVisible();

    await page.goto("/progress");
    await expect(page.getByRole("heading", { name: "Progress" })).toBeVisible();
  });

  test("main navigation works across all four surfaces", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();

    await page.getByRole("link", { name: "Learn" }).click();
    await expect(page.getByRole("heading", { name: "Learn" })).toBeVisible();

    await page.getByRole("link", { name: "Review" }).click();
    await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
    await expect(page.getByText("Nothing to review yet.")).toBeVisible();

    await page.getByRole("link", { name: "Progress" }).click();
    await expect(page.getByRole("heading", { name: "Progress" })).toBeVisible();
  });

  test("accessibility smoke: headings, names, keyboard reachability, focus", async ({
    page,
  }) => {
    await openLesson(page);

    // Heading hierarchy: page h1 exists
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    // Form control has an accessible name via its label
    const option = page.getByRole("radio", { name: OPTION_LABEL });
    await expect(option).toBeVisible();

    // Keyboard can reach controls: Tab eventually focuses the radio group
    await page.keyboard.press("Tab");
    let found = false;
    for (let i = 0; i < 12 && !found; i++) {
      found = await page.evaluate(
        () => document.activeElement instanceof HTMLInputElement,
      );
      if (!found) await page.keyboard.press("Tab");
    }
    expect(found).toBe(true);

    // Focused control shows a visible focus style (outline or ring)
    const hasFocusStyle = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const s = getComputedStyle(el);
      return s.outlineStyle !== "none" || s.outlineWidth !== "0px" || s.boxShadow !== "none";
    });
    expect(hasFocusStyle).toBe(true);
  });
});
