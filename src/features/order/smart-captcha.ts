// Invisible Yandex SmartCaptcha, loaded on demand (only when the order form
// opens). API: https://yandex.cloud/ru/docs/smartcaptcha/concepts/invisible-captcha
// The shield is hidden, so the form itself tells visitors that SmartCaptcha
// processes their data — Yandex requires that notice.

const SCRIPT_URL =
  "https://smartcaptcha.cloud.yandex.ru/captcha.js?render=onload&onload=onSmartCaptchaLoad";

type SmartCaptcha = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      invisible: boolean;
      hideShield: boolean;
      hl: string;
      callback: (token: string) => void;
    },
  ) => number;
  execute: (widgetId: number) => void;
  reset: (widgetId: number) => void;
  subscribe: (
    widgetId: number,
    event: "challenge-hidden" | "network-error",
    handler: () => void,
  ) => () => void;
};

declare global {
  interface Window {
    smartCaptcha?: SmartCaptcha;
    onSmartCaptchaLoad?: () => void;
  }
}

let loading: Promise<SmartCaptcha> | undefined;

function loadScript(): Promise<SmartCaptcha> {
  if (window.smartCaptcha) return Promise.resolve(window.smartCaptcha);
  loading ??= new Promise<SmartCaptcha>((resolve, reject) => {
    window.onSmartCaptchaLoad = () =>
      window.smartCaptcha
        ? resolve(window.smartCaptcha)
        : reject(new Error("SmartCaptcha did not load"));
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.defer = true;
    script.onerror = () => {
      loading = undefined;
      reject(new Error("SmartCaptcha script failed"));
    };
    document.head.append(script);
  });
  return loading;
}

/**
 * One invisible widget bound to a container. `token()` runs the check and
 * resolves with a fresh single-use token; it rejects when the visitor closes
 * the challenge or the network fails.
 */
export async function createCaptcha(container: HTMLElement, siteKey: string) {
  const captcha = await loadScript();
  let pending:
    { resolve: (t: string) => void; reject: (e: Error) => void } | undefined;

  const id = captcha.render(container, {
    sitekey: siteKey,
    invisible: true,
    hideShield: true,
    hl: "ru",
    callback: (token) => {
      pending?.resolve(token);
      pending = undefined;
    },
  });
  // The challenge window also closes after a solved task; the callback may
  // land just after that event, so a close only fails a check still pending
  // a moment later.
  const fail = (message: string) => () => {
    const waiting = pending;
    setTimeout(() => {
      if (pending !== waiting || !waiting) return;
      waiting.reject(new Error(message));
      pending = undefined;
    }, 600);
  };
  captcha.subscribe(id, "challenge-hidden", fail("challenge closed"));
  captcha.subscribe(id, "network-error", fail("network error"));

  return {
    token(): Promise<string> {
      return new Promise<string>((resolve, reject) => {
        pending = { resolve, reject };
        captcha.reset(id);
        captcha.execute(id);
      });
    },
  };
}

export type Captcha = Awaited<ReturnType<typeof createCaptcha>>;
