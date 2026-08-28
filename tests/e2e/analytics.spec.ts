import { expect, test } from "@playwright/test";

/**
 * The e2e suite builds with the default market, so this runs against the RU
 * storefront — which is exactly the build where the interesting assertion is
 * the negative one. RU is served as a static export from Timeweb, where
 * `/_vercel/insights/*` does not exist and where the privacy notice promises
 * no analytics at all.
 *
 * The positive half — that a `<Link>` navigation on the EN build produces a
 * second `$pageview` — cannot be proven here without switching the whole
 * suite to `SITE_MARKET=en`, which would take every existing RU-facing test
 * with it. The regression that matters (dropping posthog-js's `defaults`
 * option, which silently reverts `capture_pageview` to initial-load-only) is
 * pinned instead by `src/components/analytics-provider.test.tsx`.
 */
test.describe("analytics stays off the Russian storefront", () => {
  test("no analytics request leaves the page", async ({ page }) => {
    const analyticsRequests: string[] = [];

    page.on("request", (request) => {
      const url = request.url();
      if (/posthog\.com|\/_vercel\/insights/.test(url)) {
        analyticsRequests.push(url);
      }
    });

    await page.goto("/");
    await page.getByRole("link", { name: "Обсудить задачу" }).first().click();

    expect(analyticsRequests).toEqual([]);
  });

  test("no analytics script is served in the markup", async ({ page }) => {
    const response = await page.goto("/");
    const html = (await response?.text()) ?? "";

    expect(html).not.toContain("_vercel/insights");
    expect(html).not.toContain("posthog");
  });
});
