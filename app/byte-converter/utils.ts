export type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB'

export type ConvertResult = {
  si: Record<Unit, string>   // SI単位系（10の累乗: 1KB=1000B）
  iec: Record<Unit, string>  // IEC単位系（2の累乗: 1KiB=1024B）
}

const SI_MULTIPLIERS: Record<Unit, number> = {
  B:  1,
  KB: 1_000,
  MB: 1_000_000,
  GB: 1_000_000_000,
  TB: 1_000_000_000_000,
}

const IEC_MULTIPLIERS: Record<Unit, number> = {
  B:  1,
  KB: 1_024,
  MB: 1_048_576,
  GB: 1_073_741_824,
  TB: 1_099_511_627_776,
}

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  if (n === 0) return '0'
  if (n >= 0.001 && n < 1e15) {
    const s = n.toPrecision(7)
    return parseFloat(s).toString()
  }
  return n.toExponential(4)
}

export function convertBytes(valueStr: string, unit: Unit): ConvertResult | null {
  const num = parseFloat(valueStr)
  if (!isFinite(num) || num < 0) return null

  const bytes    = num * SI_MULTIPLIERS[unit]
  const bytesIEC = num * IEC_MULTIPLIERS[unit]

  const units: Unit[] = ['B', 'KB', 'MB', 'GB', 'TB']
  const si  = {} as Record<Unit, string>
  const iec = {} as Record<Unit, string>

  for (const u of units) {
    si[u]  = fmt(bytes    / SI_MULTIPLIERS[u])
    iec[u] = fmt(bytesIEC / IEC_MULTIPLIERS[u])
  }

  return { si, iec }
}
