import { expect, test } from "@playwright/test";

test.describe("golden path smoke", () => {
  test("home renders headline and theme toggle flips dark mode", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByText("Liftkit", { exact: true })).toBeVisible();

    const html = page.locator("html");
    const toggle = page.getByRole("button", { name: "Toggle theme" });

    await expect(html).not.toHaveClass(/dark/);
    await toggle.click();
    await expect(html).toHaveClass(/dark/);
    await toggle.click();
    await expect(html).not.toHaveClass(/dark/);
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
    await page.goto("/");

    // A full page reload wipes in-memory window state; client-side (SPA)
    // navigation preserves it. This is a reliable signal, unlike
    // performance.getEntriesByType("navigation").length, which reports
    // exactly 1 for both SPA and full-reload navigations and is therefore
    // vacuous as a gate.
    await page.evaluate(() => {
      (window as unknown as Record<string, boolean>)["__spaMarker"] = true;
    });

    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/signin$/);

    const markerSurvived = await page.evaluate(
      () =>
        (window as unknown as Record<string, boolean>)["__spaMarker"] === true,
    );
    expect(markerSurvived).toBe(true); // full reload would wipe window state
  });
});
