export type MatchResult = {
  match: string
  index: number
  groups: (string | undefined)[]
}

export type RegexTestResult =
  | { ok: true; matches: MatchResult[]; totalCount: number }
  | { ok: false; error: string }

export function testRegex(pattern: string, flags: string, input: string): RegexTestResult {
  if (!pattern) return { ok: true, matches: [], totalCount: 0 }
  try {
    const regex = new RegExp(pattern, flags)
    const matches: MatchResult[] = []
    if (flags.includes('g')) {
      let m: RegExpExecArray | null
      while ((m = regex.exec(input)) !== null) {
        matches.push({ match: m[0], index: m.index, groups: [...m].slice(1) })
        if (m[0].length === 0) regex.lastIndex++
      }
    } else {
      const m = regex.exec(input)
      if (m) matches.push({ match: m[0], index: m.index, groups: [...m].slice(1) })
    }
    return { ok: true, matches, totalCount: matches.length }
  } catch (e) {
    return { ok: false, error: `正規表現エラー: ${(e as Error).message}` }
  }
}
