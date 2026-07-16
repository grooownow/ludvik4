/**
 * Serialize structured data for an inline `<script type="application/ld+json">`.
 *
 * Escapes `<` so a value containing `</script>` can never break out of the
 * script element — cheap hardening even though all current JSON-LD content
 * is repo-controlled (landing data, FAQ array, article frontmatter).
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}
