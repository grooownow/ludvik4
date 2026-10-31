import { describe, expect, it } from "vitest";
import { withVat } from "./vat";

describe("withVat", () => {
  it("adds 21% and keeps cents only when there are any", () => {
    expect(withVat("€200")).toBe("€242 incl. VAT");
    expect(withVat("€350")).toBe("€423.50 incl. VAT");
    expect(withVat("€1,300")).toBe("€1,573 incl. VAT");
    expect(withVat("from €1,500")).toBe("from €1,815 incl. VAT");
  });

  it("leaves prices it cannot read alone", () => {
    expect(withVat("20 000 ₽")).toBeUndefined();
    expect(withVat("on request")).toBeUndefined();
  });
});
