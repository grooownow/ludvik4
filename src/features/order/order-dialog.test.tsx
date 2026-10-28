import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  OrderFormInline,
  OrderProvider,
  SUCCESS_CLOSE_MS,
  useOrder,
  type OrderTarget,
} from "./order-dialog";

vi.mock("./smart-captcha", () => ({
  createCaptcha: vi.fn(async () => ({ token: async () => "captcha-token" })),
}));

const config = {
  endpoint: "https://functions.example/order",
  captchaSiteKey: "site",
  telegramUrl: "https://t.me/ludvik4work",
  email: "ludvik4go@yandex.com",
};
const target = { service: "Сайты", plan: "Расширенный", price: "55 000 ₽" };

beforeAll(() => {
  // jsdom has no modal dialogs.
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

function Trigger({ order, label }: { order?: OrderTarget; label: string }) {
  const { open } = useOrder();
  return (
    <button type="button" onClick={() => open(order, "service")}>
      {label}
    </button>
  );
}

async function openForm(withTarget = true) {
  const user = userEvent.setup();
  render(
    <OrderProvider config={config}>
      <Trigger
        order={withTarget ? target : undefined}
        label={withTarget ? "Заказать" : "Обсудить проект"}
      />
    </OrderProvider>,
  );
  await user.click(
    screen.getByRole("button", {
      name: withTarget ? "Заказать" : "Обсудить проект",
    }),
  );
  return user;
}

async function fillAndSend(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Как с вами связаться"), "@client");
  await user.click(screen.getByRole("checkbox"));
  await user.click(screen.getByRole("button", { name: "Отправить заявку" }));
}

describe("order dialog", () => {
  it("opens the form with the chosen service, package and price", async () => {
    await openForm();
    expect(
      screen.getByRole("heading", { name: "Сайты · Расширенный" }),
    ).toBeInTheDocument();
    expect(screen.getByText("55 000 ₽")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    // The box is the consent alone (152-ФЗ ст. 9 ч. 1): the policy is a
    // separate link, never something the visitor "accepts" with it.
    const label = screen.getByRole("checkbox").closest("label")!;
    expect(label).toHaveTextContent(
      "Даю согласие на обработку персональных данных",
    );
    expect(label).not.toHaveTextContent(/политик|принимаю/i);
    expect(
      screen.getByRole("link", { name: "политике конфиденциальности" }),
    ).toHaveAttribute("href", "/politika-konfidentsialnosti");
  });

  it("does not send without a contact and the consent", async () => {
    const user = await openForm();
    await user.click(screen.getByRole("button", { name: "Отправить заявку" }));
    expect(
      screen.getByText("Оставьте контакт, чтобы мы могли ответить."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Нужно согласие на обработку данных."),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the order with the package, channel and captcha token", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    const user = await openForm();
    await user.type(screen.getByLabelText("Как с вами связаться"), "@client");
    await user.click(screen.getByRole("button", { name: "Звонок" }));
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Отправить заявку" }));

    await screen.findByText("Получили вашу заявку!");
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe(config.endpoint);
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      service: "Сайты",
      plan: "Расширенный",
      price: "55 000 ₽",
      contact: "@client",
      channel: "call",
      consent: true,
      captchaToken: "captcha-token",
    });
    expect(typeof body.elapsedMs).toBe("number");
  });

  it("keeps the form and shows the reason when sending fails", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ ok: false, reason: "rate" }), {
        status: 429,
      }),
    );
    const user = await openForm();
    await user.type(screen.getByLabelText("Как с вами связаться"), "a@b.ru");
    await user.click(screen.getByRole("checkbox"));
    fireEvent.submit(screen.getByRole("button", { name: "Отправить заявку" }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Слишком много заявок",
      ),
    );
    expect(screen.getByLabelText("Как с вами связаться")).toHaveValue("a@b.ru");
    expect(screen.getByRole("link", { name: "Telegram" })).toHaveAttribute(
      "href",
      config.telegramUrl,
    );
  });

  it("opens empty from «Обсудить проект» and sends without a package", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    const user = await openForm(false);
    expect(
      screen.getByRole("heading", { name: "Обсудить проект" }),
    ).toBeInTheDocument();
    await user.type(
      screen.getByLabelText(/Расскажите о задаче/),
      "Нужен сайт для студии",
    );
    await fillAndSend(user);

    await screen.findByText("Получили вашу заявку!");
    const body = JSON.parse(fetchMock.mock.calls[0]![1].body);
    expect(body).toMatchObject({
      service: "",
      plan: "",
      comment: "Нужен сайт для студии",
    });
  });

  it("closes itself a moment after the thank-you note", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true })));
      const user = await openForm();
      await fillAndSend(user);
      await screen.findByText("Получили вашу заявку!");
      const dialog = document.querySelector("dialog")!;
      expect(dialog.open).toBe(true);
      await vi.advanceTimersByTimeAsync(SUCCESS_CLOSE_MS);
      expect(dialog.open).toBe(false);
      // The form stays while the dialog fades out, then it is dropped.
      // jsdom fires "close" as its own task, so the fade timer starts a tick
      // later: give it two windows.
      await vi.advanceTimersByTimeAsync(300);
      await vi.advanceTimersByTimeAsync(300);
      expect(screen.queryByText("Получили вашу заявку!")).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("renders no dialog and no inline form while unconfigured", () => {
    render(
      <OrderProvider>
        <OrderFormInline />
      </OrderProvider>,
    );
    expect(document.querySelector("dialog")).toBeNull();
    expect(screen.queryByLabelText("Как с вами связаться")).toBeNull();
  });

  it("closes on a press outside the card (on the backdrop)", async () => {
    await openForm();
    const dialog = document.querySelector("dialog")!;
    expect(dialog.open).toBe(true);
    fireEvent.click(screen.getByLabelText("Как с вами связаться"));
    expect(dialog.open).toBe(true);
    fireEvent.click(dialog);
    expect(dialog.open).toBe(false);
  });
});
