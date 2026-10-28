import { describe, expect, it } from "vitest";
import { isValidContact, orderSchema } from "./order-schema";

const valid = {
  service: "Лендинги",
  plan: "Базовый",
  price: "20 000 ₽",
  contact: "+7 900 123-45-67",
  consent: true,
  elapsedMs: 8000,
  captchaToken: "token",
};

describe("isValidContact", () => {
  it.each([
    "+7 900 123-45-67",
    "@ludvik",
    "a@b.ru",
    "https://vk.com/x",
    "t.me/x",
  ])("accepts %s", (v) => expect(isValidContact(v)).toBe(true));
  it.each(["", "hi", "123", "@ab"])("rejects %j", (v) =>
    expect(isValidContact(v)).toBe(false),
  );
});

describe("orderSchema", () => {
  it("accepts a minimal order and fills defaults", () => {
    const order = orderSchema.parse(valid);
    expect(order.name).toBe("");
    expect(order.website).toBe("");
  });

  it("requires the consent", () => {
    const result = orderSchema.safeParse({ ...valid, consent: false });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["consent"]);
  });

  it("rejects a link as a name", () => {
    expect(
      orderSchema.safeParse({ ...valid, name: "buy.example.com" }).success,
    ).toBe(false);
  });

  it("rejects an unknown channel", () => {
    expect(orderSchema.safeParse({ ...valid, channel: "fax" }).success).toBe(
      false,
    );
  });

  it("rejects a comment over 1000 characters", () => {
    expect(
      orderSchema.safeParse({ ...valid, comment: "a".repeat(1001) }).success,
    ).toBe(false);
  });
});
