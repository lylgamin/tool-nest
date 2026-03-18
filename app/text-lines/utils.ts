export function deduplicateLines(text: string, caseSensitive: boolean): string {
  if (!text) return ''
  const lines = text.split('\n')
  const seen = new Set<string>()
  return lines.filter(line => {
    const key = caseSensitive ? line : line.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).join('\n')
}

export function sortLines(text: string, order: 'asc' | 'desc', caseSensitive: boolean): string {
  if (!text) return ''
  const lines = text.split('\n')
  const sorted = [...lines].sort((a, b) => {
    const ka = caseSensitive ? a : a.toLowerCase()
    const kb = caseSensitive ? b : b.toLowerCase()
    return ka < kb ? -1 : ka > kb ? 1 : 0
  })
  return (order === 'desc' ? sorted.reverse() : sorted).join('\n')
}

export function reverseLines(text: string): string {
  if (!text) return ''
  return text.split('\n').reverse().join('\n')
}

export function addLineNumbers(text: string, start: number): string {
  if (!text) return ''
  return text.split('\n').map((line, i) => `${i + start}: ${line}`).join('\n')
}

export function removeEmptyLines(text: string): string {
  if (!text) return ''
  return text.split('\n').filter(line => line.trim() !== '').join('\n')
}

export function trimLines(text: string): string {
  if (!text) return ''
  return text.split('\n').map(line => line.trim()).join('\n')
}
