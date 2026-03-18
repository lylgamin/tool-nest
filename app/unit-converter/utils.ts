export type UnitCategory = 'length' | 'weight' | 'temperature' | 'speed' | 'area'

export type UnitDef = {
  id: string
  label: string
  toBase: (v: number) => number
  fromBase: (v: number) => number
}

export const UNIT_DEFS: Record<UnitCategory, UnitDef[]> = {
  length: [
    { id: 'mm', label: 'ミリメートル (mm)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { id: 'cm', label: 'センチメートル (cm)', toBase: v => v / 100, fromBase: v => v * 100 },
    { id: 'm', label: 'メートル (m)', toBase: v => v, fromBase: v => v },
    { id: 'km', label: 'キロメートル (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { id: 'in', label: 'インチ (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { id: 'ft', label: 'フィート (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { id: 'mi', label: 'マイル (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
  ],
  weight: [
    { id: 'mg', label: 'ミリグラム (mg)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { id: 'g', label: 'グラム (g)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { id: 'kg', label: 'キログラム (kg)', toBase: v => v, fromBase: v => v },
    { id: 't', label: 'トン (t)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { id: 'oz', label: 'オンス (oz)', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    { id: 'lb', label: 'ポンド (lb)', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
  ],
  temperature: [
    { id: 'c', label: '摂氏 (°C)', toBase: v => v, fromBase: v => v },
    { id: 'f', label: '華氏 (°F)', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
    { id: 'k', label: 'ケルビン (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  ],
  speed: [
    { id: 'mps', label: 'm/s', toBase: v => v, fromBase: v => v },
    { id: 'kmh', label: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
    { id: 'mph', label: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    { id: 'knot', label: 'ノット (knot)', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
  ],
  area: [
    { id: 'mm2', label: 'mm²', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { id: 'cm2', label: 'cm²', toBase: v => v / 1e4, fromBase: v => v * 1e4 },
    { id: 'm2', label: 'm²', toBase: v => v, fromBase: v => v },
    { id: 'km2', label: 'km²', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
    { id: 'ha', label: 'ヘクタール (ha)', toBase: v => v * 1e4, fromBase: v => v / 1e4 },
    { id: 'acre', label: 'エーカー (acre)', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
  ],
}

export function convert(value: number, fromId: string, toId: string, category: UnitCategory): number {
  const units = UNIT_DEFS[category]
  const from = units.find(u => u.id === fromId)
  const to = units.find(u => u.id === toId)
  if (!from || !to) throw new Error(`Unknown unit: ${fromId} or ${toId}`)
  const baseValue = from.toBase(value)
  return to.fromBase(baseValue)
}
