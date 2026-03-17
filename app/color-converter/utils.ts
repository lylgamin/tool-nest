export type RgbColor = { r: number; g: number; b: number }
export type HslColor = { h: number; s: number; l: number }
export type HsvColor = { h: number; s: number; v: number }

export type ColorResult = {
  hex: string
  rgb: RgbColor
  hsl: HslColor
  hsv: HsvColor
}

/** "#RGB" または "#RRGGBB" を RgbColor に変換。無効なら null を返す */
export function parseHex(hex: string): RgbColor | null {
  const clean = hex.replace(/^#/, '').trim()
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16)
    const g = parseInt(clean[1] + clean[1], 16)
    const b = parseInt(clean[2] + clean[2], 16)
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null
    return { r, g, b }
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null
    return { r, g, b }
  }
  return null
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  switch (max) {
    case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
    case gn: h = ((bn - rn) / d + 2) / 6; break
    default:  h = ((rn - gn) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToRgb({ h, s, l }: HslColor): RgbColor {
  const hn = h / 360, sn = s / 100, ln = l / 100
  if (sn === 0) {
    const v = Math.round(ln * 255)
    return { r: v, g: v, b: v }
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  return {
    r: Math.round(hue2rgb(hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(hn) * 255),
    b: Math.round(hue2rgb(hn - 1 / 3) * 255),
  }
}

export function rgbToHsv({ r, g, b }: RgbColor): HsvColor {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const v = max
  const d = max - min
  const s = max === 0 ? 0 : d / max
  let h = 0
  if (d !== 0) {
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
      case gn: h = ((bn - rn) / d + 2) / 6; break
      default:  h = ((rn - gn) / d + 4) / 6
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) }
}

export function hsvToRgb({ h, s, v }: HsvColor): RgbColor {
  const sn = s / 100, vn = v / 100
  if (sn === 0) {
    const val = Math.round(vn * 255)
    return { r: val, g: val, b: val }
  }
  const hn = h / 60
  const i = Math.floor(hn)
  const f = hn - i
  const p = vn * (1 - sn)
  const q = vn * (1 - sn * f)
  const t = vn * (1 - sn * (1 - f))
  const table = [
    [vn, t,  p ],
    [q,  vn, p ],
    [p,  vn, t ],
    [p,  q,  vn],
    [t,  p,  vn],
    [vn, p,  q ],
  ]
  const [r, g, b] = table[i % 6]
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

/** RGB を起点にすべての形式を計算して返す */
export function fromRgb(rgb: RgbColor): ColorResult {
  return {
    hex: rgbToHex(rgb),
    rgb,
    hsl: rgbToHsl(rgb),
    hsv: rgbToHsv(rgb),
  }
}
