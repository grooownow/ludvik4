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
    await expect(page.getByText(/Оценка бесплатна/).first()).toBeVisible();
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
});
