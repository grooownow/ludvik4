import type { Market } from "./content";

export function buildHumansTxt(market: Market, baseUrl: string): string {
  const root = baseUrl.replace(/\/$/, "");
  const isEnglish = market === "en";

  return `/* TEAM */

Owner: Ludvik4
Site: ${root}/
Contact: https://t.me/ludvik4work
Location: ${isEnglish ? "Europe · Remote · Worldwide" : "Remote"}

/* SITE */

Language: ${isEnglish ? "English" : "Russian"}
Primary topic: websites, business workflow automation, MVP development, web applications, and AI-assisted development
Canonical URL: ${root}/
Sitemap: ${root}/sitemap.xml
LLM overview: ${root}/llms.txt
`;
}

export function buildSecurityTxt(market: Market, baseUrl: string): string {
  const root = baseUrl.replace(/\/$/, "");
  return `Contact: https://t.me/ludvik4work
Preferred-Languages: ${market === "en" ? "en" : "ru, en"}
Canonical: ${root}/.well-known/security.txt
`;
}
