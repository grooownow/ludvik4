"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
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
}: {
  submit: string;
  submitting: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
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

  if (state.ok) {
    return (
      <output className="text-foreground border-border bg-muted/40 block rounded-lg border p-4 text-sm">
        {labels.success}
      </output>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
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
          defaultValue={state.values?.name ?? ""}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-message">{labels.messageLabel}</Label>
        <Textarea
          id="lead-message"
          name="message"
          rows={8}
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

      <SubmitButton submit={labels.submit} submitting={labels.submitting} />
    </form>
  );
}
