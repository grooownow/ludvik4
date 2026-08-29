/**
 * Builds (or rebuilds) the "Ludvik4 — behaviour" dashboard in PostHog.
 *
 * The dashboard answers the two questions the analytics slices were built for:
 * which calls to action get pressed, and how long visitors stay before leaving
 * and why. Tiles read top to bottom as one visit.
 *
 * Query shapes are not invented — they were read back from the project's own
 * existing insights (`GET /api/projects/:id/insights/`), so they match the
 * PostHog version actually running rather than a docs page.
 *
 * Usage: POSTHOG_PERSONAL_API_KEY=phx_... pnpm tsx scripts/build-posthog-dashboard.ts
 * The key needs Insight:Write, Dashboard:Write and Query:Read, scoped to this
 * project only. Revoke it once the dashboard exists — nothing here runs again
 * unless you rebuild.
 *
 * Re-running replaces the tiles of the dashboard with the same name rather than
 * creating a second one.
 */

const HOST = "https://eu.posthog.com";
const PROJECT_ID = "225446";
const DASHBOARD_NAME = "Ludvik4 — behaviour";

const key = process.env.POSTHOG_PERSONAL_API_KEY;
if (!key) {
  console.error(
    "POSTHOG_PERSONAL_API_KEY is not set. Put it in .env.local (gitignored) and run with `set -a; . ./.env.local; set +a`.",
  );
  process.exit(1);
}

async function api<T>(
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const response = await fetch(`${HOST}/api/projects/${PROJECT_ID}/${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });

  if (!response.ok) {
    // Never echo the key; the detail is enough to diagnose a scope problem.
    throw new Error(
      `${init?.method ?? "GET"} ${path} → ${response.status}: ${await response.text()}`,
    );
  }

  return response.json() as Promise<T>;
}

const DATE_RANGE = { date_from: "-30d", explicitDate: false };

/** A single event series, optionally counting unique visitors rather than events. */
function series(event: string, custom_name?: string, math?: "dau") {
  return { kind: "EventsNode", name: event, event, custom_name, math };
}

function trends(options: {
  series: ReturnType<typeof series>[];
  display?: string;
  breakdown?: string;
  interval?: string;
}) {
  return {
    kind: "InsightVizNode",
    source: {
      kind: "TrendsQuery",
      version: 4,
      series: options.series,
      interval: options.interval ?? "day",
      dateRange: DATE_RANGE,
      properties: [],
      trendsFilter: {
        display: options.display ?? "ActionsLineGraph",
        showLegend: true,
        showValuesOnSeries: true,
        aggregationAxisFormat: "numeric",
      },
      breakdownFilter: options.breakdown
        ? { breakdown: options.breakdown, breakdown_type: "event" }
        : { breakdown_type: "event" },
      filterTestAccounts: false,
    },
  };
}

function funnel(steps: ReturnType<typeof series>[]) {
  return {
    kind: "InsightVizNode",
    source: {
      kind: "FunnelsQuery",
      version: 2,
      series: steps,
      interval: "day",
      dateRange: DATE_RANGE,
      properties: [],
      funnelsFilter: {
        layout: "horizontal",
        exclusions: [],
        funnelVizType: "steps",
        funnelOrderType: "ordered",
        funnelStepReference: "total",
        // A visit that converts does so in one sitting on a marketing site;
        // a 14-day window would credit a conversion to a visit two weeks old.
        funnelWindowInterval: 1,
        funnelWindowIntervalUnit: "day",
        breakdownAttributionType: "first_touch",
      },
      breakdownFilter: { breakdown_type: "event" },
      filterTestAccounts: false,
    },
  };
}

const TILES = [
  {
    name: "1. Visitors and pageviews",
    description: "Are people arriving at all, and is it growing?",
    query: trends({
      series: [
        series("$pageview", "Unique visitors", "dau"),
        series("$pageview", "Pageviews"),
      ],
    }),
  },
  {
    name: "2. Enquiry funnel",
    description:
      "Where visits stop turning into enquiries. Each step is a named event, so a drop points at one specific place on the site.",
    query: funnel([
      series("$pageview", "Landed"),
      series("cta.clicked", "Pressed a call to action"),
      series("lead.form_started", "Started the form"),
      series("lead.form_submitted", "Sent an enquiry"),
    ]),
  },
  {
    name: "3. Read, or bounced",
    description:
      "page.engaged fires after 30 seconds with the tab actually in front of the visitor. Compare it to pageviews: the gap is people who opened and left.",
    query: trends({
      series: [
        series("$pageview", "Pageviews"),
        series("page.engaged", "Stayed 30s+"),
      ],
    }),
  },
  {
    name: "4. Where attention stops",
    description:
      "Scroll milestones. A cliff between 25% and 50% means the page loses people above the fold.",
    query: trends({
      series: [series("content.scroll_depth", "Reached depth")],
      display: "ActionsBarValue",
      breakdown: "depth",
    }),
  },
  {
    name: "5. Why the form loses people",
    description:
      "Rejections by reason, next to abandonment. rate_limit, validation, captcha or delivery each mean something different to fix.",
    query: trends({
      series: [series("lead.form_failed", "Rejected")],
      display: "ActionsBarValue",
      breakdown: "reason",
    }),
  },
  {
    name: "6. Started but never sent",
    description:
      "Someone engaged with the contact form and left without submitting — the clearest signal of a lost enquiry.",
    query: trends({
      series: [
        series("lead.form_started", "Started"),
        series("lead.form_abandoned", "Abandoned"),
        series("lead.form_submitted", "Sent"),
      ],
    }),
  },
  {
    name: "7. Questions still unanswered",
    description:
      "Which FAQ entries get opened. What people check before enquiring is what the page has not said clearly enough.",
    query: trends({
      series: [series("faq.item_opened", "Opened")],
      display: "ActionsBarValue",
      breakdown: "question",
    }),
  },
  {
    name: "8. Where they go instead",
    description:
      "Clicks that leave the site, by destination. Telegram reports itself separately as contact.telegram_clicked.",
    query: trends({
      series: [series("nav.outbound_clicked", "Left to")],
      display: "ActionsBarValue",
      breakdown: "host",
    }),
  },
  {
    name: "9. Contact clicks",
    description:
      "Telegram links and calls to action by placement — which button on which part of the site actually gets pressed.",
    query: trends({
      series: [
        series("cta.clicked", "Call to action"),
        series("contact.telegram_clicked", "Telegram"),
      ],
      display: "ActionsBarValue",
      breakdown: "placement",
    }),
  },
];

type Dashboard = { id: number; name: string };
type Insight = { id: number; short_id: string };

async function main() {
  const existing = await api<{ results: Dashboard[] }>("dashboards/?limit=100");
  const found = existing.results.find((d) => d.name === DASHBOARD_NAME);

  const dashboard =
    found ??
    (await api<Dashboard>("dashboards/", {
      method: "POST",
      body: {
        name: DASHBOARD_NAME,
        description:
          "Which calls to action get pressed, and how long visitors stay before leaving and why. Built by scripts/build-posthog-dashboard.ts; see docs/playbooks/analytics.md.",
        pinned: true,
      },
    }));

  console.log(
    found
      ? `Reusing dashboard ${dashboard.id}`
      : `Created dashboard ${dashboard.id}`,
  );

  for (const tile of TILES) {
    const insight = await api<Insight>("insights/", {
      method: "POST",
      body: {
        name: tile.name,
        description: tile.description,
        query: tile.query,
        dashboards: [dashboard.id],
        saved: true,
      },
    });
    console.log(`  + ${tile.name}  (insight ${insight.short_id})`);
  }

  console.log(
    `\nDone: ${HOST}/project/${PROJECT_ID}/dashboard/${dashboard.id}`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
