export type ParseResult = { ok: true; r: number; g: number; b: number } | { ok: false; error: string }

/** Parse hex, rgb(), rgba() color strings to 0-255 components */
export function parseColor(input: string): ParseResult {
  const s = input.trim()
  // hex: #rgb, #rrggbb
  const hex3 = s.match(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i)
  if (hex3) {
    return { ok: true, r: parseInt(hex3[1]+hex3[1],16), g: parseInt(hex3[2]+hex3[2],16), b: parseInt(hex3[3]+hex3[3],16) }
  }
  const hex6 = s.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (hex6) {
    return { ok: true, r: parseInt(hex6[1],16), g: parseInt(hex6[2],16), b: parseInt(hex6[3],16) }
  }
  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgb = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (rgb) {
    return { ok: true, r: parseInt(rgb[1]), g: parseInt(rgb[2]), b: parseInt(rgb[3]) }
  }
  return { ok: false, error: `色の形式が無効です: "${input}"（例: #fff, #1a2b3c, rgb(255,0,0)）` }
}

/** sRGB channel linearization */
function linearize(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

/** Relative luminance (WCAG 2.x) */
export function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

/** Contrast ratio between two luminance values */
export function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export type WcagLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail'

export interface ContrastResult {
  ratio: number
  normalText: WcagLevel   // AA: 4.5, AAA: 7
  largeText: WcagLevel    // AA: 3, AAA: 4.5
  uiComponent: WcagLevel  // AA: 3
}

export function checkContrast(fg: { r: number; g: number; b: number }, bg: { r: number; g: number; b: number }): ContrastResult {
  const lFg = relativeLuminance(fg.r, fg.g, fg.b)
  const lBg = relativeLuminance(bg.r, bg.g, bg.b)
  const ratio = contrastRatio(lFg, lBg)

  function level(aaThreshold: number, aaaThreshold: number): WcagLevel {
    if (ratio >= aaaThreshold) return 'AAA'
    if (ratio >= aaThreshold) return 'AA'
    if (ratio >= 3 && aaThreshold > 3) return 'AA Large'
    return 'Fail'
  }

  return {
    ratio,
    normalText: level(4.5, 7),
    largeText: level(3, 4.5),
    uiComponent: level(3, 4.5),
  }
}

/** Convert RGB to hex string */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}
