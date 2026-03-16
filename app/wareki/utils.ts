export type EraStyle = 'kanji' | 'alpha'

const ERAS = [
  { kanji: '令和', alpha: 'R', start: [2019, 5,  1],  baseYear: 2019 },
  { kanji: '平成', alpha: 'H', start: [1989, 1,  8],  baseYear: 1989 },
  { kanji: '昭和', alpha: 'S', start: [1926, 12, 25], baseYear: 1926 },
  { kanji: '大正', alpha: 'T', start: [1912, 7,  30], baseYear: 1912 },
  { kanji: '明治', alpha: 'M', start: [1868, 1,  25], baseYear: 1868 },
] as const

export type WarekiResult = {
  era: string
  year: number
  yearLabel: string
  full: string
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function compareDates(y1: number, m1: number, d1: number, y2: number, m2: number, d2: number): number {
  if (y1 !== y2) return y1 - y2
  if (m1 !== m2) return m1 - m2
  return d1 - d2
}

export function toWareki(
  year: number, month: number, day: number,
  style: EraStyle
): WarekiResult | null {
  for (const era of ERAS) {
    const [sy, sm, sd] = era.start
    if (compareDates(year, month, day, sy, sm, sd) >= 0) {
      const eraYear = year - era.baseYear + 1
      const eraLabel = style === 'kanji' ? era.kanji : era.alpha
      let yearLabel: string
      if (style === 'kanji') {
        yearLabel = eraYear === 1 ? `${era.kanji}元年` : `${era.kanji}${eraYear}年`
      } else {
        yearLabel = `${era.alpha}${eraYear}`
      }
      let full: string
      if (style === 'kanji') {
        const yearStr = eraYear === 1 ? '元年' : `${eraYear}年`
        full = `${era.kanji}${yearStr}${month}月${day}日`
      } else {
        full = `${era.alpha}${eraYear}.${pad2(month)}.${pad2(day)}`
      }
      return { era: eraLabel, year: eraYear, yearLabel, full }
    }
  }
  return null
}

export function toSeireki(
  era: string, eraYear: number, month: number, day: number
): { year: number; month: number; day: number } | null {
  const found = ERAS.find(e => e.kanji === era || e.alpha === era)
  if (!found) return null
  const year = found.baseYear + eraYear - 1
  const [sy, sm, sd] = found.start
  if (compareDates(year, month, day, sy, sm, sd) < 0) return null
  // Check not in next era
  const eraIndex = ERAS.indexOf(found)
  if (eraIndex > 0) {
    const nextEra = ERAS[eraIndex - 1]
    const [ny, nm, nd] = nextEra.start
    if (compareDates(year, month, day, ny, nm, nd) >= 0) return null
  }
  return { year, month, day }
}
