import { buildSecurityTxt, MARKET } from "@/features/site";
import { env } from "@/lib/env";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(buildSecurityTxt(MARKET, env.NEXT_PUBLIC_APP_URL), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
