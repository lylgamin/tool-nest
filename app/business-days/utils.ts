export type BusinessDaysOptions = {
  startDate: string
  endDate: string
  excludeSaturday: boolean
  holidays: string[]
}

export type BusinessDaysResult = {
  businessDays: number
  totalDays: number
  excludedSundays: number
  excludedSaturdays: number
  excludedHolidays: number
}

export function calcBusinessDays(opts: BusinessDaysOptions): BusinessDaysResult {
  const { startDate, endDate, excludeSaturday, holidays } = opts

  if (startDate > endDate) {
    return { businessDays: 0, totalDays: 0, excludedSundays: 0, excludedSaturdays: 0, excludedHolidays: 0 }
  }

  const holidaySet = new Set(holidays)

  let totalDays = 0
  let excludedSundays = 0
  let excludedSaturdays = 0
  let excludedHolidays = 0
  let businessDays = 0

  const [sy, sm, sd] = startDate.split('-').map(Number)
  const [ey, em, ed] = endDate.split('-').map(Number)

  const start = new Date(sy, sm - 1, sd)
  const end = new Date(ey, em - 1, ed)

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    totalDays++
    const dow = d.getDay()
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    if (dow === 0) {
      excludedSundays++
      continue
    }
    if (dow === 6 && excludeSaturday) {
      excludedSaturdays++
      continue
    }
    if (holidaySet.has(dateStr) && dow !== 0 && !(dow === 6 && excludeSaturday)) {
      excludedHolidays++
      continue
    }
    businessDays++
  }

  return { businessDays, totalDays, excludedSundays, excludedSaturdays, excludedHolidays }
}

export function parseHolidayText(text: string): string[] {
  return text
    .split('\n')
    .map(l => l.trim())
    .filter(l => /^\d{4}-\d{2}-\d{2}$/.test(l))
}
