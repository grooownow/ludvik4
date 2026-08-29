import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const track = vi.hoisted(() => vi.fn());
const init = vi.hoisted(() => vi.fn());
const optIn = vi.hoisted(() => vi.fn());
const optOut = vi.hoisted(() => vi.fn());
const clearOptInOut = vi.hoisted(() => vi.fn());
const startRecording = vi.hoisted(() => vi.fn());
const stopRecording = vi.hoisted(() => vi.fn());
const consentStatus = vi.hoisted(() => ({ value: "pending" as string }));

vi.mock("@/lib/analytics", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/analytics")>()),
  track,
}));

vi.mock("posthog-js", () => ({
  default: {
    init,
    opt_in_capturing: optIn,
    opt_out_capturing: optOut,
    clear_opt_in_out_capturing: clearOptInOut,
    startSessionRecording: startRecording,
    stopSessionRecording: stopRecording,
    get_explicit_consent_status: () => consentStatus.value,
  },
}));

/**
 * The provider reads `SITE_MARKET` and `NEXT_PUBLIC_POSTHOG_KEY` at module
 * scope, because that is the form Next.js inlines. Varying them therefore
 * means re-importing the module, not just restubbing the environment.
 */
async function renderProvider(
  children: React.ReactNode,
  { market = "en", key = "phc_test_key" } = {},
) {
  vi.stubEnv("SITE_MARKET", market);
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", key);
  vi.resetModules();

  const { AnalyticsProvider } = await import("./analytics-provider");
  return render(<AnalyticsProvider>{children}</AnalyticsProvider>);
}

/**
 * Renders the provider together with the withdrawal control.
 *
 * Both are imported from the *same* module graph on purpose. `vi.resetModules()`
 * gives each call a fresh `analytics-provider` module, and with it a fresh
 * React context object — a statically imported `ConsentSettingsButton` would
 * hold the previous one, read the default value, and silently render nothing.
 */
async function renderWithSettings(options?: { market?: string; key?: string }) {
  const { market = "en", key = "phc_test_key" } = options ?? {};
  vi.stubEnv("SITE_MARKET", market);
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", key);
  vi.resetModules();

  const { AnalyticsProvider } = await import("./analytics-provider");
  const { ConsentSettingsButton } = await import("./consent-settings-button");

  return render(
    <AnalyticsProvider>
      <ConsentSettingsButton />
    </AnalyticsProvider>,
  );
}

function setPageGeometry({
  scrollY,
  innerHeight,
  scrollHeight,
}: {
  scrollY: number;
  innerHeight: number;
  scrollHeight: number;
}) {
  Object.defineProperty(window, "scrollY", { value: scrollY, writable: true });
  Object.defineProperty(window, "innerHeight", {
    value: innerHeight,
    writable: true,
  });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: scrollHeight,
    writable: true,
  });
}

beforeEach(() => {
  track.mockClear();
  init.mockClear();
  optIn.mockClear();
  optOut.mockClear();
  clearOptInOut.mockClear();
  startRecording.mockClear();
  stopRecording.mockClear();
  consentStatus.value = "pending";
  setPageGeometry({ scrollY: 0, innerHeight: 500, scrollHeight: 4000 });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe("AnalyticsProvider initialization", () => {
  it("captures client-side route changes", async () => {
    await renderProvider(<p>content</p>);

    // The whole behavioural layer rests on this option. Without it
    // posthog-js@1.398.2 resolves capture_pageview to the legacy `true`,
    // which fires on the initial document load only - so <Link> navigations
    // go unrecorded and $pageleave, dwell time and scroll depth never exist.
    await waitFor(() =>
      expect(init).toHaveBeenCalledWith(
        "phc_test_key",
        expect.objectContaining({ defaults: "2025-05-24" }),
      ),
    );
  });

  it("keeps the privacy posture the notice promises", async () => {
    await renderProvider(<p>content</p>);

    // Person profiles stay off even after consent: cookies buy a stable
    // visitor id, which is what fixes the daily-salt inflation, but the notice
    // promises no persistent person profiles and consent does not change that.
    await waitFor(() =>
      expect(init).toHaveBeenCalledWith(
        "phc_test_key",
        expect.objectContaining({ person_profiles: "never" }),
      ),
    );
  });

  it("initializes nothing without a key", async () => {
    await renderProvider(<p>content</p>, { key: "" });

    expect(await screen.findByText("content")).toBeInTheDocument();
    expect(init).not.toHaveBeenCalled();
  });

  it("initializes nothing on the Russian market", async () => {
    await renderProvider(<p>content</p>, { market: "ru" });

    expect(await screen.findByText("content")).toBeInTheDocument();
    expect(init).not.toHaveBeenCalled();
  });
});

describe("AnalyticsProvider consent", () => {
  it("keeps an undecided visitor on the cookieless path", async () => {
    await renderProvider(<p>content</p>);

    // These two options are a pair. `on_reject` alone would leave a visitor who
    // ignores the banner uncaptured; defaulting them to opt-out is what routes
    // them into cookieless mode instead.
    await waitFor(() =>
      expect(init).toHaveBeenCalledWith(
        "phc_test_key",
        expect.objectContaining({
          cookieless_mode: "on_reject",
          opt_out_capturing_by_default: true,
        }),
      ),
    );
  });

  it("never starts replay on a key alone, and masks form input when it does", async () => {
    await renderProvider(<p>content</p>);

    await waitFor(() =>
      expect(init).toHaveBeenCalledWith(
        "phc_test_key",
        expect.objectContaining({
          disable_session_recording: true,
          session_recording: expect.objectContaining({
            maskAllInputs: true,
            maskInputOptions: expect.objectContaining({
              text: true,
              textarea: true,
              email: true,
            }),
          }),
        }),
      ),
    );
    expect(startRecording).not.toHaveBeenCalled();
  });

  it("shows the banner only while the choice is pending", async () => {
    await renderProvider(<p>content</p>);

    expect(
      await screen.findByRole("region", { name: "Cookie choice" }),
    ).toBeInTheDocument();
  });

  it("does not show the banner to a visitor who already decided", async () => {
    consentStatus.value = "denied";
    await renderProvider(<p>content</p>);

    expect(await screen.findByText("content")).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Cookie choice" }),
    ).not.toBeInTheDocument();
  });

  it("restores replay for a visitor who granted consent earlier", async () => {
    consentStatus.value = "granted";
    await renderProvider(<p>content</p>);

    await waitFor(() => expect(startRecording).toHaveBeenCalled());
    expect(
      screen.queryByRole("region", { name: "Cookie choice" }),
    ).not.toBeInTheDocument();
  });

  it("shows no banner without a key", async () => {
    await renderProvider(<p>content</p>, { key: "" });

    expect(await screen.findByText("content")).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Cookie choice" }),
    ).not.toBeInTheDocument();
  });

  it("shows no banner on the Russian market", async () => {
    await renderProvider(<p>content</p>, { market: "ru" });

    expect(await screen.findByText("content")).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Cookie choice" }),
    ).not.toBeInTheDocument();
  });

  it("grants consent and starts replay on accept", async () => {
    await renderProvider(<p>content</p>);

    await userEvent.click(
      await screen.findByRole("button", { name: "Allow cookies" }),
    );

    await waitFor(() => expect(optIn).toHaveBeenCalled());
    expect(startRecording).toHaveBeenCalled();
    await waitFor(() =>
      expect(
        screen.queryByRole("region", { name: "Cookie choice" }),
      ).not.toBeInTheDocument(),
    );
  });

  it("declines without starting replay, and keeps analytics running", async () => {
    await renderProvider(<p>content</p>);

    await userEvent.click(
      await screen.findByRole("button", { name: "Decline" }),
    );

    await waitFor(() => expect(optOut).toHaveBeenCalled());
    expect(startRecording).not.toHaveBeenCalled();
    expect(optIn).not.toHaveBeenCalled();
  });
});

describe("consent withdrawal", () => {
  it("offers no control to a visitor who has not decided", async () => {
    await renderWithSettings();

    await screen.findByRole("region", { name: "Cookie choice" });
    expect(
      screen.queryByRole("button", { name: "Cookie settings" }),
    ).not.toBeInTheDocument();
  });

  it("offers no control where analytics does not run", async () => {
    consentStatus.value = "granted";
    await renderWithSettings({ market: "ru" });

    // A control that cannot do anything is worse than no control.
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Cookie settings" }),
      ).not.toBeInTheDocument(),
    );
  });

  it("stops replay before forgetting the choice, and asks again", async () => {
    consentStatus.value = "granted";
    await renderWithSettings();

    await userEvent.click(
      await screen.findByRole("button", { name: "Cookie settings" }),
    );

    // Order matters: clearing consent while a recorder is still running would
    // keep recording someone who just withdrew.
    await waitFor(() => expect(clearOptInOut).toHaveBeenCalled());
    expect(stopRecording).toHaveBeenCalled();
    expect(stopRecording.mock.invocationCallOrder[0]).toBeLessThan(
      clearOptInOut.mock.invocationCallOrder[0]!,
    );

    consentStatus.value = "pending";
  });
});

describe("AnalyticsProvider outbound clicks", () => {
  it("reports a click that leaves the site", async () => {
    await renderProvider(<a href="https://github.com/grooownow">Source</a>);

    await userEvent.click(screen.getByRole("link", { name: "Source" }));

    expect(track).toHaveBeenCalledWith("nav.outbound_clicked", {
      host: "github.com",
    });
  });

  it("leaves Telegram to its own event rather than counting it twice", async () => {
    await renderProvider(<a href="https://t.me/ludvik4work">Telegram</a>);

    await userEvent.click(screen.getByRole("link", { name: "Telegram" }));

    expect(track).not.toHaveBeenCalledWith(
      "nav.outbound_clicked",
      expect.anything(),
    );
  });

  it("ignores an internal link", async () => {
    await renderProvider(<p>content</p>);

    // Built imperatively rather than as JSX: an internal `<a href>` in this
    // codebase is a lint error and a hook denial (invariant 1, always
    // `<Link>`). The listener is delegated on `document` and sees whatever
    // anchor the router rendered, so a DOM node is the faithful fixture.
    const internal = document.createElement("a");
    internal.href = "/about";
    internal.textContent = "About";
    document.body.append(internal);

    await userEvent.click(screen.getByRole("link", { name: "About" }));

    expect(track).not.toHaveBeenCalledWith(
      "nav.outbound_clicked",
      expect.anything(),
    );

    internal.remove();
  });

  it("reports a click on an element nested inside the link", async () => {
    await renderProvider(
      <a href="https://ludvik4.ru/gridfin/">
        <span>Gridfin</span>
      </a>,
    );

    await userEvent.click(screen.getByText("Gridfin"));

    expect(track).toHaveBeenCalledWith("nav.outbound_clicked", {
      host: "ludvik4.ru",
    });
  });
});

describe("AnalyticsProvider scroll depth", () => {
  it("reports a milestone as the visitor reaches it", async () => {
    await renderProvider(<p>content</p>);
    track.mockClear();

    // 4000px document, 500px viewport: 500px down is 25% seen.
    setPageGeometry({ scrollY: 500, innerHeight: 500, scrollHeight: 4000 });
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() =>
      expect(track).toHaveBeenCalledWith("content.scroll_depth", {
        path: "/",
        depth: 25,
      }),
    );
  });

  it("reports each milestone only once", async () => {
    await renderProvider(<p>content</p>);
    track.mockClear();

    setPageGeometry({ scrollY: 500, innerHeight: 500, scrollHeight: 4000 });
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));

    await waitFor(() =>
      expect(
        track.mock.calls.filter(([event]) => event === "content.scroll_depth"),
      ).toHaveLength(1),
    );
  });

  it("reports nothing on a page that does not scroll", async () => {
    setPageGeometry({ scrollY: 0, innerHeight: 800, scrollHeight: 800 });
    await renderProvider(<p>content</p>);

    window.dispatchEvent(new Event("scroll"));

    expect(track).not.toHaveBeenCalledWith(
      "content.scroll_depth",
      expect.anything(),
    );
  });
});

describe("AnalyticsProvider engagement", () => {
  it("reports a visitor who stayed, once", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await renderProvider(<p>content</p>);
    track.mockClear();

    await vi.advanceTimersByTimeAsync(31_000);

    expect(
      track.mock.calls.filter(([event]) => event === "page.engaged"),
    ).toEqual([["page.engaged", { path: "/" }]]);

    await vi.advanceTimersByTimeAsync(31_000);

    expect(
      track.mock.calls.filter(([event]) => event === "page.engaged"),
    ).toHaveLength(1);
  });

  it("does not count time spent in a background tab", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await renderProvider(<p>content</p>);
    track.mockClear();

    const visibility = vi.spyOn(document, "visibilityState", "get");

    visibility.mockReturnValue("hidden");
    document.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(600_000);

    expect(track).not.toHaveBeenCalledWith("page.engaged", expect.anything());

    visibility.mockReturnValue("visible");
    document.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(31_000);

    expect(track).toHaveBeenCalledWith("page.engaged", { path: "/" });
    visibility.mockRestore();
  });

  it("does not report a visitor who left before the threshold", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await renderProvider(<p>content</p>);
    track.mockClear();

    await vi.advanceTimersByTimeAsync(20_000);

    expect(track).not.toHaveBeenCalledWith("page.engaged", expect.anything());
  });
});
