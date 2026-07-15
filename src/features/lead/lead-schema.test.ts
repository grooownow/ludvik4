import { describe, expect, it } from "vitest";
import { isValidContact, leadSchema } from "./lead-schema";

describe("isValidContact", () => {
  it("accepts an email", () => {
    expect(isValidContact("kate@ludvik4.dev")).toBe(true);
  });

  it("accepts a messenger / url link", () => {
    expect(isValidContact("https://t.me/ludvik4")).toBe(true);
    expect(isValidContact("t.me/ludvik4")).toBe(true);
  });

  it("accepts a telegram @handle", () => {
    expect(isValidContact("@ludvik4")).toBe(true);
  });

  it("accepts a phone number", () => {
    expect(isValidContact("+34 600 123 456")).toBe(true);
  });

  it("rejects obvious junk and empty strings", () => {
    expect(isValidContact("hi")).toBe(false);
    expect(isValidContact("")).toBe(false);
    expect(isValidContact("@ab")).toBe(false); // too short a handle
  });
});

describe("leadSchema", () => {
  const valid = {
    name: "Катя",
    message: "Нужен лендинг для небольшого сервиса, есть макет.",
    contact: "kate@ludvik4.dev",
  };

  it("parses a valid lead", () => {
    const parsed = leadSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("defaults an omitted name to an empty string", () => {
    const parsed = leadSchema.safeParse({
      message: valid.message,
      contact: valid.contact,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.name).toBe("");
  });

  it("rejects a too-short message", () => {
    const parsed = leadSchema.safeParse({ ...valid, message: "срочно" });
    expect(parsed.success).toBe(false);
  });

  it("rejects a missing contact", () => {
    const parsed = leadSchema.safeParse({ ...valid, contact: "" });
    expect(parsed.success).toBe(false);
  });

  it("rejects a junk contact", () => {
    const parsed = leadSchema.safeParse({ ...valid, contact: "позвоните" });
    expect(parsed.success).toBe(false);
  });
});
