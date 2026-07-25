import { expect, test } from "@playwright/test";

test.describe("golden path smoke", () => {
  test("home renders the brand and hero headline", async ({ page }) => {
    await page.goto("/");

    // Wordmark in the sticky header (first "Ludvik4" on the page).
    await expect(
      page.getByText("Ludvik4", { exact: true }).first(),
    ).toBeVisible();
    // Hero headline.
    await expect(
      page.getByRole("heading", { name: /Цифровые продукты/ }),
    ).toBeVisible();
    // Primary CTA to the contact section.
    await expect(
      page.getByRole("link", { name: "Обсудить задачу" }).first(),
    ).toBeVisible();
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

  test("the retired /en landing permanently redirects to the root", async ({
    request,
  }) => {
    // Pre-ТЗ1 the international landing lived at /en and external links still
    // point there (qa-pilot README). ТЗ 2 requires a permanent redirect to the
    // EN root, not a 404 — see next.config.ts `redirects()`.
    const res = await request.get("/en", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toBe("/");

    const nested = await request.get("/en/anything", { maxRedirects: 0 });
    expect(nested.status()).toBe(308);
    expect(nested.headers()["location"]).toBe("/");
  });

  test("SPA-navigation gate (spec §5.6-1): Link navigation stays client-side", async ({
    page,
  }) => {
    // The landing is a single page with anchor CTAs, so exercise the gate on
    // the not-found page's cross-route "Go home" <Link>.
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
