import { describe, expect, it } from "vitest";
import { isValidContact, leadSchema } from "./lead-schema";

describe("isValidContact", () => {
  it("accepts an email", () => {
    expect(isValidContact("kate@ludvik4.dev")).toBe(true);
  });

  it("accepts a messenger / url link", () => {
    expect(isValidContact("https://t.me/ludvik4work")).toBe(true);
    expect(isValidContact("t.me/ludvik4work")).toBe(true);
  });

  it("accepts a telegram @handle", () => {
    expect(isValidContact("@ludvik4work")).toBe(true);
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

  // The pattern the form actually receives from SEO-spam bots (2026-08-23):
  // a link where a person's name goes, and a "message" that is nothing but a
  // greeting around that same link. Real enquiries never put a URL in a name.
  describe("link spam", () => {
    it("rejects a name that carries a URL", () => {
      const parsed = leadSchema.safeParse({
        ...valid,
        name: "To the http://ludvik4.dev/fekal0911 Admin",
      });
      expect(parsed.success).toBe(false);
    });

    it("rejects a name that carries a bare domain", () => {
      const parsed = leadSchema.safeParse({
        ...valid,
        name: "ludvik4.dev Admin",
      });
      expect(parsed.success).toBe(false);
    });

    it("rejects a message that is only a greeting around a link", () => {
      const parsed = leadSchema.safeParse({
        ...valid,
        message: "Hi http://ludvik4.dev/fekal0911 Owner",
      });
      expect(parsed.success).toBe(false);
    });

    it("still accepts a real task that includes a link", () => {
      const parsed = leadSchema.safeParse({
        ...valid,
        message:
          "We need a redesign of https://example.com — the current site loses mobile users.",
      });
      expect(parsed.success).toBe(true);
    });
  });
});
