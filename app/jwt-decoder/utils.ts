export type JwtPayload = Record<string, unknown>

export type JwtDecodeResult =
  | {
      ok: true
      header: JwtPayload
      payload: JwtPayload
      signature: string
      raw: { header: string; payload: string; signature: string }
    }
  | { ok: false; error: string }

// base64urlデコード（パディング補完 + URLセーフ文字置換）
export function base64UrlDecode(str: string): string {
  const padded = str + '=='.slice(0, (4 - (str.length % 4)) % 4)
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/')
  return atob(base64)
}

// JWTをデコード（署名検証なし）
export function decodeJwt(token: string): JwtDecodeResult {
  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    return {
      ok: false,
      error: 'JWTは3つのパート（ヘッダー.ペイロード.署名）で構成される必要があります',
    }
  }
  try {
    const header = JSON.parse(base64UrlDecode(parts[0])) as JwtPayload
    const payload = JSON.parse(base64UrlDecode(parts[1])) as JwtPayload
    return {
      ok: true,
      header,
      payload,
      signature: parts[2],
      raw: { header: parts[0], payload: parts[1], signature: parts[2] },
    }
  } catch {
    return { ok: false, error: 'JWTのデコードに失敗しました。トークンが正しい形式か確認してください。' }
  }
}

// exp クレームを人間が読める形式に変換
export function formatExpiry(exp: unknown): string {
  if (typeof exp !== 'number') return '不明'
  const date = new Date(exp * 1000)
  const formatted = date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
  const expired = date.getTime() < Date.now()
  return `${formatted}（${expired ? '期限切れ' : '有効'}）`
}
