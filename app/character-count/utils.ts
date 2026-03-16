export type CountStats = {
  chars: number
  charsNoSpace: number
  bytes: number
  lines: number
  words: number
}

export function countStats(text: string): CountStats {
  return {
    chars: text.length,
    charsNoSpace: text.replace(/\s/g, '').length,
    bytes: new TextEncoder().encode(text).length, // UTF-8バイト数
    lines: text === '' ? 0 : text.split('\n').length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
  }
}
