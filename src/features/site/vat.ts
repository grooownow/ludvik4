/** "€350" → "€423.50 incl. VAT"; "from €1,500" → "from €1,815 incl. VAT". */
export function withVat(
  price: string,
  rate = 0.21,
  label = "incl. VAT",
): string | undefined {
  const m = /^(from )?€([\d,]+)$/.exec(price);
  if (!m) return undefined;
  const cents = Math.round(
    Number(m[2]!.replace(/,/g, "")) * (100 + rate * 100),
  );
  const total = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: cents % 100 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
  return `${m[1] ?? ""}€${total} ${label}`;
}
