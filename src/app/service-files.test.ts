import { describe, expect, it } from "vitest";
import { buildHumansTxt, buildSecurityTxt } from "@/features/site";

describe("market-scoped SEO service files", () => {
  it("publishes an English humans.txt without cross-market references", () => {
    const body = buildHumansTxt("en", "https://ludvik4.dev");

    expect(body).toContain("Owner: Ludvik4");
    expect(body).toContain("Site: https://ludvik4.dev/");
    expect(body).toContain("Language: English");
    expect(body).toContain("Sitemap: https://ludvik4.dev/sitemap.xml");
    expect(body).toContain("LLM overview: https://ludvik4.dev/llms.txt");
    expect(body).not.toContain("ludvik4.ru");
    expect(body).not.toContain("<html");
  });

  it("builds the EN security.txt canonical on the EN host", () => {
    const body = buildSecurityTxt("en", "https://ludvik4.dev");

    expect(body).toContain("Contact: https://t.me/ludvik4work");
    expect(body).toContain("Preferred-Languages: en");
    expect(body).toContain(
      "Canonical: https://ludvik4.dev/.well-known/security.txt",
    );
    expect(body).not.toContain("ludvik4.ru");
    expect(body).not.toContain("<html");
  });
});
