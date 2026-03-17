export type DecodeResult = { ok: true; output: string } | { ok: false; error: string }

export function encodeUrlComponent(input: string): string {
  return encodeURIComponent(input)
}

export function decodeUrlComponent(input: string): DecodeResult {
  try {
    return { ok: true, output: decodeURIComponent(input) }
  } catch (e) {
    return { ok: false, error: `デコードエラー: ${(e as Error).message}` }
  }
}

export function isValidUrlEncoded(input: string): boolean {
  return !/%(?![0-9A-Fa-f]{2})/.test(input)
}
