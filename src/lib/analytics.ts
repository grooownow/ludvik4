/** Keep optional analytics aligned with the per-market privacy contract. */
export function shouldLoadPostHog(
  market: string | undefined,
  publicKey: string | undefined,
): boolean {
  return market === "en" && Boolean(publicKey);
}
