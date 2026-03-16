export type FormatResult = { ok: true; output: string } | { ok: false; error: string }

export function formatJson(input: string, indent: number = 2): FormatResult {
  try {
    const parsed = JSON.parse(input)
    return { ok: true, output: JSON.stringify(parsed, null, indent) }
  } catch (e) {
    const msg = e instanceof SyntaxError ? e.message : String(e)
    return { ok: false, error: `JSONの解析に失敗しました: ${msg}` }
  }
}

export function minifyJson(input: string): FormatResult {
  try {
    const parsed = JSON.parse(input)
    return { ok: true, output: JSON.stringify(parsed) }
  } catch (e) {
    const msg = e instanceof SyntaxError ? e.message : String(e)
    return { ok: false, error: `JSONの解析に失敗しました: ${msg}` }
  }
}

export function validateJson(input: string): { valid: boolean; error?: string } {
  if (input.trim() === '') {
    return { valid: false, error: '入力が空です' }
  }
  try {
    JSON.parse(input)
    return { valid: true }
  } catch (e) {
    const msg = e instanceof SyntaxError ? e.message : String(e)
    return { valid: false, error: msg }
  }
}
