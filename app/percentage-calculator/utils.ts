/**
 * A: value は total の何 % か
 * 例: 25 は 200 の何%? → 12.5
 */
export function calcWhatPercent(value: number, total: number): number | null {
  if (!isFinite(value) || !isFinite(total)) return null
  if (total === 0) return null
  const result = (value / total) * 100
  return isFinite(result) ? result : null
}

/**
 * B: total の n% はいくつか
 * 例: 200 の 12.5% は? → 25
 */
export function calcPercentOf(percent: number, total: number): number | null {
  if (!isFinite(percent) || !isFinite(total)) return null
  const result = (percent / 100) * total
  return isFinite(result) ? result : null
}

/**
 * C: from から to への増減率（%）
 * 例: 100 から 120 に変化 → +20%
 */
export function calcPercentChange(from: number, to: number): number | null {
  if (!isFinite(from) || !isFinite(to)) return null
  if (from === 0) return null
  const result = ((to - from) / Math.abs(from)) * 100
  return isFinite(result) ? result : null
}

/**
 * D: value が全体の n% のとき、全体はいくつか（逆算）
 * 例: 25 が 12.5% なら全体は? → 200
 */
export function calcTotal(value: number, percent: number): number | null {
  if (!isFinite(value) || !isFinite(percent)) return null
  if (percent === 0) return null
  const result = (value / percent) * 100
  return isFinite(result) ? result : null
}

/** 数値を見やすい文字列にフォーマット（最大10桁の有効数字） */
export function fmtNumber(n: number): string {
  if (!isFinite(n)) return '—'
  // 整数なら整数表示
  if (Number.isInteger(n)) return n.toLocaleString('ja-JP')
  // 小数点以下は最大10桁で丸める
  const rounded = parseFloat(n.toPrecision(10))
  return rounded.toLocaleString('ja-JP', { maximumFractionDigits: 10 })
}
