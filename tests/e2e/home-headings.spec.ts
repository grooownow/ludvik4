import { expect, test } from "@playwright/test";

/**
 * Section headings of the exhibition home sit on one line on desktop
 * (owner, 2026-10-23). The e2e build is the RU market, whose collection title
 * is the longest: it must not wrap and must not run past its column.
 */
for (const width of [1024, 1100, 1280, 1440]) {
  test(`section headings are one line at ${width}px`, async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "desktop layout only");
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const id of ["collection", "how-it-works", "work"]) {
      const heading = page.locator(`#${id} h2`).first();
      const fit = await heading.evaluate((el) => {
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
        return {
          lines: el.getBoundingClientRect().height / lineHeight,
          overflow: el.scrollWidth - el.clientWidth,
        };
      });
      expect(fit.lines, `#${id} heading lines`).toBeLessThan(1.5);
      expect(fit.overflow, `#${id} heading overflow`).toBeLessThanOrEqual(0);
    }
  });
}
