import type { MetadataRoute } from "next";
import { buildRobots } from "@/features/site";
import { env } from "@/lib/env";

export const dynamic = "force-static";

// See buildRobots in the site slice: public surfaces, including each market's
// localized blog, stay crawlable.
export default function robots(): MetadataRoute.Robots {
  return buildRobots(env.NEXT_PUBLIC_APP_URL);
}
