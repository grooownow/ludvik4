import { z } from "zod";

const schema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    LIFTKIT_DB: z.enum(["pglite", "remote"]).default("pglite"),
    DATABASE_URL: z.url().optional(),
    PGLITE_DATA_DIR: z.string().default(".pglite"),

    // App
    // Default port mirrors config/ports.ts APP_PORT (kept literal to avoid a
    // config/ -> src/ import; src/lib/ports.test.ts guards the two staying
    // in sync).
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3210"),

    // Which market this build serves. Selects language, copy, metadata, JSON-LD
    // and which routes/SEO surfaces are published. A build serves exactly one
    // market and there is no runtime RU/EN switcher: `ru` = Russian market
    // (blog + RSS live here), `en` = international market (no Russian blog).
    // Each market runs with its own NEXT_PUBLIC_APP_URL (its own domain).
    SITE_MARKET: z.enum(["ru", "en"]).default("ru"),

    // Auth (optional — skeleton boots with zero config)
    AUTH_SECRET: z.string().optional(),
    // Read by next-auth itself (not by our own code) to trust the
    // Host/X-Forwarded-Host header; required for `/api/auth/*` to work
    // under `pnpm start` and any other non-Vercel prod-mode host. See
    // .env.example for the full explanation.
    AUTH_TRUST_HOST: z.string().optional(),
    AUTH_GITHUB_ID: z.string().optional(),
    AUTH_GITHUB_SECRET: z.string().optional(),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),

    // Auth dev bypass: when true, requireUser() returns the seeded admin and
    // middleware lets /dashboard through — zero-friction local runs.
    //
    // Defaults to FALSE so it can never leak into a build or a production
    // server. `pnpm dev` turns it on via `.env.development`, which Next loads
    // only when NODE_ENV=development. Defaulting it to true would break
    // `pnpm build`: Next builds with NODE_ENV=production and evaluates this
    // module, so the guard below would reject a plain `pnpm build`.
    AUTH_DEV_BYPASS: z.stringbool().default(false),

    // Seed admin credentials (dev defaults; overridden per project via .env).
    // scripts/seed.ts hashes the password and refuses to run in production.
    SEED_ADMIN_EMAIL: z.email().default("admin@example.local"),
    SEED_ADMIN_PASSWORD: z.string().min(8).default("dev-admin-pw"),

    // Observability
    SENTRY_DSN: z.url().optional(),
    NEXT_PUBLIC_SENTRY_DSN: z.url().optional(),
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace"])
      .default("info"),

    // Analytics
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),

    // SEO — search-engine ownership verification (meta-tag tokens). Both
    // optional slots: unset → no <meta> tag is emitted (src/app/layout.tsx).
    GOOGLE_SITE_VERIFICATION: z.string().optional(),
    YANDEX_VERIFICATION: z.string().optional(),

    // Lead form (contact) — delivery + spam captcha. All optional: with none
    // set the form works locally/preview and logs a warning instead of
    // dropping silently; see src/features/lead/notify.ts.
    // Telegram: create a bot via @BotFather (token) and put your numeric chat
    // id (from @userinfobot) in TELEGRAM_CHAT_ID.
    TELEGRAM_BOT_TOKEN: z.string().optional(),
    TELEGRAM_CHAT_ID: z.string().optional(),
    // Email via Resend: verify ludvik4.dev to send from an @ludvik4.dev address.
    RESEND_API_KEY: z.string().optional(),
    LEAD_EMAIL_TO: z.email().optional(),
    LEAD_EMAIL_FROM: z.string().optional(),
    // Cloudflare Turnstile: SECRET verifies server-side, SITE_KEY renders the
    // widget. Both needed to switch the captcha on.
    TURNSTILE_SECRET_KEY: z.string().optional(),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.LIFTKIT_DB === "remote" && !val.DATABASE_URL) {
      ctx.addIssue({
        code: "custom",
        path: ["DATABASE_URL"],
        message: "DATABASE_URL is required when LIFTKIT_DB=remote",
      });
    }

    if (val.NODE_ENV === "production" && val.AUTH_DEV_BYPASS) {
      ctx.addIssue({
        code: "custom",
        path: ["AUTH_DEV_BYPASS"],
        message:
          "AUTH_DEV_BYPASS must be false (or unset to false) when NODE_ENV=production",
      });
    }
  });

export type Env = z.infer<typeof schema>;

export function parseEnv(raw: Partial<NodeJS.ProcessEnv>): Env {
  const result = schema.safeParse(raw);
  if (!result.success) {
    const details = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("\n  ");
    throw new Error(`Invalid environment:\n  ${details}`);
  }
  return result.data;
}

export const env: Env = parseEnv(process.env);
