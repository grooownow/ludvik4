import { expect, test } from "@playwright/test";

test.describe("SEO surfaces", () => {
  test("commercial service and case pages are reachable", async ({ page }) => {
    await page.goto("/uslugi/razrabotka-mvp");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Разработка MVP веб-приложения",
      }),
    ).toBeVisible();

    await page.goto("/cases/fortnoise");
    await expect(
      page.getByRole("heading", { level: 1, name: "FortNoise" }),
    ).toBeVisible();
  });

  test("landing shows the FAQ and an item expands on click", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Частые вопросы" }),
    ).toBeVisible();

    const firstQuestion = page.getByRole("button", {
      name: /Сколько стоит разработка/,
    });
    await firstQuestion.click();
    // Distinct substring of the first FAQ (pricing) answer.
    await expect(
      page.getByText(/после разбора и оценки задачи/).first(),
    ).toBeVisible();
  });

  test("header link navigates to the blog list client-side", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Блог" }).first().click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(
      page.getByRole("heading", { name: /Заметки о разработке/ }),
    ).toBeVisible();
  });

  test("blog footer reaches the bottom of the viewport on short content", async ({
    page,
  }) => {
    await page.goto("/blog");

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const box = await footer.boundingBox();
    const viewport = page.viewportSize();
    // Footer bottom edge is at (or below) the viewport bottom — a footer
    // floating mid-page fails this by hundreds of pixels.
    expect(box!.y + box!.height).toBeGreaterThanOrEqual(viewport!.height - 1);
  });

  test("llms.txt serves the brand summary", async ({ request }) => {
    const response = await request.get("/llms.txt");

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("# Ludvik4");
  });

  test("RSS feed serves valid channel metadata", async ({ request }) => {
    const response = await request.get("/blog/rss.xml");

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("<title>Блог Ludvik4</title>");
  });

  test("the old second-locale route /en is not published, only redirected", async ({
    request,
  }) => {
    // One build = one market: no build renders a second-locale page at /en —
    // that removal is what ТЗ 1 scenario 6 (“no indexable second-locale
    // route”) locks. ТЗ 2 then requires the retired URL to keep answering for
    // external links (qa-pilot README), so it is a permanent redirect to the
    // root rather than a 404. A 308 is not indexable as a duplicate locale.
    const response = await request.get("/en", { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers()["location"]).toBe("/");

    // Anything that used to live under it redirects too.
    const nested = await request.get("/en/anything", { maxRedirects: 0 });
    expect(nested.status()).toBe(308);
    expect(nested.headers()["location"]).toBe("/");

    // Following it lands on the market's own single canonical root.
    const followed = await request.get("/en");
    expect(followed.status()).toBe(200);
    expect(new URL(followed.url()).pathname).toBe("/");
  });
});
