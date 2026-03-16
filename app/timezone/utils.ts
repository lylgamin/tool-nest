export const TIMEZONES = [
  { id: 'UTC',   label: 'UTC',           tz: 'UTC',                  offset: '+0:00'  },
  { id: 'JST',   label: 'JST（日本）',   tz: 'Asia/Tokyo',           offset: '+9:00'  },
  { id: 'CST',   label: 'CST（中国）',   tz: 'Asia/Shanghai',        offset: '+8:00'  },
  { id: 'IST',   label: 'IST（インド）', tz: 'Asia/Kolkata',         offset: '+5:30'  },
  { id: 'CET',   label: 'CET（中欧）',   tz: 'Europe/Paris',         offset: '+1:00'  },
  { id: 'EST',   label: 'EST（米東部）', tz: 'America/New_York',     offset: '-5:00'  },
  { id: 'PST',   label: 'PST（米西部）', tz: 'America/Los_Angeles',  offset: '-8:00'  },
  { id: 'AEST',  label: 'AEST（豪州）',  tz: 'Australia/Sydney',     offset: '+10:00' },
] as const

export type TimezoneId = typeof TIMEZONES[number]['id']

export type ConvertedTime = {
  id: string
  label: string
  offset: string
  formatted: string
}

function formatInTimezone(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).format(date).replace(/\//g, '-')
}

export function convertAllTimezones(unixMs: number): ConvertedTime[] {
  const date = new Date(unixMs)
  return TIMEZONES.map(tz => ({
    id:        tz.id,
    label:     tz.label,
    offset:    tz.offset,
    formatted: formatInTimezone(date, tz.tz),
  }))
}

export function parseToUnixMs(dateStr: string, timeStr: string, sourceTzId: string): number {
  const tz = TIMEZONES.find(t => t.id === sourceTzId)
  if (!tz) throw new Error(`Unknown timezone: ${sourceTzId}`)

  // Build an ISO string in UTC by computing the offset
  const offsetSign = tz.offset.startsWith('-') ? -1 : 1
  const offsetParts = tz.offset.replace(/[+-]/, '').split(':').map(Number)
  const offsetMinutes = offsetSign * (offsetParts[0] * 60 + (offsetParts[1] || 0))

  const isoStr = `${dateStr}T${timeStr}`
  const naive = new Date(isoStr + 'Z')
  if (isNaN(naive.getTime())) throw new Error('Invalid date')
  return naive.getTime() - offsetMinutes * 60 * 1000
}
