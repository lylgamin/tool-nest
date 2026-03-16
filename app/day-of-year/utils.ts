export type DayOfYearResult = {
  dayOfYear: number    // 1-366（1月1日=1）
  remaining: number    // 年末まで残り日数（12/31を含む）
  isLeapYear: boolean
  totalDays: number    // 365 or 366
  progress: number     // 経過率 0-100（小数点1桁）
  simpleWeek: number   // Math.ceil(dayOfYear / 7)、1-53
  isoWeek: number      // ISO 8601 週番号
  isoYear: number      // ISO 週年（年末年始で前後の年になりうる）
  dayOfWeek: number    // 0=日〜6=土
  dayOfWeekJa: string  // '月曜日' 等
}

const DAY_OF_WEEK_JA = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'] as const

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

// ISO 8601 week number calculation
// Week 1 is the week containing the first Thursday of the year
// (equivalently, the week containing January 4)
function getISOWeek(year: number, month: number, day: number): { isoWeek: number; isoYear: number } {
  const date = new Date(year, month - 1, day)
  // Thursday of the current week
  const thursday = new Date(date)
  thursday.setDate(date.getDate() - (date.getDay() + 6) % 7 + 3)
  // Week 1 start: Monday of the week containing Jan 4
  const jan4 = new Date(thursday.getFullYear(), 0, 4)
  const week1Monday = new Date(jan4)
  week1Monday.setDate(jan4.getDate() - (jan4.getDay() + 6) % 7)
  const diffMs = thursday.getTime() - week1Monday.getTime()
  const isoWeek = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1
  return { isoWeek, isoYear: thursday.getFullYear() }
}

export function getDayOfYear(year: number, month: number, day: number): DayOfYearResult {
  const date = new Date(year, month - 1, day)
  const startOfYear = new Date(year, 0, 1)
  const diffMs = date.getTime() - startOfYear.getTime()
  const dayOfYear = Math.round(diffMs / (24 * 60 * 60 * 1000)) + 1

  const leap = isLeapYear(year)
  const totalDays = leap ? 366 : 365
  const remaining = totalDays - dayOfYear
  const progress = Math.round((dayOfYear / totalDays) * 1000) / 10

  const { isoWeek, isoYear } = getISOWeek(year, month, day)

  return {
    dayOfYear,
    remaining,
    isLeapYear: leap,
    totalDays,
    progress,
    simpleWeek: Math.ceil(dayOfYear / 7),
    isoWeek,
    isoYear,
    dayOfWeek:   date.getDay(),
    dayOfWeekJa: DAY_OF_WEEK_JA[date.getDay()],
  }
}
