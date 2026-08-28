import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const track = vi.hoisted(() => vi.fn());
const init = vi.hoisted(() => vi.fn());

vi.mock("@/lib/analytics", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/analytics")>()),
  track,
}));

vi.mock("posthog-js", () => ({ default: { init } }));

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

  it("keeps the cookieless privacy posture the notice promises", async () => {
    await renderProvider(<p>content</p>);

    await waitFor(() =>
      expect(init).toHaveBeenCalledWith(
        "phc_test_key",
        expect.objectContaining({
          cookieless_mode: "always",
          person_profiles: "never",
        }),
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

  it("does not report a visitor who left before the threshold", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await renderProvider(<p>content</p>);
    track.mockClear();

    await vi.advanceTimersByTimeAsync(20_000);

    expect(track).not.toHaveBeenCalledWith("page.engaged", expect.anything());
  });
});
