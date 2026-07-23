import { expect, test } from "@playwright/test";

test.describe("SEO surfaces", () => {
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

  test("the old second-locale route /en is not published (404)", async ({
    request,
  }) => {
    // One build = one market. The RU build must not expose an /en route — its
    // removal is what scenario 6 (“no indexable second-locale route”) locks.
    const response = await request.get("/en");
    expect(response.status()).toBe(404);
  });
});
