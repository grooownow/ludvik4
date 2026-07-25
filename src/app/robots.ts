import type { MetadataRoute } from "next";
import { buildRobots } from "@/features/site";
import { env } from "@/lib/env";

export const dynamic = "force-static";

// Market-scoped robots — see buildRobots in the site slice. /dashboard and
// /signin are disallowed in every build; a non-RU build also disallows /blog
// (a RU-only surface that 404s there).
export default function robots(): MetadataRoute.Robots {
  return buildRobots(env.SITE_MARKET, env.NEXT_PUBLIC_APP_URL);
}
