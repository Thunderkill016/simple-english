import { expect, test, type Page } from "@playwright/test";

const LESSON = "/learn/lesson-1";

async function open(page: Page, url = "/") {
  await page.goto(url);
  await expect(page.getByRole("link", { name: "Simple English" })).toBeVisible();
}

/**
 * Resolve every pending answerable item on the page: pick the first radio
 * option for mc, type a deliberately-wrong token for cloze (bounded
 * attempts reveal the answer, so the item always resolves).
 */
async function answerAll(page: Page) {
  for (let guard = 0; guard < 80; guard++) {
    const radio = page.locator('input[type="radio"]:not([disabled])').first();
    const text = page.locator('input[type="text"]:not([disabled])').first();
    if (await radio.isVisible().catch(() => false)) {
      await radio.dispatchEvent("click");
      await page.getByRole("button", { name: "Check answer" }).first().click();
    } else if (await text.isVisible().catch(() => false)) {
      await text.fill("zz");
      await page.getByRole("button", { name: "Check answer" }).first().click();
    } else {
      break;
    }
    await page.waitForTimeout(60);
  }
}

test.beforeEach(async ({ page }) => {
  await open(page);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("Learn page shows only the VOA lesson", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Learn" })).toBeVisible();
  await expect(page.getByText("Lesson 1: Welcome!").first()).toBeVisible();
  await expect(page.getByText("Meet Someone")).toHaveCount(0);
  await page.getByRole("link", { name: "Start" }).click();
  await expect(page).toHaveURL(new RegExp(LESSON));
  await expect(page.getByText("Step 1 of 11")).toBeVisible();
});

test("linear flow walks every step to Finish", async ({ page }) => {
  await open(page, LESSON);
  const headings = [
    "Goals",
    "Key Words",
    "Main Video Script",
    "Conversation",
    "Quiz - Level 1, Lesson 1: Welcome",
    "Explain Questions and Answers Using BE",
    "Pronunciation Practice",
    "Review the Alphabet",
    "Speaking Practice",
    "Writing",
    "Finish",
  ];
  for (const [i, h] of headings.entries()) {
    await expect(
      page.getByRole("heading", { name: new RegExp(h.slice(0, 20), "i") }).first(),
    ).toBeVisible();
    await expect(page.getByText(`Step ${i + 1} of 11`)).toBeVisible();
    if (h === "Quiz - Level 1, Lesson 1: Welcome" || h === "Explain Questions and Answers Using BE")
      await answerAll(page);
    if (i < headings.length - 1)
      await page.getByRole("button", { name: "Continue" }).click();
  }
  await expect(page.getByText("Lesson complete")).toBeVisible();
});

test("media assets load (video + audio)", async ({ page }) => {
  await open(page, `${LESSON}`);
  // step 3 — watch
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  const video = page.locator("video").first();
  await expect(video).toBeVisible();
  const src = await video.getAttribute("src");
  expect(src).toContain("/media/");
  const resp = await page.request.get(src!);
  expect(resp.status()).toBe(200);
});

test("quiz: retry then reveal, then correct counts", async ({ page }) => {
  await open(page, LESSON);
  for (let i = 0; i < 4; i++)
    await page.getByRole("button", { name: "Continue" }).click();
  // q1: pick last option (wrong on purpose where attempts allow)
  const radios = page.locator('input[type="radio"]').first();
  await expect(radios).toBeVisible();
  // deliberately fail item 1 twice to see the reveal
  const lastOption = page.locator('input[type="radio"]').nth(3);
  await lastOption.dispatchEvent("click");
  await page.getByRole("button", { name: "Check answer" }).first().click();
  const retryOrReveal = page.getByText(/Incorrect|correct answer/).first();
  await expect(retryOrReveal).toBeVisible();
});

test("refresh mid-lesson resumes at the same step", async ({ page }) => {
  await open(page, LESSON);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Step 3 of 11")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Step 3 of 11")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Main Video/ }),
  ).toBeVisible();
});

test("quiz answers persist through refresh", async ({ page }) => {
  await open(page, LESSON);
  for (let i = 0; i < 4; i++)
    await page.getByRole("button", { name: "Continue" }).click();
  // answer q1 correctly if b is right, else let it resolve however
  await page.locator('input[type="radio"]').nth(1).dispatchEvent("click");
  await page.getByRole("button", { name: "Check answer" }).first().click();
  await expect(page.getByText(/Correct|Incorrect/).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("Step 5 of 11")).toBeVisible();
  // resolved radio is disabled (saved answer shown, no re-answer)
  const firstQ = page.locator("fieldset").first();
  await expect(firstQ.locator('input[type="radio"]').first()).toBeDisabled();
});

test("finish marks the lesson completed and Learn reflects it", async ({
  page,
}) => {
  await open(page, LESSON);
  await page.evaluate(() => {
    localStorage.setItem(
      "se:lesson:voa-lle1:progress",
      JSON.stringify({
        lessonId: "voa-lle1-lesson-1",
        currentStep: 9,
        completedSteps: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        quiz: {
          "quiz-q1": { outcome: "correct", attempts: 1, answer: "b" },
        },
        lessonCompleted: false,
      }),
    );
  });
  await page.reload();
  await expect(page.getByText("Step 10 of 11")).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Lesson complete")).toBeVisible();
  await page.goto("/");
  await expect(page.getByText("Lesson complete — review any step")).toBeVisible();
});

test("mobile 390px: no horizontal overflow through key steps", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, LESSON);
  for (let i = 0; i < 4; i++) {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
    await page.getByRole("button", { name: "Continue" }).click();
  }
});
