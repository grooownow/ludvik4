import { expect, test } from "@playwright/test";

// The RU works section: /cases rows with screen strips, case pages with the
// fullscreen gallery (docs/superpowers/specs/2026-11-11-works-gallery-design.md).

test.describe("works section", () => {
  test("lists all five works and opens a screen from a strip", async ({
    page,
  }) => {
    await page.goto("/cases");
    await expect(page.getByRole("heading", { level: 2 })).toHaveText([
      "smallFriendFiles",
      "FortNoise",
      "Gridfin",
      "Тайный Санта",
      "qa-pilot",
    ]);

    await page
      .getByRole("button", { name: "Открыть: Анкета, десктоп" })
      .first()
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName("Анкета · десктоп");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });

  test("case page: gallery pages, closes on an outside click, page has no horizontal scroll", async ({
    page,
  }) => {
    await page.goto("/cases/fortnoise");
    const scrollX = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(scrollX).toBe(0);

    await page
      .getByRole("button", { name: "Открыть: Афиша, десктоп" })
      .first()
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("1 / 14");
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText("2 / 14");
    await page.mouse.click(10, 10);
    await expect(dialog).toHaveCount(0);
  });

  test("the live project opens in a new tab", async ({ page }) => {
    await page.goto("/cases/gridfin");
    const link = page.getByRole("link", { name: /Открыть лендинг/ });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("href", "https://ludvik4.ru/gridfin/");
  });
});
