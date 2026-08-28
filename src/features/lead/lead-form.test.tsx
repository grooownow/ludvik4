import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LeadForm, RU_LEAD_LABELS } from "./lead-form";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const track = vi.hoisted(() => vi.fn());
const submitLeadAction = vi.hoisted(() => vi.fn());

vi.mock("@/lib/analytics", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/analytics")>()),
  track,
}));

vi.mock("./submit-lead-action", () => ({ submitLeadAction }));

/** Fills the two required fields so the browser's own validation is not what
 * blocks the submit under test. */
async function fillRequired(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByLabelText(RU_LEAD_LABELS.messageLabel),
    "Need a landing page",
  );
  await user.type(
    screen.getByLabelText(RU_LEAD_LABELS.contactLabel),
    "founder@example.com",
  );
}

beforeEach(() => {
  track.mockClear();
  submitLeadAction.mockReset();
});

describe("LeadForm analytics", () => {
  it("reports the start once, on first contact with any field", async () => {
    const user = userEvent.setup();
    render(<LeadForm />);

    await user.click(screen.getByLabelText(RU_LEAD_LABELS.contactLabel));
    await user.click(screen.getByLabelText(RU_LEAD_LABELS.messageLabel));

    const starts = track.mock.calls.filter(
      ([event]) => event === "lead.form_started",
    );
    expect(starts).toEqual([["lead.form_started", { path: "/" }]]);
  });

  it("reports a successful enquiry", async () => {
    const user = userEvent.setup();
    submitLeadAction.mockResolvedValue({ ok: true });

    render(<LeadForm />);
    await fillRequired(user);
    await user.click(
      screen.getByRole("button", { name: RU_LEAD_LABELS.submit }),
    );

    await waitFor(() =>
      expect(track).toHaveBeenCalledWith("lead.form_submitted", { path: "/" }),
    );
  });

  it("reports why a rejected enquiry failed, not the message shown", async () => {
    const user = userEvent.setup();
    submitLeadAction.mockResolvedValue({
      error: "Не прошла проверка «я не робот».",
      reason: "captcha",
      values: { name: "", message: "", contact: "" },
    });

    render(<LeadForm />);
    await fillRequired(user);
    await user.click(
      screen.getByRole("button", { name: RU_LEAD_LABELS.submit }),
    );

    await waitFor(() =>
      expect(track).toHaveBeenCalledWith("lead.form_failed", {
        path: "/",
        reason: "captcha",
      }),
    );
  });

  it("reports abandonment when a started form is left without success", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<LeadForm />);

    await user.type(
      screen.getByLabelText(RU_LEAD_LABELS.messageLabel),
      "Need a landing page",
    );
    unmount();

    expect(track).toHaveBeenCalledWith("lead.form_abandoned", {
      path: "/",
      fields_touched: 1,
    });
  });

  it("does not report abandonment after a successful enquiry", async () => {
    const user = userEvent.setup();
    submitLeadAction.mockResolvedValue({ ok: true });

    const { unmount } = render(<LeadForm />);
    await fillRequired(user);
    await user.click(
      screen.getByRole("button", { name: RU_LEAD_LABELS.submit }),
    );

    // The success message replaces the form inside the same component, so
    // unmount alone cannot tell a completed enquiry from an abandoned one.
    await screen.findByText(RU_LEAD_LABELS.success);
    unmount();

    expect(track).not.toHaveBeenCalledWith(
      "lead.form_abandoned",
      expect.anything(),
    );
  });

  it("never puts what the visitor typed into an event", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<LeadForm />);

    await fillRequired(user);
    unmount();

    const everyValue = track.mock.calls.flatMap(([, properties]) =>
      Object.values(properties ?? {}),
    );
    expect(everyValue).not.toContain("founder@example.com");
    expect(everyValue).not.toContain("Need a landing page");
    expect(track).toHaveBeenCalledWith("lead.form_abandoned", {
      path: "/",
      fields_touched: 2,
    });
  });

  // The honeypot deliberately answers a caught bot with a success, so it stops
  // retrying. That reply must not also become a completed enquiry in the data:
  // conversion is the one number this whole slice exists to produce.
  it("does not count a caught bot as a completed enquiry", async () => {
    const user = userEvent.setup();
    submitLeadAction.mockResolvedValue({ ok: true });

    render(<LeadForm />);
    await fillRequired(user);
    await user.type(
      document.getElementById("lead-website") as HTMLInputElement,
      "http://spam.example",
    );
    await user.click(
      screen.getByRole("button", { name: RU_LEAD_LABELS.submit }),
    );

    await screen.findByText(RU_LEAD_LABELS.success);
    expect(track).not.toHaveBeenCalledWith(
      "lead.form_submitted",
      expect.anything(),
    );
  });

  // Guards the interception itself: the form dispatches through a wrapper so it
  // can read the honeypot before the action runs, and useFormStatus has to keep
  // driving the button's pending state through it.
  it("still shows the pending label while the action runs", async () => {
    const user = userEvent.setup();
    let release!: () => void;
    submitLeadAction.mockReturnValue(
      new Promise((resolve) => {
        release = () => resolve({ ok: true });
      }),
    );

    render(<LeadForm />);
    await fillRequired(user);
    await user.click(
      screen.getByRole("button", { name: RU_LEAD_LABELS.submit }),
    );

    expect(
      await screen.findByRole("button", { name: RU_LEAD_LABELS.submitting }),
    ).toBeDisabled();

    release();
    await screen.findByText(RU_LEAD_LABELS.success);
  });

  it("reports the submit press separately from the outcome", async () => {
    const user = userEvent.setup();
    submitLeadAction.mockResolvedValue({ ok: true });

    render(<LeadForm />);
    await fillRequired(user);
    await user.click(
      screen.getByRole("button", { name: RU_LEAD_LABELS.submit }),
    );

    // Attempts minus outcomes is what browser-blocked submits look like.
    expect(track).toHaveBeenCalledWith("cta.clicked", {
      placement: "form_submit",
      target: "lead_form",
      path: "/",
    });
  });
});
