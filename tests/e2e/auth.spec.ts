import { expect, test } from "@playwright/test";

// The e2e server runs with AUTH_DEV_BYPASS=false (playwright.config.ts) and a
// seeded admin (db:reset in the webServer command). These are the env
// defaults; keep them in sync with .env.example if the defaults change.
const EMAIL = "admin@example.local";
const PASSWORD = "dev-admin-pw";

test.describe("credentials login", () => {
  test("seeded admin can sign in and reach the dashboard", async ({ page }) => {
    await page.goto("/signin");
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard(\?|$)/);
  });

  test("email is case- and whitespace-insensitive", async ({ page }) => {
    await page.goto("/signin");
    // Browsers and password managers routinely capitalise the first letter.
    await page.getByLabel("Email").fill(`  ${EMAIL.toUpperCase()}  `);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard(\?|$)/);
  });

  test("wrong password stays on /signin and shows an error", async ({
    page,
  }) => {
    await page.goto("/signin");
    await page.getByLabel("Email").fill(EMAIL);
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/signin(\?|$)/);
    // The error is surfaced under the form. (Target the text rather than
    // role=alert, which also matches Next's route announcer.)
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    // The email the user typed is preserved.
    await expect(page.getByLabel("Email")).toHaveValue(EMAIL);
  });
});
