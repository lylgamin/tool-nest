export type TimestampResult = {
  unix: number
  unixMs: number
  iso: string
  jst: string
  utc: string
}

const JST_OFFSET = 9 * 60 * 60 * 1000

function formatDateTime(date: Date, offsetMs: number): string {
  const local = new Date(date.getTime() + offsetMs)
  const y  = local.getUTCFullYear()
  const mo = String(local.getUTCMonth() + 1).padStart(2, '0')
  const d  = String(local.getUTCDate()).padStart(2, '0')
  const h  = String(local.getUTCHours()).padStart(2, '0')
  const mi = String(local.getUTCMinutes()).padStart(2, '0')
  const s  = String(local.getUTCSeconds()).padStart(2, '0')
  return `${y}-${mo}-${d} ${h}:${mi}:${s}`
}

export function fromUnix(unix: number): TimestampResult {
  const date = new Date(unix * 1000)
  return {
    unix,
    unixMs: unix * 1000,
    iso:    date.toISOString(),
    jst:    formatDateTime(date, JST_OFFSET),
    utc:    formatDateTime(date, 0),
  }
}

// dateStr: 'yyyy-mm-dd', timeStr: 'HH:MM:SS', offsetHours: e.g. 9 for JST
export function toUnix(dateStr: string, timeStr: string, offsetHours: number): number {
  const [year, month, day]    = dateStr.split('-').map(Number)
  const [hour, minute, second] = timeStr.split(':').map(Number)
  const offsetMs = offsetHours * 60 * 60 * 1000
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second) - offsetMs
  return Math.floor(utcMs / 1000)
}
