// Base64エンコード：日本語を含むUTF-8文字列に対応
// TextEncoder → Uint8Array → binary string → btoa
export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input)
  const binary = String.fromCharCode(...bytes)
  return btoa(binary)
}

// Base64デコード：日本語対応
// atob → binary string → Uint8Array → TextDecoder
export type DecodeResult =
  | { ok: true; output: string }
  | { ok: false; error: string }

export function decodeBase64(input: string): DecodeResult {
  try {
    const binary = atob(input)
    const bytes = new Uint8Array([...binary].map(c => c.charCodeAt(0)))
    const output = new TextDecoder().decode(bytes)
    return { ok: true, output }
  } catch {
    return { ok: false, error: '無効なBase64文字列です。入力を確認してください。' }
  }
}

// URL-safe Base64エンコード
// + → -、/ → _、末尾パディング（=）除去
export function encodeBase64UrlSafe(input: string): string {
  return encodeBase64(input)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// Base64文字列として有効かチェック
export function isValidBase64(input: string): boolean {
  if (input.length === 0) return false
  // 標準Base64: A-Z a-z 0-9 + / = のみ、パディングも正しい形式
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(input)) return false
  // 長さは4の倍数でなければならない
  if (input.length % 4 !== 0) return false
  return true
}
