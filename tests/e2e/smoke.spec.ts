import { expect, test } from "@playwright/test";

test.describe("golden path smoke", () => {
  test("home opens on the exhibit stage with the page H1 and a way to /contact", async ({
    page,
  }) => {
    await page.goto("/");

    // The exhibition home (docs/specs/immersive-home.md): the stage fills the
    // first screen; the H1 is visually hidden but present for search and
    // screen readers. CI has no GPU, so the pre-rendered still is shown.
    await expect(page.getByRole("region", { name: "Ludvik" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /Сайты, автоматизация и веб-приложения/,
    );
    await expect(page.getByTestId("exhibit-label")).toContainText("Экспонат");
    await expect(
      page.getByRole("link", { name: /Ludvik4/ }).first(),
    ).toBeVisible();
    // The closing call to action leads to the contact page.
    await expect(
      page.getByRole("link", { name: "Обсудить проект" }),
    ).toHaveAttribute("href", "/contact");
  });

  test("unauthenticated /dashboard redirects to /signin", async ({ page }) => {
    await page.goto("/dashboard");
    // Middleware appends ?callbackUrl=...; match the path only.
    await expect(page).toHaveURL(/\/signin(\?|$)/);
    // The sign-in page now renders a credentials form, not a dead-end card.
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("unknown route renders the not-found page", async ({ page }) => {
    await page.goto("/nonexistent");

    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
  });

  test("SPA-navigation gate (spec §5.6-1): Link navigation stays client-side", async ({
    page,
  }) => {
    // Exercise the gate on the not-found page's cross-route "Go home" <Link>.
    await page.goto("/nonexistent");

    // A full page reload wipes in-memory window state; client-side (SPA)
    // navigation preserves it. This is a reliable signal, unlike
    // performance.getEntriesByType("navigation").length, which reports
    // exactly 1 for both SPA and full-reload navigations and is therefore
    // vacuous as a gate.
    await page.evaluate(() => {
      (window as unknown as Record<string, boolean>)["__spaMarker"] = true;
    });

    await page.getByRole("link", { name: "Go home" }).click();
    await expect(page).toHaveURL(/\/$/);

    const markerSurvived = await page.evaluate(
      () =>
        (window as unknown as Record<string, boolean>)["__spaMarker"] === true,
    );
    expect(markerSurvived).toBe(true); // full reload would wipe window state
  });
});
