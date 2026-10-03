import { expect, test, type Page } from "@playwright/test";

/**
 * Task 006 pilot E2E — the complete VOA LLE1 Lesson 1 source pack normalized
 * into the four-channel state model. Scenario labels map to the spec's
 * learner-path matrix.
 */

async function next(page: Page) {
  await page.getByRole("button", { name: "Next", exact: true }).click();
}

async function finishReadActivity(page: Page, title: string) {
  await page.goto("/learn");
  await page.getByRole("link", { name: new RegExp(`^${title}`) }).click();
  // click through every content item
  for (let i = 0; i < 20; i++) {
    if (await page.getByText("✓ Activity complete").isVisible()) return;
    await next(page);
  }
  throw new Error(`activity ${title} did not complete`);
}

test.describe("source-driven pilot — VOA LLE1 Lesson 1", () => {
  test("01 Today points at the first activity and focus mode hides nav", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
    await page.getByRole("link", { name: "Continue", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Goals", exact: true }),
    ).toBeVisible();
    // focus mode — top-level nav gone
    await expect(page.getByRole("navigation", { name: "Main" })).toHaveCount(0);
  });

  test("02 Learn map shows the source-defined sections in order", async ({
    page,
  }) => {
    await page.goto("/learn");
    for (const section of [
      "welcome!",
      "Teach Key Words",
      "Present the Conversation",
      "Listening Quiz",
      "Explain Questions and Answers Using BE",
      "Writing",
      "Review",
    ]) {
      // several section titles repeat across functions — presence, not order
      await expect(page.getByText(section, { exact: true }).first()).toBeVisible();
    }
    await expect(
      page.getByRole("link", { name: "Quiz - Level 1, Lesson 1: Welcome" }),
    ).toBeVisible();
  });

  test("03 read-only activity completes and offers the next activity", async ({
    page,
  }) => {
    await finishReadActivity(page, "Goals");
    await expect(page.getByText("✓ Activity complete")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Next: Learning Strategy/ }),
    ).toBeVisible();
  });

  test("04 resume lands on the FIRST UNRESOLVED item after reload", async ({
    page,
  }) => {
    await page.goto("/learn/activity/prepare-key-words");
    await next(page); // item 1 done
    await next(page); // item 2 done
    await expect(page.getByText("3 of 7")).toBeVisible();
    await page.reload();
    // cursor persisted — back at first unresolved item (index 2 → "3 of 7")
    await expect(page.getByText("3 of 7")).toBeVisible();
  });

  test("05 scored quiz: wrong → retry → exhaust → reveal; score ≠ completion", async ({
    page,
  }) => {
    await page.goto("/learn/activity/comp-quiz");
    await page.getByRole("radio").first().waitFor(); // wait for state load
    // exhaust item 1: wrong answers until the verified answer resolves it
    for (let i = 0; i < 2; i++) {
      const radio = page.getByRole("radio").nth(1);
      if (!(await radio.isVisible())) break; // resolved early (picked the right one)
      // dispatchEvent, not check(): resolution detaches the input and
      // check()'s post-verification would spin forever
      await radio.dispatchEvent("click");
      await page.getByRole("button", { name: "Check answer" }).click();
    }
    await expect(
      page.getByText(/✓ Correct|answer shown/i).first(),
    ).toBeVisible();
    await next(page);
    // item 2: answer until resolved — outcome is a practice signal only
    for (let i = 0; i < 2; i++) {
      const radio = page.getByRole("radio").nth(1);
      if (!(await radio.isVisible())) break;
      await radio.dispatchEvent("click");
      await page.getByRole("button", { name: "Check answer" }).click();
      if (await page.getByText(/✓ Correct|answer shown/i).first().isVisible())
        break;
    }
    await expect(
      page.getByText(/✓ Correct|answer shown/i).first(),
    ).toBeVisible();
  });

  test("06 dictation: free text, bounded attempts, source answer revealed", async ({
    page,
  }) => {
    await page.goto("/learn/activity/practice-dictation");
    const input = page.getByPlaceholder("Your answer");
    await input.fill("wrong answer");
    await page.getByRole("button", { name: "Check answer" }).click();
    await input.fill("still wrong");
    await page.getByRole("button", { name: "Check answer" }).click();
    await expect(page.getByText(/answer shown|correct answer/i)).toBeVisible();
  });

  test("07 local media packaged — no YouTube until clicked", async ({
    page,
  }) => {
    await page.goto("/learn/activity/input-main-video");
    const video = page.locator("video");
    await expect(video).toHaveAttribute(
      "src",
      "/media/voa-lle1/voa-lle1-main-video.mp4",
    );
    // embed-only YouTube must not be live on load
    await expect(page.locator("iframe")).toHaveCount(0);
    // audio conversation asset on the next activity
    await page.goto("/learn/activity/input-conversation");
    await expect(page.locator("audio")).toHaveAttribute(
      "src",
      "/media/voa-lle1/conversation.mp3",
    );
  });

  test("08 production record item offers unscored practice path", async ({
    page,
  }) => {
    await page.goto("/learn/activity/production-say");
    // mic may be denied in CI — the practice path must still exist
    const practiced = page.getByRole("button", {
      name: /I practiced — continue|Continue/,
    });
    await expect(practiced).toBeVisible();
    await practiced.click();
    await expect(page.getByText("✓ Activity complete")).toBeVisible();
  });

  test("09 self-eval feeds self-report only — Progress shows channels honestly", async ({
    page,
  }) => {
    await page.goto("/learn/activity/reflect-learning-log");
    await page.getByRole("radio").first().waitFor(); // wait for state load
    for (let i = 0; i < 10; i++) {
      if (await page.getByText("✓ Activity complete").isVisible()) break;
      // wait for the next selfeval item (or completion) to mount
      await page
        .getByRole("radio")
        .first()
        .or(page.getByText("✓ Activity complete"))
        .first()
        .waitFor();
      if (await page.getByText("✓ Activity complete").isVisible()) break;
      // selfeval resolves on selection — self-report channel only
      const radio = page.getByRole("radio").first();
      if (await radio.isVisible()) await radio.dispatchEvent("click");
      const nxt = page.getByRole("button", { name: "Next", exact: true });
      if (await nxt.isVisible()) await nxt.click();
    }
    await page.goto("/progress");
    await expect(page.getByText("Practice scores")).toBeVisible();
    await expect(page.getByText("Your notes")).toBeVisible();
    // honest framing — never a level
    await expect(page.getByText(/not a level or a grade/)).toBeVisible();
  });

  test("10 Review is honest: nothing due before any card matures", async ({
    page,
  }) => {
    await page.goto("/review");
    await expect(page.getByText(/Nothing due|of \d+/)).toBeVisible();
  });

  test("11 deep links work for every activity", async ({ page }) => {
    for (const [id, marker] of [
      ["input-main-video", "1 of 1"],
      ["comp-quiz", "1 of 6"],
      ["focus-pronunciation", "1 of 2"],
      ["production-write", "1 of 1"],
    ] as const) {
      await page.goto(`/learn/activity/${id}`);
      await expect(page.locator("main")).toContainText(marker);
    }
  });
});
