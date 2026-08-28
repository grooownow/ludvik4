"use client";

import { usePathname } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitLeadAction, type LeadFormState } from "./submit-lead-action";
import { TurnstileWidget } from "./turnstile-widget";

const initialState: LeadFormState = {};

/**
 * Visible copy for the form. Defaults to Russian (`RU_LEAD_LABELS`); the English
 * market build (SITE_MARKET=en) passes its own set. Server-side validation errors
 * stay in the language the action returns them in — out of scope here.
 */
export type LeadFormLabels = {
  nameLabel: string;
  nameOptional: string;
  messageLabel: string;
  messagePlaceholder: string;
  contactLabel: string;
  contactPlaceholder: string;
  submit: string;
  submitting: string;
  success: string;
};

export const RU_LEAD_LABELS: LeadFormLabels = {
  nameLabel: "Имя",
  nameOptional: "необязательно",
  messageLabel: "Задача",
  messagePlaceholder: "Опишите, что нужно сделать…",
  contactLabel: "Как с вами связаться",
  contactPlaceholder: "email или ссылка на мессенджер / телефон",
  submit: "Отправить заявку",
  submitting: "Отправляю…",
  success: "Заявка отправлена — ответим в ближайшее время. Спасибо!",
};

function SubmitButton({
  submit,
  submitting,
  onPress,
}: {
  submit: string;
  submitting: string;
  onPress: () => void;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      className="w-full"
      disabled={pending}
      onClick={onPress}
    >
      {pending ? submitting : submit}
    </Button>
  );
}

/**
 * Contact form. `useActionState` surfaces the server action's result: a success
 * message replaces the form, a failure renders the error (aria-live) and keeps
 * the typed values. The Turnstile widget mounts only when a site key is set.
 */
export function LeadForm({
  turnstileSiteKey,
  labels = RU_LEAD_LABELS,
}: {
  turnstileSiteKey?: string;
  labels?: LeadFormLabels;
}) {
  const [state, formAction] = useActionState(submitLeadAction, initialState);
  const pathname = usePathname();

  // Analytics bookkeeping in one ref-held object, not in state: none of it may
  // cause a render. One object rather than four refs so the unmount cleanup can
  // read it after capturing the object *in the effect body* — the identity is
  // stable for the component's lifetime, so its fields are current at cleanup
  // without the cleanup reaching through `.current` itself.
  const journey = useRef({
    started: false,
    succeeded: false,
    caughtByHoneypot: false,
    touchedFields: new Set<string>(),
    path: pathname,
  });
  journey.current.path = pathname;

  /**
   * Dispatches the action, reading the honeypot on the way past.
   *
   * The action answers a caught bot with a plain `{ ok: true }` so it stops
   * retrying — and that reply is indistinguishable from a real enquiry, which
   * would put every caught bot into `lead.form_submitted`, the one number this
   * instrumentation exists to produce. The check lives here rather than in the
   * action's result so the server's reply to a bot stays a bare success with
   * nothing in it to detect.
   */
  function dispatch(formData: FormData) {
    journey.current.caughtByHoneypot =
      String(formData.get("website") ?? "").trim() !== "";
    formAction(formData);
  }

  function handleFieldFocus(field: string) {
    journey.current.touchedFields.add(field);

    if (!journey.current.started) {
      journey.current.started = true;
      track(ANALYTICS_EVENTS.leadFormStarted, { path: pathname });
    }
  }

  useEffect(() => {
    if (state.ok) {
      // Marked succeeded either way: a caught bot is not an abandoned form.
      journey.current.succeeded = true;

      if (!journey.current.caughtByHoneypot) {
        track(ANALYTICS_EVENTS.leadFormSubmitted, {
          path: journey.current.path,
        });
      }
      return;
    }

    if (state.reason) {
      track(ANALYTICS_EVENTS.leadFormFailed, {
        path: journey.current.path,
        reason: state.reason,
      });
    }
  }, [state]);

  // Abandonment: the visitor engaged with the form and left without ever
  // getting a success back. This cannot key off unmount alone — the form is
  // replaced by the success message in the same component, so a completed
  // enquiry would otherwise be filed as an abandoned one.
  //
  // The field *count* is reported, never the field values: nothing the
  // visitor typed reaches analytics (see the spec's edge cases).
  useEffect(() => {
    const visit = journey.current;

    return () => {
      if (visit.started && !visit.succeeded) {
        track(ANALYTICS_EVENTS.leadFormAbandoned, {
          path: visit.path,
          fields_touched: visit.touchedFields.size,
        });
      }
    };
  }, []);

  if (state.ok) {
    return (
      <output className="text-foreground border-border bg-muted/40 block rounded-lg border p-4 text-sm">
        {labels.success}
      </output>
    );
  }

  return (
    <form action={dispatch} className="flex flex-col gap-4">
      {/* Honeypot: hidden from users, tempting for bots. Must stay empty. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="lead-website">Website</label>
        <input
          id="lead-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-name">
          {labels.nameLabel}{" "}
          <span className="text-muted-foreground">({labels.nameOptional})</span>
        </Label>
        <Input
          id="lead-name"
          name="name"
          autoComplete="name"
          onFocus={() => handleFieldFocus("name")}
          defaultValue={state.values?.name ?? ""}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-message">{labels.messageLabel}</Label>
        <Textarea
          id="lead-message"
          name="message"
          rows={8}
          onFocus={() => handleFieldFocus("message")}
          required
          placeholder={labels.messagePlaceholder}
          defaultValue={state.values?.message ?? ""}
          className="min-h-44"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-contact">{labels.contactLabel}</Label>
        <Input
          id="lead-contact"
          name="contact"
          required
          onFocus={() => handleFieldFocus("contact")}
          placeholder={labels.contactPlaceholder}
          defaultValue={state.values?.contact ?? ""}
        />
      </div>

      {turnstileSiteKey ? <TurnstileWidget siteKey={turnstileSiteKey} /> : null}

      {state.error ? (
        <p role="alert" aria-live="polite" className="text-destructive text-sm">
          {state.error}
        </p>
      ) : null}

      <SubmitButton
        submit={labels.submit}
        submitting={labels.submitting}
        onPress={() =>
          track(ANALYTICS_EVENTS.ctaClicked, {
            placement: "form_submit",
            target: "lead_form",
            path: pathname,
          })
        }
      />
    </form>
  );
}
