"use client";

import Script from "next/script";

/**
 * Cloudflare Turnstile widget. Renders the challenge div and loads the script;
 * on solve, Turnstile injects a hidden `cf-turnstile-response` input into the
 * enclosing form, which the server action reads. Only mounted when a site key
 * is configured (see LeadForm).
 */
export function TurnstileWidget({ siteKey }: { siteKey: string }) {
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="auto" />
    </>
  );
}
