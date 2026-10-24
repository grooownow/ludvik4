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

  test("landing shows the collection and no FAQ or prices", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /Всё, что работает в браузере/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Частые вопросы" }),
    ).toHaveCount(0);
    await expect(page.getByText(/₽/)).toHaveCount(0);
  });

  test("the Work menu item scrolls to the work section", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "the phone menu sits in a collapsed <details>");
    await page.goto("/");

    await page.getByRole("link", { name: "Работы" }).first().click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator("#work")).toBeInViewport();
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
