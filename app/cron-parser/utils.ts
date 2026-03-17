export type CronFields = {
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

export type ParseResult =
  | { ok: true; fields: CronFields; description: string }
  | { ok: false; error: string }

const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土']
const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

/** 各フィールドの値を日本語で説明するヘルパー */
function describeField(
  value: string,
  unit: { zero: string; every: string; at: (v: string) => string }
): string {
  if (value === '*') return unit.every
  if (/^\d+$/.test(value)) return unit.at(value)
  if (/^\*\/\d+$/.test(value)) {
    const n = value.slice(2)
    return `${n}${unit.zero}ごと`
  }
  if (/^\d+-\d+\/\d+$/.test(value)) {
    const [range, step] = value.split('/')
    return `${range}の範囲で${step}${unit.zero}ごと`
  }
  if (/^\d+-\d+$/.test(value)) {
    const [a, b] = value.split('-')
    return `${unit.at(a)}〜${unit.at(b)}`
  }
  if (value.includes(',')) {
    return value.split(',').map(v => unit.at(v.trim())).join('・')
  }
  return value
}

/** cron式の日本語説明を生成 */
function describeCron(fields: CronFields): string {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = fields

  // 毎分
  if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return '毎分実行'
  }

  // */n 分ごと（時・日・月・曜が全て *）
  if (/^\*\/\d+$/.test(minute) && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    const n = minute.slice(2)
    return `${n}分ごとに実行`
  }

  // */n 時間ごと
  if (/^\*\/\d+$/.test(hour) && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    const n = hour.slice(2)
    const minPart = minute === '*' ? '毎分' : `${minute}分`
    return `${n}時間ごとの${minPart}に実行`
  }

  // 以降は時・分の組み立て
  const minuteStr = minute === '*' ? '毎分' : `${minute}分`
  const hourStr = hour === '*' ? null : `${hour}時`

  // 曜日指定あり
  if (dayOfWeek !== '*') {
    const timePart = hourStr ? `${hourStr}${minuteStr}` : minuteStr

    // 平日 (1-5)
    if (dayOfWeek === '1-5') {
      return `平日（月〜金）の${timePart}に実行`
    }
    // 週末 (0,6 or 6,0)
    if (dayOfWeek === '0,6' || dayOfWeek === '6,0') {
      return `週末（土・日）の${timePart}に実行`
    }
    // 単一曜日
    if (/^\d$/.test(dayOfWeek)) {
      const idx = parseInt(dayOfWeek, 10)
      if (idx >= 0 && idx <= 6) {
        return `毎週${DAY_NAMES[idx]}曜日の${timePart}に実行`
      }
    }
    // その他の曜日指定
    const dowDesc = describeField(dayOfWeek, {
      zero: '曜',
      every: '毎日',
      at: (v) => {
        const i = parseInt(v, 10)
        return (i >= 0 && i <= 6) ? `${DAY_NAMES[i]}曜` : `曜日${v}`
      },
    })
    return `${dowDesc}の${timePart}に実行`
  }

  // 日付指定あり
  if (dayOfMonth !== '*') {
    const timePart = hourStr ? `${hourStr}${minuteStr}` : minuteStr
    if (/^\d+$/.test(dayOfMonth)) {
      return `毎月${dayOfMonth}日の${timePart}に実行`
    }
    const domDesc = describeField(dayOfMonth, {
      zero: '日',
      every: '毎日',
      at: (v) => `${v}日`,
    })
    return `毎月${domDesc}の${timePart}に実行`
  }

  // 月指定あり
  if (month !== '*') {
    const timePart = hourStr ? `${hourStr}${minuteStr}` : minuteStr
    if (/^\d+$/.test(month)) {
      const idx = parseInt(month, 10)
      const mName = idx >= 1 && idx <= 12 ? MONTH_NAMES[idx - 1] : `${month}月`
      return `毎年${mName}の${timePart}に実行`
    }
    const monthDesc = describeField(month, {
      zero: '月',
      every: '毎月',
      at: (v) => {
        const i = parseInt(v, 10)
        return (i >= 1 && i <= 12) ? MONTH_NAMES[i - 1] : `${v}月`
      },
    })
    return `${monthDesc}の${timePart}に実行`
  }

  // 時・分のみ
  if (hourStr) {
    if (minute === '0') {
      return `毎日${hour}時0分に実行`
    }
    return `毎日${hourStr}${minuteStr}に実行`
  }

  // 毎時 n 分
  if (hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    if (/^\d+$/.test(minute)) {
      return `毎時${minute}分に実行`
    }
  }

  // フォールバック: フィールドを列挙
  const parts: string[] = []
  if (minute !== '*') parts.push(`分:${minute}`)
  if (hour !== '*') parts.push(`時:${hour}`)
  if (dayOfMonth !== '*') parts.push(`日:${dayOfMonth}`)
  if (month !== '*') parts.push(`月:${month}`)
  if (dayOfWeek !== '*') parts.push(`曜:${dayOfWeek}`)
  return parts.join('、') + ' に実行'
}

/** cron式をパースして各フィールドと日本語説明を返す */
export function parseCron(expr: string): ParseResult {
  const trimmed = expr.trim()
  if (!trimmed) {
    return { ok: false, error: 'cron式を入力してください' }
  }

  const parts = trimmed.split(/\s+/)
  if (parts.length !== 5) {
    return { ok: false, error: `フィールド数が不正です（${parts.length}個）。5フィールド（分 時 日 月 曜日）が必要です` }
  }

  const validChars = /^[*0-9,\-/]+$/
  const fieldNames = ['分', '時', '日', '月', '曜日']
  for (let i = 0; i < parts.length; i++) {
    if (!validChars.test(parts[i])) {
      return { ok: false, error: `${fieldNames[i]}フィールドに無効な文字が含まれています: "${parts[i]}"` }
    }
  }

  const fields: CronFields = {
    minute: parts[0],
    hour: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4],
  }

  const description = describeCron(fields)
  return { ok: true, fields, description }
}

/** フィールド値に対して指定した数値がマッチするか判定 */
function matchesField(value: string, num: number): boolean {
  if (value === '*') return true

  // カンマ区切りリスト
  if (value.includes(',')) {
    return value.split(',').some(part => matchesField(part.trim(), num))
  }

  // */n ステップ
  if (/^\*\/(\d+)$/.test(value)) {
    const n = parseInt(value.slice(2), 10)
    return n > 0 && num % n === 0
  }

  // a-b/n 範囲内ステップ
  const rangeStep = value.match(/^(\d+)-(\d+)\/(\d+)$/)
  if (rangeStep) {
    const a = parseInt(rangeStep[1], 10)
    const b = parseInt(rangeStep[2], 10)
    const n = parseInt(rangeStep[3], 10)
    if (num < a || num > b) return false
    return n > 0 && (num - a) % n === 0
  }

  // a-b 範囲
  const range = value.match(/^(\d+)-(\d+)$/)
  if (range) {
    const a = parseInt(range[1], 10)
    const b = parseInt(range[2], 10)
    return num >= a && num <= b
  }

  // 数値完全一致
  if (/^\d+$/.test(value)) {
    return parseInt(value, 10) === num
  }

  return false
}

/** 次のN回の実行時刻を返す（fromDate から） */
export function getNextExecutions(fields: CronFields, count: number, from?: Date): Date[] {
  const start = from ? new Date(from) : new Date()
  // from の1分後から検索開始
  start.setSeconds(0, 0)
  start.setMinutes(start.getMinutes() + 1)

  const results: Date[] = []
  const MAX_ITERATIONS = 500_000

  const cur = new Date(start)

  for (let i = 0; i < MAX_ITERATIONS && results.length < count; i++) {
    const min = cur.getMinutes()
    const hr = cur.getHours()
    const dom = cur.getDate()
    const mon = cur.getMonth() + 1 // 1-12
    const dow = cur.getDay()       // 0=日, 6=土

    if (
      matchesField(fields.minute, min) &&
      matchesField(fields.hour, hr) &&
      matchesField(fields.dayOfMonth, dom) &&
      matchesField(fields.month, mon) &&
      matchesField(fields.dayOfWeek, dow)
    ) {
      results.push(new Date(cur))
    }

    cur.setMinutes(cur.getMinutes() + 1)
  }

  return results
}
