export type Result<T> = { ok: true; output: T } | { ok: false; error: string }
export type Lang = 'js' | 'json' | 'python' | 'sql'

export function escapeString(input: string, lang: Lang): string {
  switch (lang) {
    case 'js':
      return input
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
    case 'json':
      return JSON.stringify(input).slice(1, -1) // 外側の " を除く
    case 'python':
      return input
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
    case 'sql':
      return input.replace(/'/g, "''")
  }
}

export function unescapeString(input: string, lang: Lang): Result<string> {
  try {
    switch (lang) {
      case 'js':
      case 'json': {
        // JSON.parse で安全にアンエスケープ
        const parsed = JSON.parse('"' + input + '"')
        return { ok: true, output: parsed }
      }
      case 'python': {
        const result = input
          .replace(/\\\\/g, '\x00')
          .replace(/\\'/g, "'")
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\x00/g, '\\')
        return { ok: true, output: result }
      }
      case 'sql': {
        return { ok: true, output: input.replace(/''/g, "'") }
      }
    }
  } catch {
    return { ok: false, error: 'アンエスケープに失敗しました。入力形式を確認してください。' }
  }
}
