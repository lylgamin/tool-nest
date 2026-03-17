export function escapeHtml(input: string): string {
  // In this order: & → &amp;  < → &lt;  > → &gt;  " → &quot;  ' → &#39;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function unescapeHtml(input: string): string {
  // Handle named entities and numeric/hex references
  // Unknown entities pass through unchanged
  return input.replace(/&(?:#(\d+)|#x([0-9A-Fa-f]+)|([a-zA-Z]+));/g, (match, dec, hex, named) => {
    if (dec) return String.fromCodePoint(parseInt(dec, 10))
    if (hex) return String.fromCodePoint(parseInt(hex, 16))
    const namedEntities: Record<string, string> = {
      amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'"
    }
    return namedEntities[named] ?? match
  })
}
