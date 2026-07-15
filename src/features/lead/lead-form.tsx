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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Отправляю…" : "Отправить заявку"}
    </Button>
  );
}

/**
 * Contact form. `useActionState` surfaces the server action's result: a success
 * message replaces the form, a failure renders the error (aria-live) and keeps
 * the typed values. The Turnstile widget mounts only when a site key is set.
 */
export function LeadForm({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  const [state, formAction] = useActionState(submitLeadAction, initialState);

  if (state.ok) {
    return (
      <output className="text-foreground border-border bg-muted/40 block rounded-lg border p-4 text-sm">
        Заявка отправлена — отвечу в ближайшее время. Спасибо!
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
          Имя <span className="text-muted-foreground">(необязательно)</span>
        </Label>
        <Input
          id="lead-name"
          name="name"
          autoComplete="name"
          defaultValue={state.values?.name ?? ""}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-message">Задача</Label>
        <Textarea
          id="lead-message"
          name="message"
          rows={5}
          required
          placeholder="Опишите, что нужно сделать…"
          defaultValue={state.values?.message ?? ""}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-contact">Как с вами связаться</Label>
        <Input
          id="lead-contact"
          name="contact"
          required
          placeholder="email или ссылка на мессенджер / телефон"
          defaultValue={state.values?.contact ?? ""}
        />
      </div>

      {turnstileSiteKey ? <TurnstileWidget siteKey={turnstileSiteKey} /> : null}

      {state.error ? (
        <p role="alert" aria-live="polite" className="text-destructive text-sm">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
