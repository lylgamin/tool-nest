export type StrengthLevel = 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong'

export interface PasswordAnalysis {
  length: number
  hasLower: boolean      // 小文字を含む
  hasUpper: boolean      // 大文字を含む
  hasDigit: boolean      // 数字を含む
  hasSymbol: boolean     // 記号を含む
  hasJapanese: boolean   // 日本語文字を含む
  charsetSize: number    // 文字集合のサイズ（エントロピー計算用）
  entropy: number        // エントロピー (bits): log2(charsetSize) * length
  score: number          // 0-100
  level: StrengthLevel
  levelLabel: string     // 日本語ラベル
  suggestions: string[]  // 改善提案（最大3つ）
  crackTime: string      // 解読時間の目安（日本語）
}

// 日本語文字（ひらがな・カタカナ・CJK統合漢字）の判定
function isJapanese(ch: string): boolean {
  const code = ch.codePointAt(0) ?? 0
  return (
    (code >= 0x3040 && code <= 0x309f) || // ひらがな
    (code >= 0x30a0 && code <= 0x30ff) || // カタカナ
    (code >= 0x4e00 && code <= 0x9fff)    // CJK統合漢字
  )
}

function calcCharsetSize(
  hasLower: boolean,
  hasUpper: boolean,
  hasDigit: boolean,
  hasSymbol: boolean,
  hasJapanese: boolean,
): number {
  let size = 0
  if (hasLower)    size += 26
  if (hasUpper)    size += 26
  if (hasDigit)    size += 10
  if (hasSymbol)   size += 32
  if (hasJapanese) size += 4000
  return size
}

// エントロピー基準の 0-100 スコアに正規化
// entropy 0→0, 28→25, 36→50, 60→75, 80→100
function calcScore(entropy: number): number {
  if (entropy <= 0)  return 0
  if (entropy < 28)  return Math.round((entropy / 28) * 25)
  if (entropy < 36)  return Math.round(25 + ((entropy - 28) / (36 - 28)) * 25)
  if (entropy < 60)  return Math.round(50 + ((entropy - 36) / (60 - 36)) * 25)
  if (entropy < 80)  return Math.round(75 + ((entropy - 60) / (80 - 60)) * 25)
  return 100
}

function calcCrackTime(entropy: number): string {
  if (entropy < 28) return '即時〜数秒'
  if (entropy < 36) return '数分〜数時間'
  if (entropy < 60) return '数年'
  if (entropy < 80) return '数百年'
  return '数百万年以上'
}

function levelLabel(level: StrengthLevel): string {
  switch (level) {
    case 'very-weak':   return '非常に弱い'
    case 'weak':        return '弱い'
    case 'fair':        return 'まあまあ'
    case 'strong':      return '強い'
    case 'very-strong': return '非常に強い'
  }
}

function calcLevel(entropy: number): StrengthLevel {
  if (entropy < 28) return 'very-weak'
  if (entropy < 36) return 'weak'
  if (entropy < 60) return 'fair'
  if (entropy < 80) return 'strong'
  return 'very-strong'
}

function buildSuggestions(
  password: string,
  hasLower: boolean,
  hasUpper: boolean,
  hasDigit: boolean,
  hasSymbol: boolean,
): string[] {
  const suggestions: string[] = []

  if (password.length < 12) {
    suggestions.push('12文字以上にすることで強度が大幅に向上します')
  }
  if (!hasUpper) {
    suggestions.push('大文字（A-Z）を追加すると文字集合が広がります')
  }
  if (!hasDigit) {
    suggestions.push('数字（0-9）を追加するとエントロピーが増加します')
  }
  if (!hasSymbol && suggestions.length < 3) {
    suggestions.push('記号（!@#$など）を加えると解読難度が飛躍的に上がります')
  }
  if (!hasLower && suggestions.length < 3) {
    suggestions.push('小文字（a-z）を追加すると文字集合が広がります')
  }

  return suggestions.slice(0, 3)
}

export function analyzePassword(password: string): PasswordAnalysis {
  const length = password.length

  if (length === 0) {
    return {
      length: 0,
      hasLower: false,
      hasUpper: false,
      hasDigit: false,
      hasSymbol: false,
      hasJapanese: false,
      charsetSize: 0,
      entropy: 0,
      score: 0,
      level: 'very-weak',
      levelLabel: '非常に弱い',
      suggestions: ['パスワードを入力してください'],
      crackTime: '—',
    }
  }

  let hasLower    = false
  let hasUpper    = false
  let hasDigit    = false
  let hasSymbol   = false
  let hasJapanese = false

  for (const ch of password) {
    if (/[a-z]/.test(ch))       hasLower    = true
    else if (/[A-Z]/.test(ch))  hasUpper    = true
    else if (/[0-9]/.test(ch))  hasDigit    = true
    else if (isJapanese(ch))    hasJapanese = true
    else                        hasSymbol   = true
  }

  const charsetSize = calcCharsetSize(hasLower, hasUpper, hasDigit, hasSymbol, hasJapanese)
  const entropy = charsetSize > 0 ? Math.log2(charsetSize) * length : 0
  const score   = calcScore(entropy)
  const level   = calcLevel(entropy)

  return {
    length,
    hasLower,
    hasUpper,
    hasDigit,
    hasSymbol,
    hasJapanese,
    charsetSize,
    entropy,
    score,
    level,
    levelLabel: levelLabel(level),
    suggestions: buildSuggestions(password, hasLower, hasUpper, hasDigit, hasSymbol),
    crackTime: calcCrackTime(entropy),
  }
}
