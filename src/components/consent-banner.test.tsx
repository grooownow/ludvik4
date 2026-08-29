import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConsentBanner } from "./consent-banner";

describe("ConsentBanner", () => {
  it("offers both choices as equally reachable buttons", async () => {
    const onAccept = vi.fn();
    const onDecline = vi.fn();

    render(<ConsentBanner onAccept={onAccept} onDecline={onDecline} />);

    // Consent that is harder to refuse than to give is not freely given, so
    // Decline must be a real button of the same size, not a demoted link.
    const decline = screen.getByRole("button", { name: "Decline" });
    const accept = screen.getByRole("button", { name: "Allow cookies" });
    expect(decline).toHaveAttribute("data-size", "lg");
    expect(accept).toHaveAttribute("data-size", "lg");

    await userEvent.click(accept);
    expect(onAccept).toHaveBeenCalledTimes(1);

    await userEvent.click(decline);
    expect(onDecline).toHaveBeenCalledTimes(1);
  });

  it("is a labelled region that takes focus", () => {
    render(<ConsentBanner onAccept={vi.fn()} onDecline={vi.fn()} />);

    const region = screen.getByRole("region", { name: "Cookie choice" });
    expect(region).toHaveFocus();
  });

  it("declines on Escape", async () => {
    const onDecline = vi.fn();
    render(<ConsentBanner onAccept={vi.fn()} onDecline={onDecline} />);

    await userEvent.keyboard("{Escape}");

    expect(onDecline).toHaveBeenCalledTimes(1);
  });

  it("links to the privacy notice", () => {
    render(<ConsentBanner onAccept={vi.fn()} onDecline={vi.fn()} />);

    expect(
      screen.getByRole("link", { name: "Privacy Notice" }),
    ).toHaveAttribute("href", "/privacy");
  });
});
