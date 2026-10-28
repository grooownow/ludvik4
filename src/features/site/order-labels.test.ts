import { describe, expect, it } from "vitest";
import { orderSchema } from "@/features/order";
import { PRICING_SLUGS, pricingServices } from "./pricing-draft";

// The order schema refuses links and odd characters in service, package and
// price (a bot could send anything there). Every label the site really sends
// must still pass, or "Заказать" would fail for real visitors.

const base = {
  contact: "@client",
  consent: true,
  elapsedMs: 9000,
  captchaToken: "t",
};

describe("order labels sent by the site", () => {
  it.each(
    pricingServices.flatMap((service) =>
      service.packages.map((pack) => [service.name, pack.name, pack.price]),
    ),
  )("%s · %s (%s) passes the order schema", (service, plan, price) => {
    const page = `/uslugi/${PRICING_SLUGS[pricingServices[0]!.id] ?? ""}/`;
    expect(
      orderSchema.safeParse({ ...base, service, plan, price, page }).success,
    ).toBe(true);
  });

  it("the mascot bubble's order passes the order schema", () => {
    expect(
      orderSchema.safeParse({ ...base, service: "Анимации и 3D", page: "/" })
        .success,
    ).toBe(true);
  });
});
