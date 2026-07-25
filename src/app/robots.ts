import type { MetadataRoute } from "next";
import { buildRobots } from "@/features/site";
import { env } from "@/lib/env";

export const dynamic = "force-static";

// See buildRobots in the site slice: /dashboard and /signin are disallowed in
// every build, and /blog is crawlable everywhere — on the EN build it 301s to
// the RU domain, and a blocked URL's redirect is never followed.
export default function robots(): MetadataRoute.Robots {
  return buildRobots(env.NEXT_PUBLIC_APP_URL);
}
