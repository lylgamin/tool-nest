export type Base = 2 | 8 | 10 | 16

export type ConvertResult =
  | { ok: true; bin: string; oct: string; dec: string; hex: string }
  | { ok: false; error: string }

export function convertBase(value: string, fromBase: Base): ConvertResult {
  const trimmed = value.trim()
  if (!trimmed) return { ok: false, error: '' }

  const validChars: Record<Base, RegExp> = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9a-fA-F]+$/,
  }
  if (!validChars[fromBase].test(trimmed)) {
    return { ok: false, error: `${fromBase}進数として無効な文字が含まれています` }
  }

  const decimal = parseInt(trimmed, fromBase)
  if (!Number.isSafeInteger(decimal)) {
    return { ok: false, error: '数値が大きすぎます（2^53-1 を超えています）' }
  }

  return {
    ok: true,
    bin: decimal.toString(2),
    oct: decimal.toString(8),
    dec: decimal.toString(10),
    hex: decimal.toString(16).toUpperCase(),
  }
}
