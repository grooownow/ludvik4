import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CtaLink } from "./cta-link";

vi.mock("next/navigation", () => ({
  usePathname: () => "/services/websites",
}));

const track = vi.hoisted(() => vi.fn());

vi.mock("@/lib/analytics", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/analytics")>()),
  track,
}));

beforeEach(() => {
  track.mockClear();
});

describe("CtaLink", () => {
  it("reports the placement it was rendered with", async () => {
    render(
      <CtaLink href="/#contact" placement="service">
        Send a project enquiry
      </CtaLink>,
    );

    await userEvent.click(
      screen.getByRole("link", { name: "Send a project enquiry" }),
    );

    expect(track).toHaveBeenCalledWith("cta.clicked", {
      placement: "service",
      target: "contact",
      path: "/services/websites",
    });
  });

  it("distinguishes the two navigation placements", async () => {
    const { unmount } = render(
      <CtaLink href="#contact" placement="nav">
        Get in touch
      </CtaLink>,
    );
    await userEvent.click(screen.getByRole("link", { name: "Get in touch" }));
    unmount();

    render(
      <CtaLink href="#contact" placement="nav_mobile">
        Get in touch
      </CtaLink>,
    );
    await userEvent.click(screen.getByRole("link", { name: "Get in touch" }));

    expect(
      track.mock.calls.map(([, properties]) => properties.placement),
    ).toEqual(["nav", "nav_mobile"]);
  });

  it("stays silent when a caller cancels the click", async () => {
    render(
      <CtaLink
        href="#contact"
        placement="hero"
        onClick={(event) => event.preventDefault()}
      >
        Start a project
      </CtaLink>,
    );

    await userEvent.click(
      screen.getByRole("link", { name: "Start a project" }),
    );

    expect(track).not.toHaveBeenCalled();
  });

  it("still renders a real link, so a CTA works with analytics off", () => {
    render(
      <CtaLink href="/#contact" placement="hero">
        Start a project
      </CtaLink>,
    );

    expect(
      screen.getByRole("link", { name: "Start a project" }),
    ).toHaveAttribute("href", "/#contact");
  });
});
