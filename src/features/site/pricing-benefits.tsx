import type { PricingService } from "./pricing-draft";

// "Что вы получаете" on /uslugi (owner's pick of four layouts, 2026-10-26):
// the three that matter most as small numbered cards, the rest as a compact
// checked list under them. A server component — nothing here is interactive.

type Items = PricingService["benefits"];

function Check() {
  return (
    <span
      aria-hidden="true"
      className="bg-primary/12 text-primary grid size-6 shrink-0 place-items-center rounded-full text-xs"
    >
      ✓
    </span>
  );
}

export function PricingBenefits({ items }: { items: Items }) {
  const [main, rest] = [items.slice(0, 3), items.slice(3)];
  return (
    <div>
      <ul className="grid gap-4 md:grid-cols-3">
        {main.map((item, i) => (
          <li
            key={`${item.title}-${i}`}
            className="border-primary/25 rounded-2xl border bg-white p-5 shadow-[0_18px_50px_-34px_rgba(255,79,182,0.7)]"
          >
            <p className="text-primary font-mono text-xs tracking-[0.14em]">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 text-lg font-semibold tracking-tight">
              {item.title}
            </p>
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
              {item.text}
            </p>
          </li>
        ))}
      </ul>
      <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((item, i) => (
          <li key={`${item.title}-${i}`} className="flex gap-3">
            <Check />
            <div>
              <p className="text-[15px] font-semibold tracking-tight">
                {item.title}
              </p>
              <p className="text-muted-foreground mt-0.5 text-[13px] leading-snug">
                {item.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
