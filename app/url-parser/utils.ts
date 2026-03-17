export type ParsedUrl = {
  protocol: string
  username: string
  password: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  params: Array<{ key: string; value: string }>
}

export type ParseResult = { ok: true; parsed: ParsedUrl } | { ok: false; error: string }

export function parseUrl(input: string): ParseResult {
  const trimmed = input.trim()
  if (!trimmed) return { ok: false, error: '' }

  try {
    const url = new URL(trimmed)
    const params: Array<{ key: string; value: string }> = []
    url.searchParams.forEach((value, key) => {
      params.push({ key, value })
    })
    return {
      ok: true,
      parsed: {
        protocol: url.protocol,
        username: url.username,
        password: url.password,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        params,
      },
    }
  } catch {
    return { ok: false, error: '無効なURLです。http:// または https:// から始まるURLを入力してください' }
  }
}
