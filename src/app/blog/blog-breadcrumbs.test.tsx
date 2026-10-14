import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// MDXRemote is an async server component that never resolves under jsdom;
// the article body is irrelevant to the breadcrumb chrome around it.
vi.mock("next-mdx-remote-client/rsc", () => ({ MDXRemote: () => null }));

// The blog pages read SITE_MARKET at module load, so each case stubs the env
// and imports a fresh module graph.
async function loadBlogPages(market: "ru" | "en") {
  vi.stubEnv("SITE_MARKET", market);
  vi.resetModules();
  const { default: BlogPage } = await import("./page");
  const articlePage = await import("./[slug]/page");
  return { BlogPage, articlePage };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe.each([
  { market: "en" as const, nav: "Breadcrumbs", home: "Home" },
  { market: "ru" as const, nav: "Хлебные крошки", home: "Главная" },
])("blog breadcrumbs ($market)", ({ market, nav, home }) => {
  it("labels the home crumb in the market language on the index", async () => {
    const { BlogPage } = await loadBlogPages(market);
    render(<BlogPage />);

    const breadcrumbs = screen.getByRole("navigation", { name: nav });
    expect(
      within(breadcrumbs).getByRole("link", { name: home }),
    ).toHaveAttribute("href", "/");
  });

  it("labels the home crumb in the market language on an article", async () => {
    const { articlePage } = await loadBlogPages(market);
    const [first] = articlePage.generateStaticParams();
    expect(first).toBeDefined();
    render(await articlePage.default({ params: Promise.resolve(first!) }));

    const breadcrumbs = screen.getByRole("navigation", { name: nav });
    expect(
      within(breadcrumbs).getByRole("link", { name: home }),
    ).toHaveAttribute("href", "/");
  });
});
