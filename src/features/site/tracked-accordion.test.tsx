import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TrackedFaqAccordion } from "./tracked-accordion";

const track = vi.hoisted(() => vi.fn());

vi.mock("@/lib/analytics", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/analytics")>()),
  track,
}));

const items = [
  {
    question: "How does a project start?",
    answer: "Send a short description.",
  },
  { question: "What does founder-led mean?", answer: "I do the work." },
] as const;

beforeEach(() => {
  track.mockClear();
});

describe("TrackedFaqAccordion", () => {
  it("reports the question that was opened", async () => {
    render(<TrackedFaqAccordion items={items} />);

    await userEvent.click(
      screen.getByRole("button", { name: "How does a project start?" }),
    );

    expect(track).toHaveBeenCalledWith("faq.item_opened", {
      question: "How does a project start?",
    });
  });

  it("does not report a close as a second open", async () => {
    render(<TrackedFaqAccordion items={items} />);

    const trigger = screen.getByRole("button", {
      name: "How does a project start?",
    });
    await userEvent.click(trigger);
    await userEvent.click(trigger);

    expect(track).toHaveBeenCalledTimes(1);
  });

  it("still renders every question and reveals its answer", async () => {
    render(<TrackedFaqAccordion items={items} />);

    for (const item of items) {
      expect(
        screen.getByRole("button", { name: item.question }),
      ).toBeInTheDocument();
    }

    await userEvent.click(
      screen.getByRole("button", { name: "What does founder-led mean?" }),
    );

    expect(await screen.findByText("I do the work.")).toBeVisible();
  });
});
