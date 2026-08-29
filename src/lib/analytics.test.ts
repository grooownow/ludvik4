import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ANALYTICS_EVENTS,
  clearConsent,
  createEngagedTimer,
  createScrollTracker,
  readConsent,
  scrollMilestone,
  setConsent,
  shouldLoadPostHog,
  startReplay,
  stopReplay,
  shouldLoadVercelAnalytics,
  track,
} from "./analytics";

const capture = vi.fn();
const optIn = vi.fn();
const optOut = vi.fn();
const clearOptInOut = vi.fn();
const startRecording = vi.fn();
const stopRecording = vi.fn();

vi.mock("posthog-js", () => ({
  default: {
    capture: (...args: unknown[]) => capture(...args),
    opt_in_capturing: () => optIn(),
    opt_out_capturing: () => optOut(),
    clear_opt_in_out_capturing: () => clearOptInOut(),
    startSessionRecording: () => startRecording(),
    stopSessionRecording: () => stopRecording(),
    get_explicit_consent_status: () => "pending",
  },
}));

afterEach(() => {
  vi.unstubAllEnvs();
  capture.mockClear();
  optIn.mockClear();
  optOut.mockClear();
  clearOptInOut.mockClear();
  startRecording.mockClear();
  stopRecording.mockClear();
});

describe("shouldLoadPostHog", () => {
  it("loads analytics only on the international site when configured", () => {
    expect(shouldLoadPostHog("en", "phc_live_key")).toBe(true);
    expect(shouldLoadPostHog("ru", "phc_live_key")).toBe(false);
    expect(shouldLoadPostHog("en", undefined)).toBe(false);
  });
});

describe("shouldLoadVercelAnalytics", () => {
  it("ships the script only on the Vercel-hosted international build", () => {
    expect(shouldLoadVercelAnalytics("en")).toBe(true);
    // The RU export is served from Timeweb, where /_vercel/insights/* 404s.
    expect(shouldLoadVercelAnalytics("ru")).toBe(false);
    expect(shouldLoadVercelAnalytics(undefined)).toBe(false);
  });
});

describe("ANALYTICS_EVENTS", () => {
  // A shipped event name is never renamed - old data does not follow it.
  // This asserts the catalog verbatim so a rename has to be deliberate.
  it("matches the names in the spec", () => {
    expect(ANALYTICS_EVENTS).toEqual({
      ctaClicked: "cta.clicked",
      telegramClicked: "contact.telegram_clicked",
      leadFormStarted: "lead.form_started",
      leadFormSubmitted: "lead.form_submitted",
      leadFormFailed: "lead.form_failed",
      leadFormAbandoned: "lead.form_abandoned",
      pageEngaged: "page.engaged",
      scrollDepth: "content.scroll_depth",
      outboundClicked: "nav.outbound_clicked",
      faqItemOpened: "faq.item_opened",
    });
  });

  it("keeps the already-shipped Telegram event name unchanged", () => {
    expect(ANALYTICS_EVENTS.telegramClicked).toBe("contact.telegram_clicked");
  });
});

/**
 * `track` dispatches through a dynamic `import("posthog-js")`, so a capture it
 * *would* make lands a microtask later than the call itself. Awaiting the same
 * module here queues this continuation behind `track`'s own `.then`, which
 * makes "it never captured" a real assertion rather than one that passes
 * because nothing has had a chance to happen yet.
 */
async function afterDispatch() {
  await import("posthog-js");
}

describe("track", () => {
  it("is a no-op with no PostHog key", async () => {
    vi.stubEnv("SITE_MARKET", "en");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");

    track(ANALYTICS_EVENTS.ctaClicked, { placement: "hero" });

    await afterDispatch();
    expect(capture).not.toHaveBeenCalled();
  });

  it("is a no-op on the Russian market even with a key set", async () => {
    vi.stubEnv("SITE_MARKET", "ru");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_live_key");

    track(ANALYTICS_EVENTS.ctaClicked, { placement: "hero" });

    await afterDispatch();
    expect(capture).not.toHaveBeenCalled();
  });

  it("captures the event and its properties when enabled", async () => {
    vi.stubEnv("SITE_MARKET", "en");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_live_key");

    track(ANALYTICS_EVENTS.ctaClicked, {
      placement: "hero",
      target: "contact",
    });

    await vi.waitFor(() =>
      expect(capture).toHaveBeenCalledWith("cta.clicked", {
        placement: "hero",
        target: "contact",
      }),
    );
  });
});

describe("consent wrappers", () => {
  it("report no status where analytics does not run", async () => {
    vi.stubEnv("SITE_MARKET", "ru");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_live_key");
    expect(await readConsent()).toBeNull();

    vi.stubEnv("SITE_MARKET", "en");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    expect(await readConsent()).toBeNull();
  });

  it("reads the explicit choice when analytics runs", async () => {
    vi.stubEnv("SITE_MARKET", "en");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_live_key");

    expect(await readConsent()).toBe("pending");
  });

  it("maps a granted choice to opting in, and a refusal to opting out", async () => {
    vi.stubEnv("SITE_MARKET", "en");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_live_key");

    await setConsent(true);
    expect(optIn).toHaveBeenCalledTimes(1);
    expect(optOut).not.toHaveBeenCalled();

    await setConsent(false);
    expect(optOut).toHaveBeenCalledTimes(1);
  });

  it("records nothing where analytics does not run", async () => {
    vi.stubEnv("SITE_MARKET", "ru");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_live_key");

    await setConsent(true);
    await clearConsent();

    expect(optIn).not.toHaveBeenCalled();
    expect(clearOptInOut).not.toHaveBeenCalled();
  });

  it("never touches session replay where analytics does not run", async () => {
    vi.stubEnv("SITE_MARKET", "ru");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_live_key");

    await startReplay();
    await stopReplay();

    expect(startRecording).not.toHaveBeenCalled();
    expect(stopRecording).not.toHaveBeenCalled();
  });

  it("starts and stops session replay when analytics runs", async () => {
    vi.stubEnv("SITE_MARKET", "en");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_live_key");

    await startReplay();
    expect(startRecording).toHaveBeenCalledTimes(1);

    await stopReplay();
    expect(stopRecording).toHaveBeenCalledTimes(1);
  });

  it("clears the choice so the banner can ask again", async () => {
    vi.stubEnv("SITE_MARKET", "en");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_live_key");

    await clearConsent();

    expect(clearOptInOut).toHaveBeenCalledTimes(1);
  });
});

describe("scrollMilestone", () => {
  it("reports the deepest milestone the visitor has seen", () => {
    // 2000px document, 500px viewport: seen = (scrollTop + 500) / 2000.
    expect(scrollMilestone(0, 500, 2000)).toBe(25);
    expect(scrollMilestone(500, 500, 2000)).toBe(50);
    expect(scrollMilestone(1000, 500, 2000)).toBe(75);
    expect(scrollMilestone(1500, 500, 2000)).toBe(100);
  });

  it("returns null below the first milestone", () => {
    // 4000px document, 500px viewport: 12.5% seen at the top.
    expect(scrollMilestone(0, 500, 4000)).toBeNull();
  });

  it("returns null on a page that does not scroll", () => {
    // The short-page trap: content fits the viewport, so it is 100% "seen"
    // on paint. Reporting that would make every short page look fully read.
    expect(scrollMilestone(0, 800, 800)).toBeNull();
    expect(scrollMilestone(0, 800, 600)).toBeNull();
  });
});

describe("createScrollTracker", () => {
  it("reports each milestone at most once", () => {
    const tracker = createScrollTracker();

    expect(tracker.crossed(0, 500, 2000)).toEqual([25]);
    expect(tracker.crossed(0, 500, 2000)).toEqual([]);
    expect(tracker.crossed(500, 500, 2000)).toEqual([50]);
    expect(tracker.crossed(500, 500, 2000)).toEqual([]);
  });

  it("reports nothing when the visitor scrolls back up", () => {
    const tracker = createScrollTracker();

    expect(tracker.crossed(1500, 500, 2000)).toEqual([25, 50, 75, 100]);
    expect(tracker.crossed(0, 500, 2000)).toEqual([]);
  });

  it("reports every milestone crossed by a jump to the footer", () => {
    // A funnel on 25 -> 50 -> 75 -> 100 would otherwise show an arrival at
    // 100 with no steps leading to it.
    const tracker = createScrollTracker();

    expect(tracker.crossed(1500, 500, 2000)).toEqual([25, 50, 75, 100]);
  });

  it("reports nothing on a page that does not scroll", () => {
    const tracker = createScrollTracker();

    expect(tracker.crossed(0, 800, 800)).toEqual([]);
  });
});

describe("createEngagedTimer", () => {
  it("reports once the threshold is met, and only once", () => {
    const timer = createEngagedTimer(30_000);
    timer.resume(0);

    expect(timer.hasEngaged(29_999)).toBe(false);
    expect(timer.hasEngaged(30_000)).toBe(true);
    expect(timer.hasEngaged(60_000)).toBe(false);
  });

  it("does not accumulate time while the tab is hidden", () => {
    const timer = createEngagedTimer(30_000);

    timer.resume(0);
    timer.pause(10_000);
    // An hour in a background window contributes nothing.
    timer.resume(3_610_000);

    expect(timer.hasEngaged(3_629_999)).toBe(false);
    expect(timer.hasEngaged(3_630_000)).toBe(true);
  });

  it("ignores a resume while already visible", () => {
    const timer = createEngagedTimer(30_000);

    timer.resume(0);
    timer.resume(20_000);

    expect(timer.hasEngaged(30_000)).toBe(true);
  });

  it("ignores a pause while already hidden", () => {
    const timer = createEngagedTimer(30_000);

    timer.resume(0);
    timer.pause(10_000);
    timer.pause(20_000);
    timer.resume(20_000);

    expect(timer.hasEngaged(40_000)).toBe(true);
  });
});
