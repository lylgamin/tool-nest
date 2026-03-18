export type RoundingMode = 'floor' | 'ceil' | 'round'
export type TaxRate = 0.08 | 0.10

function applyRounding(value: number, mode: RoundingMode): number {
  switch (mode) {
    case 'floor': return Math.floor(value)
    case 'ceil':  return Math.ceil(value)
    case 'round': return Math.round(value)
  }
}

/**
 * 税抜き価格から税込み価格と消費税額を計算する。
 * @param priceExcl - 税抜き価格（円）
 * @param rate      - 税率（0.10 または 0.08）
 * @param rounding  - 端数処理モード
 */
export function calcTaxIncluded(
  priceExcl: number,
  rate: TaxRate,
  rounding: RoundingMode,
): { taxAmount: number; priceIncluded: number } {
  const rawTax = priceExcl * rate
  const taxAmount = applyRounding(rawTax, rounding)
  const priceIncluded = priceExcl + taxAmount
  return { taxAmount, priceIncluded }
}

/**
 * 税込み価格から税抜き価格と消費税額を計算する。
 * @param priceIncl - 税込み価格（円）
 * @param rate      - 税率（0.10 または 0.08）
 * @param rounding  - 端数処理モード
 */
export function calcTaxExcluded(
  priceIncl: number,
  rate: TaxRate,
  rounding: RoundingMode,
): { taxAmount: number; priceExcluded: number } {
  // 浮動小数点誤差を抑えるため、整数演算に変換してから除算する
  // 例: 1100 / 1.10 → (1100 * 100) / 110 = 1000
  const multiplier = rate === 0.10 ? 110 : 108
  const base = rate === 0.10 ? 100 : 100
  const rawExcl = (priceIncl * base) / multiplier
  const priceExcluded = applyRounding(rawExcl, rounding)
  const taxAmount = priceIncl - priceExcluded
  return { taxAmount, priceExcluded }
}
