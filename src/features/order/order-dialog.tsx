"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  CHANNEL_LABELS,
  COMMENT_MAX,
  ORDER_CHANNELS,
  orderSchema,
  type OrderChannel,
  type OrderResponse,
} from "./order-schema";
import { createCaptcha, type Captcha } from "./smart-captcha";

// The RU order form. One dialog for the whole site: "Заказать" on a pricing
// package opens it with the service and package filled in, "Обсудить проект"
// opens it empty, and /contact shows the same form inline. The visitor leaves
// a contact and, if they like, a few words. Spec: docs/specs/order-form-ru.md.

/** What is being ordered; absent when the visitor just wants to talk. */
export type OrderTarget = { service: string; plan: string; price: string };

export type OrderConfig = {
  endpoint: string;
  captchaSiteKey: string;
  telegramUrl: string;
  email: string;
};

/** The dialog's fade, matching `.order-dialog` in globals.css. */
const DIALOG_FADE_MS = 250;

/** How long the "получили заявку" message stays before the dialog closes. */
export const SUCCESS_CLOSE_MS = 4000;

const ERRORS: Record<Exclude<OrderResponse, { ok: true }>["reason"], string> = {
  invalid: "Проверьте поля формы.",
  captcha: "Не получилось пройти проверку на робота. Попробуйте ещё раз.",
  rate: "Слишком много заявок подряд. Попробуйте через пару минут.",
  server: "Заявка не отправилась. Попробуйте ещё раз или напишите нам.",
};

/** "Сайты · Расширенный", or just the service when no package is picked. */
function orderTitle(target: OrderTarget) {
  return [target.service, target.plan].filter(Boolean).join(" · ");
}

type FieldErrors = Partial<Record<"contact" | "comment" | "consent", string>>;

/** Validates what the visitor typed, before the captcha runs. */
function checkFields(data: Record<string, unknown>): FieldErrors {
  const result = orderSchema
    .omit({ captchaToken: true, elapsedMs: true })
    .safeParse(data);
  if (result.success) return {};
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof FieldErrors;
    errors[key] ??= issue.message;
  }
  return errors;
}

type OrderContextValue = {
  /** Undefined while the form is not configured: buttons fall back to /contact. */
  config?: OrderConfig;
  open: (target: OrderTarget | undefined, placement: string) => void;
};

const OrderContext = createContext<OrderContextValue>({ open: () => {} });

export function useOrder() {
  return useContext(OrderContext);
}

/** Holds the site's single order dialog. Mounted once, in the root layout. */
export function OrderProvider({
  config,
  children,
}: {
  config?: OrderConfig;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const path = usePathname();
  const [target, setTarget] = useState<OrderTarget | undefined>();
  // A new key per opening: the form starts empty every time.
  const [session, setSession] = useState(0);
  // The form stays mounted while the dialog fades out, then it is dropped.
  const unmountTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // A press on the backdrop closes the dialog (the content fills the dialog
  // box, so a press that lands on the <dialog> itself is outside the card).
  // A native listener: Escape already covers the keyboard.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onClick = (event: MouseEvent) => {
      if (event.target === el) el.close();
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [config]);

  const open = useCallback(
    (next: OrderTarget | undefined, placement: string) => {
      clearTimeout(unmountTimer.current);
      setTarget(next);
      setSession((s) => s + 1);
      dialog.current?.showModal();
      track(ANALYTICS_EVENTS.ctaClicked, {
        placement,
        target: next ? "order" : "discuss",
        path,
      });
    },
    [path],
  );
  const value = useMemo(() => ({ config, open }), [config, open]);

  return (
    <OrderContext value={value}>
      {children}
      {config ? (
        <dialog
          ref={dialog}
          aria-label={
            target ? `Заказ: ${orderTitle(target)}` : "Обсудить проект"
          }
          onClose={() => {
            unmountTimer.current = setTimeout(
              () => setSession(0),
              DIALOG_FADE_MS,
            );
          }}
          className="order-dialog m-auto w-[min(100%-2rem,32rem)] rounded-3xl bg-transparent p-0"
        >
          {session > 0 ? (
            <div className="bg-background max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl p-6 shadow-xl sm:p-8">
              <OrderForm
                key={session}
                target={target}
                config={config}
                path={path}
                onClose={() => dialog.current?.close()}
              />
            </div>
          ) : null}
        </dialog>
      ) : null}
    </OrderContext>
  );
}

/** The order form inline, for /contact. Renders nothing while unconfigured. */
export function OrderFormInline() {
  const { config } = useOrder();
  const path = usePathname();
  const [session, setSession] = useState(1);
  if (!config) return null;
  return (
    <OrderForm
      key={session}
      config={config}
      path={path}
      onAgain={() => setSession((s) => s + 1)}
    />
  );
}

function OrderForm({
  target,
  config,
  path,
  onClose,
  onAgain,
}: {
  target?: OrderTarget;
  config: OrderConfig;
  path: string;
  /** Set in the dialog: shows the close button and closes after success. */
  onClose?: () => void;
  /** Set inline: offers to send another request after success. */
  onAgain?: () => void;
}) {
  const ids = useId();
  const openedAt = useRef(Date.now());
  const captchaBox = useRef<HTMLDivElement>(null);
  const captcha = useRef<Promise<Captcha> | undefined>(undefined);
  const [channel, setChannel] = useState<OrderChannel | undefined>();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [failure, setFailure] = useState<string | undefined>();

  // The captcha script loads as soon as the form appears, so the check is
  // ready by the time the visitor presses "Отправить".
  useEffect(() => {
    if (captchaBox.current && !captcha.current) {
      captcha.current = createCaptcha(
        captchaBox.current,
        config.captchaSiteKey,
      );
      captcha.current.catch(() => {
        captcha.current = undefined;
      });
    }
  }, [config.captchaSiteKey]);

  // In the dialog the thank-you note closes itself after a moment.
  useEffect(() => {
    if (status !== "sent" || !onClose) return;
    const timer = setTimeout(onClose, SUCCESS_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [status, onClose]);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fields = {
      service: target?.service ?? "",
      plan: target?.plan ?? "",
      price: target?.price ?? "",
      page: path ?? "",
      contact: String(form.get("contact") ?? ""),
      channel,
      comment: String(form.get("comment") ?? ""),
      consent: form.get("consent") === "on",
      website: String(form.get("website") ?? ""),
    };
    const fieldErrors = checkFields(fields);
    setErrors(fieldErrors);
    setFailure(undefined);
    if (Object.keys(fieldErrors).length > 0) return;

    setStatus("sending");
    try {
      captcha.current ??= createCaptcha(
        captchaBox.current!,
        config.captchaSiteKey,
      );
      const captchaToken = await (await captcha.current).token();
      const response = await fetch(config.endpoint, {
        method: "POST",
        // text/plain keeps it a "simple" CORS request: no preflight.
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({
          ...fields,
          elapsedMs: Date.now() - openedAt.current,
          captchaToken,
        }),
      });
      const body = (await response
        .json()
        .catch(() => null)) as OrderResponse | null;
      if (body?.ok) {
        setStatus("sent");
        track(ANALYTICS_EVENTS.leadFormSubmitted, { path });
        return;
      }
      setFailure(ERRORS[body?.reason ?? "server"]);
    } catch {
      setFailure(ERRORS.captcha);
    }
    setStatus("idle");
  }

  const header = onClose ? (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-stage-muted text-sm">
          {target ? "Заказ" : "Заявка"}
        </p>
        <h2 className="text-foreground mt-1 text-xl font-semibold">
          {target ? orderTitle(target) : "Обсудить проект"}
        </h2>
        {target?.price ? (
          <p className="text-primary mt-1 text-sm font-medium">
            {target.price}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть"
        className="text-stage-muted hover:text-foreground -mt-1 -mr-1 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-2xl leading-none"
      >
        ×
      </button>
    </div>
  ) : null;

  if (status === "sent") {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <output className="text-foreground block text-base leading-relaxed">
          <span className="block text-lg font-semibold">
            Получили вашу заявку!
          </span>
          Скоро свяжемся тем способом, который вы указали, — обычно в течение
          рабочего дня.
        </output>
        {onClose ? (
          <Button
            type="button"
            size="lg"
            className="h-12 w-full rounded-full text-base"
            onClick={onClose}
          >
            Хорошо
          </Button>
        ) : (
          <button
            type="button"
            onClick={onAgain}
            className="text-stage-muted self-start text-sm underline underline-offset-4"
          >
            Отправить ещё одну заявку
          </button>
        )}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-5">
      {header}

      {/* Honeypot: hidden from people, tempting for bots. Must stay empty. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label>
          Сайт
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${ids}-contact`}>Как с вами связаться</Label>
        <Input
          id={`${ids}-contact`}
          name="contact"
          required
          autoComplete="on"
          placeholder="Телефон, @ник, почта или ссылка"
          aria-invalid={errors.contact ? true : undefined}
          aria-describedby={errors.contact ? `${ids}-contact-error` : undefined}
          className="h-11 rounded-xl"
        />
        {errors.contact ? (
          <p id={`${ids}-contact-error`} className="text-destructive text-sm">
            {errors.contact}
          </p>
        ) : null}
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Где удобнее ответить</legend>
          {ORDER_CHANNELS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={channel === option}
              onClick={() =>
                setChannel(channel === option ? undefined : option)
              }
              className={cn(
                "cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors",
                channel === option
                  ? "border-foreground bg-foreground text-white"
                  : "border-pink-soft text-stage-muted hover:border-primary/40 hover:text-foreground",
              )}
            >
              {CHANNEL_LABELS[option]}
            </button>
          ))}
        </fieldset>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${ids}-comment`}>
          {target ? "Пара слов о задаче" : "Расскажите о задаче"}{" "}
          <span className="text-stage-muted font-normal">— необязательно</span>
        </Label>
        <Textarea
          id={`${ids}-comment`}
          name="comment"
          rows={target ? 3 : 4}
          maxLength={COMMENT_MAX}
          aria-invalid={errors.comment ? true : undefined}
          className="rounded-xl"
        />
        {errors.comment ? (
          <p className="text-destructive text-sm">{errors.comment}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-foreground/80 flex cursor-pointer items-start gap-3 text-sm leading-snug">
          <input
            type="checkbox"
            name="consent"
            aria-invalid={errors.consent ? true : undefined}
            className="accent-primary mt-0.5 size-4 shrink-0"
          />
          <span>
            Даю{" "}
            <Link
              href="/soglasie"
              target="_blank"
              className="text-primary underline underline-offset-2"
            >
              согласие на обработку персональных данных
            </Link>
          </span>
        </label>
        {/* The consent is its own document (152-ФЗ ст. 9 ч. 1): the box covers
            only the consent, the policy is a link to read, not to accept. */}
        <p className="text-stage-muted pl-7 text-xs leading-snug">
          Как мы храним и защищаем данные — в{" "}
          <Link
            href="/politika-konfidentsialnosti"
            target="_blank"
            className="underline underline-offset-2"
          >
            политике конфиденциальности
          </Link>
          .
        </p>
        {errors.consent ? (
          <p className="text-destructive text-sm">{errors.consent}</p>
        ) : null}
      </div>

      <div ref={captchaBox} />

      {failure ? (
        <p role="alert" className="text-destructive text-sm">
          {failure}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={status === "sending"}
        className="h-12 w-full rounded-full text-base font-medium"
      >
        {status === "sending" ? "Отправляем…" : "Отправить заявку"}
      </Button>

      <p className="text-stage-muted text-xs leading-relaxed">
        Форму защищает Yandex SmartCaptcha, она обрабатывает данные по своей{" "}
        <a
          href="https://yandex.ru/legal/smartcaptcha_notice/"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2"
        >
          политике
        </a>
        . Удобнее написать самим?{" "}
        <a
          href={config.telegramUrl}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2"
        >
          Telegram
        </a>{" "}
        или{" "}
        <a
          href={`mailto:${config.email}`}
          className="underline underline-offset-2"
        >
          {config.email}
        </a>
        .
      </p>
    </form>
  );
}
