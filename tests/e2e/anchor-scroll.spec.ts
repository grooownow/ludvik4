import { expect, test, type Page } from "@playwright/test";

/**
 * Regression cover for in-page anchors (src/features/site/anchor-link.tsx).
 *
 * Both cases were live on ludvik4.dev on 2026-08-10 and neither is caught by
 * a first click, which is why they survived: the CTA works exactly once per
 * page load, and the wordmark clears the hash while leaving you parked at the
 * section you were trying to leave.
 *
 * `:visible` picks the header CTA on desktop and the hero CTA on mobile, where
 * the header nav collapses into a <details> menu — both render the same
 * component, so either is a fair witness.
 */

const scrollY = (page: Page) => page.evaluate(() => Math.round(window.scrollY));

/**
 * The scroll is smooth, so the position keeps moving for a few hundred ms
 * after the click. Driving the page mid-animation makes the browser cancel or
 * resume it unpredictably — wait for two identical readings before touching
 * the scroll position again.
 */
async function waitForScrollToSettle(page: Page) {
  let previous = -1;
  await expect
    .poll(
      async () => {
        const current = await scrollY(page);
        const settled = current === previous;
        previous = current;
        return settled;
      },
      { intervals: [100, 100, 100, 150, 200, 250] },
    )
    .toBe(true);
}

async function scrollToTop(page: Page) {
  await waitForScrollToSettle(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => scrollY(page)).toBe(0);
}

test.describe("in-page anchors", () => {
  test("the contact CTA scrolls to the form on every click, not just the first", async ({
    page,
  }) => {
    await page.goto("/");
    const cta = page.locator('a[href$="#contact"]:visible').first();
    const contact = page.locator("#contact");

    await cta.click();
    await expect(contact).toBeInViewport();
    await expect(page).toHaveURL(/#contact$/);

    // The reader scrolls back up to re-read something, then clicks the CTA
    // again. The hash is already "#contact", so the click navigates nowhere.
    await scrollToTop(page);
    await expect(contact).not.toBeInViewport();

    await cta.click();
    await expect(contact).toBeInViewport();
  });

  test("the wordmark drops the anchor from the URL and returns to the top", async ({
    page,
  }) => {
    await page.goto("/#contact");
    await expect(page.locator("#contact")).toBeInViewport();

    await page
      .getByRole("link", { name: /Ludvik4/ })
      .first()
      .click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page).not.toHaveURL(/#/);
    await expect.poll(() => scrollY(page)).toBe(0);
  });
});
