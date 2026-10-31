import { describe, expect, it } from "vitest";
import { formatEuro, localizePrice, withVat } from "./vat";

describe("withVat", () => {
  it("adds 21% and keeps cents only when there are any", () => {
    expect(withVat("€200")).toBe("€242 incl. VAT");
    expect(withVat("€350")).toBe("€423.50 incl. VAT");
    expect(withVat("€1,300")).toBe("€1,573 incl. VAT");
    expect(withVat("from €1,500")).toBe("from €1,815 incl. VAT");
  });

  it("writes Spanish and Russian totals the way those languages write money", () => {
    expect(withVat("350 €", 0.21, "IVA incl.", "es")).toBe(
      "423,50 € IVA incl.",
    );
    expect(withVat("desde 1500 €", 0.21, "IVA incl.", "es")).toBe(
      "desde 1815 € IVA incl.",
    );
    expect(withVat("от 1 500 €", 0.21, "с НДС", "ru")).toBe("от 1 815 € с НДС");
  });

  it("derives localized prices from the English ones", () => {
    expect(localizePrice("es", "€1,300")).toBe("1300 €");
    expect(localizePrice("es", "from €6,000")).toBe("desde 6000 €");
    expect(localizePrice("es", "€20,000")).toBe("20.000 €");
    expect(localizePrice("ru", "from €1,500")).toBe("от 1 500 €");
    expect(localizePrice("ru", "€200")).toBe("200 €");
    expect(formatEuro("en", 1500, true)).toBe("from €1,500");
  });

  it("leaves prices it cannot read alone", () => {
    expect(withVat("20 000 ₽")).toBeUndefined();
    expect(withVat("on request")).toBeUndefined();
  });
});
