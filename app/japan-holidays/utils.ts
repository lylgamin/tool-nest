export type Holiday = { date: string; name: string }

function nthMonday(year: number, month: number, n: number): string {
  let count = 0
  for (let d = 1; d <= 31; d++) {
    const date = new Date(year, month - 1, d)
    if (date.getMonth() !== month - 1) break
    if (date.getDay() === 1) {
      count++
      if (count === n) {
        return `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      }
    }
  }
  return ''
}

function dateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function dayOfWeek(dateString: string): number {
  const [y, m, d] = dateString.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}

function addDays(dateString: string, n: number): string {
  const [y, m, d] = dateString.split('-').map(Number)
  const date = new Date(y, m - 1, d + n)
  return dateStr(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function getHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = []

  const add = (date: string, name: string) => {
    if (date) holidays.push({ date, name })
  }

  // 固定祝日
  add(dateStr(year, 1, 1), '元日')
  add(dateStr(year, 2, 11), '建国記念の日')
  add(dateStr(year, 2, 23), '天皇誕生日')
  add(dateStr(year, 3, 21), '春分の日')
  add(dateStr(year, 4, 29), '昭和の日')
  add(dateStr(year, 5, 3), '憲法記念日')
  add(dateStr(year, 5, 4), 'みどりの日')
  add(dateStr(year, 5, 5), 'こどもの日')
  add(dateStr(year, 8, 11), '山の日')
  add(dateStr(year, 9, 23), '秋分の日')
  add(dateStr(year, 11, 3), '文化の日')
  add(dateStr(year, 11, 23), '勤労感謝の日')

  // ハッピーマンデー
  add(nthMonday(year, 1, 2), '成人の日')
  add(nthMonday(year, 7, 3), '海の日')
  add(nthMonday(year, 9, 3), '敬老の日')
  add(nthMonday(year, 10, 2), 'スポーツの日')

  // ソート（振替・国民の祝日計算のため）
  holidays.sort((a, b) => a.date.localeCompare(b.date))

  const holidaySet = new Set(holidays.map(h => h.date))

  // 国民の祝日（前後両日が祝日の平日）
  const sorted = [...holidays]
  const kokuminNoShukujitsu: Holiday[] = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const prev = sorted[i].date
    const next = sorted[i + 1].date
    const between = addDays(prev, 1)
    if (between === addDays(next, -1) && !holidaySet.has(between)) {
      const dow = dayOfWeek(between)
      if (dow !== 0 && dow !== 6) {
        kokuminNoShukujitsu.push({ date: between, name: '国民の祝日' })
        holidaySet.add(between)
      }
    }
  }
  holidays.push(...kokuminNoShukujitsu)
  holidays.sort((a, b) => a.date.localeCompare(b.date))

  // 振替休日（祝日が日曜→翌月曜、その月曜も祝日なら翌日に繰り越し）
  const furikae: Holiday[] = []
  const allDates = new Set(holidays.map(h => h.date))
  for (const h of [...holidays]) {
    if (dayOfWeek(h.date) === 0) {
      let candidate = addDays(h.date, 1)
      while (allDates.has(candidate)) {
        candidate = addDays(candidate, 1)
      }
      furikae.push({ date: candidate, name: '振替休日' })
      allDates.add(candidate)
    }
  }
  holidays.push(...furikae)
  holidays.sort((a, b) => a.date.localeCompare(b.date))

  return holidays
}

export function holidaysToText(holidays: Holiday[]): string {
  return holidays.map(h => h.date).join('\n')
}
