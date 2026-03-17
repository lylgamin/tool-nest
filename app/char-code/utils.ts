export interface CharInfo {
  char: string
  codePoint: number       // Unicodeコードポイント（10進）
  codePointHex: string    // U+XXXX 形式
  utf8Bytes: string       // 例: "E3 81 82" (スペース区切り16進)
  utf16le: string         // 例: "42 30" (スペース区切り16進、2バイト単位)
  htmlEntity: string      // 例: "&#12354;" または "&amp;" などnamed entity
  htmlEntityHex: string   // 例: "&#x3042;"
  category: string        // Unicode一般カテゴリ（大まかに）
}

// Named HTML entity マッピング（文字 → エンティティ名）
const NAMED_ENTITIES: Record<string, string> = {
  '&':  '&amp;',
  '<':  '&lt;',
  '>':  '&gt;',
  '"':  '&quot;',
  "'":  '&apos;',
  '©':  '&copy;',
  '®':  '&reg;',
  '™':  '&trade;',
  '€':  '&euro;',
  '¥':  '&yen;',
  '£':  '&pound;',
  '¢':  '&cent;',
  '°':  '&deg;',
  '±':  '&plusmn;',
  '×':  '&times;',
  '÷':  '&divide;',
  '\u00A0': '&nbsp;',
}

// コードポイントを U+XXXX 形式に変換（最低4桁）
function toHexCodePoint(cp: number): string {
  const hex = cp.toString(16).toUpperCase()
  return 'U+' + hex.padStart(4, '0')
}

// 文字をUTF-8バイト列に変換してスペース区切り16進文字列を返す
function toUtf8Bytes(char: string): string {
  const bytes = new TextEncoder().encode(char)
  return Array.from(bytes)
    .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
    .join(' ')
}

// 文字をUTF-16LE バイト列に変換（2バイト単位、スペース区切り16進）
// サロゲートペアの場合は4バイト（2ユニット分）を出力
function toUtf16LE(char: string): string {
  const codeUnits: string[] = []
  for (let i = 0; i < char.length; i++) {
    const unit = char.charCodeAt(i)
    const lo = unit & 0xff
    const hi = (unit >> 8) & 0xff
    codeUnits.push(
      lo.toString(16).toUpperCase().padStart(2, '0') +
      ' ' +
      hi.toString(16).toUpperCase().padStart(2, '0')
    )
  }
  return codeUnits.join(' ')
}

// Unicodeカテゴリを大まかに判定
function getCategory(cp: number): string {
  if (cp < 0x20 || (cp >= 0x7f && cp <= 0x9f)) return 'Control'
  if (cp === 0x20 || cp === 0x00A0) return 'Space'
  // ASCII letters
  if ((cp >= 0x41 && cp <= 0x5a) || (cp >= 0x61 && cp <= 0x7a)) return 'Letter'
  // ASCII digits
  if (cp >= 0x30 && cp <= 0x39) return 'Number'
  // ASCII punctuation/symbol
  if (cp >= 0x21 && cp <= 0x7e) return 'Symbol'
  // Latin extended / Greek / Cyrillic / Hebrew / Arabic / CJK etc.
  // Broad category detection by ranges
  if (
    (cp >= 0x00c0 && cp <= 0x024f) || // Latin Extended
    (cp >= 0x0370 && cp <= 0x03ff) || // Greek
    (cp >= 0x0400 && cp <= 0x04ff) || // Cyrillic
    (cp >= 0x0590 && cp <= 0x05ff) || // Hebrew
    (cp >= 0x0600 && cp <= 0x06ff) || // Arabic
    (cp >= 0x3040 && cp <= 0x309f) || // Hiragana
    (cp >= 0x30a0 && cp <= 0x30ff) || // Katakana
    (cp >= 0x4e00 && cp <= 0x9fff) || // CJK Unified Ideographs
    (cp >= 0xac00 && cp <= 0xd7af) || // Hangul
    (cp >= 0x1f00 && cp <= 0x1fff) || // Greek Extended / Phonetic Ext
    (cp >= 0xa000 && cp <= 0xa48f)    // Yi Syllables
  ) return 'Letter'
  if (
    (cp >= 0x0660 && cp <= 0x0669) || // Arabic-Indic digits
    (cp >= 0x06f0 && cp <= 0x06f9) || // Extended Arabic-Indic digits
    (cp >= 0xff10 && cp <= 0xff19) || // Fullwidth digits
    (cp >= 0x0030 && cp <= 0x0039)    // ASCII digits (already handled above)
  ) return 'Number'
  if (
    (cp >= 0x2000 && cp <= 0x206f) || // General Punctuation
    (cp >= 0x2100 && cp <= 0x214f) || // Letterlike Symbols
    (cp >= 0x2200 && cp <= 0x22ff) || // Mathematical Operators
    (cp >= 0x2300 && cp <= 0x23ff) || // Misc Technical
    (cp >= 0x25a0 && cp <= 0x25ff) || // Geometric Shapes
    (cp >= 0x2600 && cp <= 0x26ff) || // Misc Symbols
    (cp >= 0x2700 && cp <= 0x27bf) || // Dingbats
    (cp >= 0x1f300 && cp <= 0x1faff)  // Emoji / Misc Symbols Extended
  ) return 'Symbol'
  if (cp >= 0xd800 && cp <= 0xdfff) return 'Surrogate'
  if (cp >= 0xe000 && cp <= 0xf8ff) return 'Private'
  if (cp >= 0xfff0 && cp <= 0xffff) return 'Special'
  return 'Other'
}

// HTML実体参照を返す（named entityがあればそれを、なければ十進数）
function toHtmlEntity(char: string, cp: number): string {
  if (NAMED_ENTITIES[char]) return NAMED_ENTITIES[char]
  // ASCII printable の一般文字はそのまま（エスケープ不要）
  if (cp >= 0x21 && cp <= 0x7e) return char
  return `&#${cp};`
}

// HTML実体参照（16進）
function toHtmlEntityHex(char: string, cp: number): string {
  if (NAMED_ENTITIES[char]) return NAMED_ENTITIES[char]
  if (cp >= 0x21 && cp <= 0x7e) return char
  return `&#x${cp.toString(16).toUpperCase()};`
}

// 文字列の各文字の CharInfo を返す（最大20文字）
export function analyzeString(input: string): CharInfo[] {
  const result: CharInfo[] = []
  // イテレートはコードポイント単位で（サロゲートペア対応）
  const chars = [...input].slice(0, 20)
  for (const char of chars) {
    const cp = char.codePointAt(0) ?? 0
    result.push({
      char,
      codePoint: cp,
      codePointHex: toHexCodePoint(cp),
      utf8Bytes: toUtf8Bytes(char),
      utf16le: toUtf16LE(char),
      htmlEntity: toHtmlEntity(char, cp),
      htmlEntityHex: toHtmlEntityHex(char, cp),
      category: getCategory(cp),
    })
  }
  return result
}

// コードポイント（数値）から文字に変換
export function codePointToChar(codePoint: number): string | null {
  if (codePoint < 0 || codePoint > 0x10ffff) return null
  // サロゲート領域は文字として存在しない
  if (codePoint >= 0xd800 && codePoint <= 0xdfff) return null
  try {
    return String.fromCodePoint(codePoint)
  } catch {
    return null
  }
}

// U+XXXX 形式・10進数・0x16進数からコードポイントを解析
export function parseCodePoint(input: string): number | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  // U+XXXX または U+XXXXXX
  const uPlusMatch = trimmed.match(/^[Uu]\+([0-9A-Fa-f]{1,6})$/)
  if (uPlusMatch) {
    const cp = parseInt(uPlusMatch[1], 16)
    return isNaN(cp) ? null : cp
  }

  // 0x16進数
  const hexMatch = trimmed.match(/^0[Xx]([0-9A-Fa-f]+)$/)
  if (hexMatch) {
    const cp = parseInt(hexMatch[1], 16)
    return isNaN(cp) ? null : cp
  }

  // 純粋な16進数（4桁以上でA-Fを含む場合）
  const pureHexMatch = trimmed.match(/^([0-9A-Fa-f]+)$/)
  if (pureHexMatch && /[A-Fa-f]/.test(trimmed)) {
    const cp = parseInt(trimmed, 16)
    return isNaN(cp) ? null : cp
  }

  // 10進数
  const decMatch = trimmed.match(/^\d+$/)
  if (decMatch) {
    const cp = parseInt(trimmed, 10)
    return isNaN(cp) ? null : cp
  }

  return null
}
