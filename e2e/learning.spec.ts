import { expect, test, type Page, type Request } from "@playwright/test";

const OPTION_LABEL = "Nice to meet you too.";
const WRONG_OPTION = "Good night.";
const LESSON_TITLE = "Meet Someone";
const LESSON_ID = "se-a1-meet-someone";
const AUDIO_SRC = "/media/voa-lle1-conversation.mp3";
const COMPLETION_STATEMENT = "✓ You can meet someone in English.";

async function openLesson(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Start lesson", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: LESSON_TITLE, exact: true }),
  ).toBeVisible();
  // Focus mode: the top-level app nav must not compete with the lesson.
  await expect(page.getByRole("navigation", { name: "Main" })).toHaveCount(0);
}

async function answerAndComplete(page: Page) {
  // Check stays disabled until a selection exists.
  await expect(
    page.getByRole("button", { name: "Check answer" }),
  ).toBeDisabled();

  // Wrong answer → concise retry feedback, learner can try again.
  await page.getByRole("radio", { name: WRONG_OPTION }).check();
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(page.getByText("Not quite — try again.")).toBeVisible();

  await page.getByRole("radio", { name: OPTION_LABEL }).check();
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(page.getByText(/✓ Correct/)).toBeVisible();

  await page.getByRole("button", { name: "Complete lesson" }).click();

  // Feedback and completion are SEPARATE semantic states (regression:
  // previously rendered as "Correct — well done.Lesson complete.").
  const completion = page.getByText(COMPLETION_STATEMENT);
  await expect(completion).toBeVisible();
  await expect(completion).not.toContainText("Correct");
  await expect(page.getByRole("link", { name: "Back to Learn", exact: true })).toBeVisible();
}

test.describe("local-first learning slice", () => {
  test("acceptance: answer → complete → reload → still completed", async ({
    page,
  }) => {
    await openLesson(page);

    // Lesson 001 scope: 'How are you?' content must not be in this lesson.
    await expect(page.getByText("How are you?")).toHaveCount(0);

    await answerAndComplete(page);

    // Capability completion — skills listed, not just "done".
    await expect(
      page.getByRole("listitem").filter({ hasText: "Say hello" }),
    ).toBeVisible();
    await expect(
      page.getByRole("listitem").filter({ hasText: "Respond to an introduction" }),
    ).toBeVisible();

    // Reload — completion must come back from IndexedDB, not the network.
    await page.reload();
    await expect(page.getByText(COMPLETION_STATEMENT)).toBeVisible();
    await expect(page.getByText("Completed ✓")).toBeVisible();
    await expect(page.getByRole("radio", { name: OPTION_LABEL })).toBeChecked();

    // Provenance survives — behind progressive disclosure, SE-authored
    // with individually credited sources.
    await page.getByText("Sources & license").click();
    await expect(page.getByText("Lesson by Simple English.")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Lesson 1: Welcome!/ }),
    ).toHaveAttribute("href", /learningenglish\.voanews\.com/);
    await expect(page.getByRole("link", { name: "license ↗" }).first()).toBeVisible();

    // Back to Learn shows the lesson as completed
    await page.getByRole("link", { name: "Back to Learn", exact: true }).click();
    await expect(page.getByText("Completed")).toBeVisible();

    // Today reflects completion with a truthful next action
    await page.getByRole("link", { name: "Today", exact: true }).click();
    await expect(page.getByText("✓ Lesson complete")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "View learning path" }),
    ).toBeVisible();

    // Progress derives from local state — human-readable, no fake denominator
    await page.getByRole("link", { name: "Progress", exact: true }).click();
    await expect(page.getByText("1 lesson completed")).toBeVisible();
    await expect(page.getByText(LESSON_TITLE)).toBeVisible();
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
    const persisted = await page.evaluate(
      async (lessonId) => {
        const req = indexedDB.open("simple-english");
        const database: IDBDatabase = await new Promise((resolve, reject) => {
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
        const tx = database.transaction("lessonProgress", "readonly");
        const record = await new Promise<{ status?: string } | undefined>(
          (resolve, reject) => {
            const get = tx.objectStore("lessonProgress").get(lessonId);
            get.onsuccess = () =>
              resolve(get.result as { status?: string } | undefined);
            get.onerror = () => reject(get.error);
          },
        );
        database.close();
        return record;
      },
      LESSON_ID,
    );
    expect(persisted?.status).toBe("completed");

    // And no runtime API calls were made at any point
    expect(apiRequests).toEqual([]);
  });

  test("listening uses a local asset and never needs a third-party request", async ({
    page,
    context,
  }) => {
    // Audio may fail hard — the transcript keeps the lesson usable.
    await context.route(`**${AUDIO_SRC}`, (r) => r.abort());

    const thirdParty: Request[] = [];
    page.on("request", (req) => {
      const url = new URL(req.url());
      // Compare against the page's current origin at request time — the
      // listener registers before navigation, when url is about:blank.
      if (url.origin !== new URL(page.url()).origin && page.url() !== "about:blank") {
        thirdParty.push(req);
      }
    });

    await openLesson(page);

    // Native audio control, local asset only — no iframes anywhere.
    const audio = page.locator("audio");
    await expect(audio).toHaveCount(1);
    await expect(audio).toHaveAttribute("src", AUDIO_SRC);
    await expect(page.locator("iframe")).toHaveCount(0);

    // The language model stays usable with audio dead — transcript text.
    await expect(page.getByText("I'm Anna.", { exact: false }).first()).toBeVisible();

    await answerAndComplete(page);
    await page.reload();
    await expect(page.getByText(COMPLETION_STATEMENT)).toBeVisible();

    // The lesson itself never needed anything off-origin.
    expect(thirdParty).toEqual([]);
  });

  test("deep links render routes directly (SPA static hosting)", async ({
    page,
  }) => {
    await page.goto("/learn");
    await expect(page.getByRole("heading", { name: "Learn", exact: true })).toBeVisible();

    await page.goto("/review");
    await expect(page.getByRole("heading", { name: "Review", exact: true })).toBeVisible();

    await page.goto("/progress");
    await expect(page.getByRole("heading", { name: "Progress", exact: true })).toBeVisible();
  });

  test("synthetic fixture is not reachable in production", async ({
    page,
  }) => {
    // ?lesson=greetings is a test-only fixture — production must show a
    // deliberate not-found state, never the fixture lesson.
    await page.goto("/learn?lesson=greetings");
    await expect(page.getByText("Lesson not found")).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to Learn", exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Greetings", exact: true }),
    ).toHaveCount(0);
  });

  test("obsolete lesson ids do not count as completed", async ({ page }) => {
    // The old PCC lesson id is a different pedagogy — its progress row must
    // not satisfy the new canonical lesson.
    await page.goto("/learn?lesson=pcc-esol-l1m1-greetings");
    await expect(page.getByText("Lesson not found")).toBeVisible();
  });

  test("main navigation works across all four surfaces", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeVisible();

    await page.getByRole("link", { name: "Learn", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Learn", exact: true })).toBeVisible();

    await page.getByRole("link", { name: "Review", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Review", exact: true })).toBeVisible();
    await expect(page.getByText("Nothing to review yet")).toBeVisible();

    await page.getByRole("link", { name: "Progress", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Progress", exact: true })).toBeVisible();
  });

  test("accessibility smoke: headings, names, keyboard reachability, focus", async ({
    page,
  }) => {
    await openLesson(page);

    // Heading hierarchy: page h1 exists
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    // Audio has an accessible name
    await expect(page.locator("audio")).toHaveCount(1);

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

    // Disclosure is keyboard/AT reachable and exposes provenance on demand
    await page.getByText("Sources & license").click();
    await expect(page.getByText(/Public domain/).first()).toBeVisible();
  });
});
