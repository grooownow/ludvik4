// The works ludvik4.dev shows (every RU work except FortNoise), in the RU
// order. A leaf module: the sitemap reads it without loading the galleries.
export const DEV_CASE_SLUGS = [
  "smallfriendfiles",
  "gridfin",
  "secret-santa",
  "qa-pilot",
] as const;

export type DevCaseSlug = (typeof DEV_CASE_SLUGS)[number];
