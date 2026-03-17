export type DiffResult = {
  totalMs: number
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  approxYears: number
  approxMonths: number
  approxDaysRemainder: number
  isPast: boolean
}

export function calcDiff(date1: string, date2: string): DiffResult | null {
  const d1 = new Date(date1)
  const d2 = new Date(date2)

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null

  const totalMs = Math.abs(d2.getTime() - d1.getTime())
  const totalSeconds = Math.floor(totalMs / 1000)
  const totalMinutes = Math.floor(totalMs / 60000)
  const totalHours = Math.floor(totalMs / 3600000)
  const totalDays = Math.floor(totalMs / 86400000)

  const days = totalDays
  const hours = Math.floor((totalMs % 86400000) / 3600000)
  const minutes = Math.floor((totalMs % 3600000) / 60000)
  const seconds = Math.floor((totalMs % 60000) / 1000)

  const approxYears = Math.floor(totalDays / 365)
  const approxMonths = Math.floor((totalDays % 365) / 30)
  const approxDaysRemainder = totalDays % 30

  const isPast = d1.getTime() > d2.getTime()

  return {
    totalMs,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    approxYears,
    approxMonths,
    approxDaysRemainder,
    isPast,
  }
}

export function formatDuration(result: DiffResult): string {
  const parts: string[] = []

  if (result.approxYears > 0) parts.push(`${result.approxYears}年`)
  if (result.approxMonths > 0) parts.push(`${result.approxMonths}ヶ月`)
  if (result.approxDaysRemainder > 0 || parts.length === 0) {
    parts.push(`${result.approxDaysRemainder}日`)
  }

  const timeParts: string[] = []
  if (result.hours > 0) timeParts.push(`${result.hours}時間`)
  if (result.minutes > 0) timeParts.push(`${result.minutes}分`)

  if (timeParts.length > 0) {
    parts.push(timeParts.join(''))
  }

  return parts.join('')
}
