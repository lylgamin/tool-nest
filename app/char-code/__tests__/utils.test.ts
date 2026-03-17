import { describe, it, expect } from 'vitest'
import { analyzeString, parseCodePoint, codePointToChar } from '../utils'

describe('analyzeString', () => {
  it("'A' のコードポイントは65", () => {
    const result = analyzeString('A')
    expect(result).toHaveLength(1)
    expect(result[0].codePoint).toBe(65)
  })

  it("'A' のコードポイント16進は U+0041", () => {
    const result = analyzeString('A')
    expect(result[0].codePointHex).toBe('U+0041')
  })

  it("'A' のUTF-8バイト列は '41'", () => {
    const result = analyzeString('A')
    expect(result[0].utf8Bytes).toBe('41')
  })

  it("'あ' のコードポイントは12354", () => {
    const result = analyzeString('あ')
    expect(result[0].codePoint).toBe(12354)
  })

  it("'あ' のコードポイント16進は U+3042", () => {
    const result = analyzeString('あ')
    expect(result[0].codePointHex).toBe('U+3042')
  })

  it("'あ' のUTF-8バイト列は 'E3 81 82'", () => {
    const result = analyzeString('あ')
    expect(result[0].utf8Bytes).toBe('E3 81 82')
  })

  it("'&' の HTML実体参照は '&amp;'", () => {
    const result = analyzeString('&')
    expect(result[0].htmlEntity).toBe('&amp;')
  })

  it("'<' の HTML実体参照は '&lt;'", () => {
    const result = analyzeString('<')
    expect(result[0].htmlEntity).toBe('&lt;')
  })

  it("'©' の HTML実体参照は '&copy;'", () => {
    const result = analyzeString('©')
    expect(result[0].htmlEntity).toBe('&copy;')
  })

  it("'€' の HTML実体参照は '&euro;'", () => {
    const result = analyzeString('€')
    expect(result[0].htmlEntity).toBe('&euro;')
  })

  it('20文字を超える入力は20文字に切り詰める', () => {
    const input = 'A'.repeat(25)
    const result = analyzeString(input)
    expect(result).toHaveLength(20)
  })

  it('空文字列は空配列を返す', () => {
    expect(analyzeString('')).toHaveLength(0)
  })

  it('絵文字（サロゲートペア）を1文字として扱う', () => {
    // U+1F600 GRINNING FACE — JSでは2コードユニット（\uD83D\uDE00）
    const result = analyzeString('😀')
    expect(result).toHaveLength(1)
    expect(result[0].codePoint).toBe(0x1f600)
    expect(result[0].codePointHex).toBe('U+1F600')
  })

  it("'A' のUTF-16LEは '41 00'", () => {
    const result = analyzeString('A')
    expect(result[0].utf16le).toBe('41 00')
  })

  it("'あ' のHTML16進実体参照は '&#x3042;'", () => {
    const result = analyzeString('あ')
    expect(result[0].htmlEntityHex).toBe('&#x3042;')
  })
})

describe('parseCodePoint', () => {
  it("'U+0041' => 65", () => {
    expect(parseCodePoint('U+0041')).toBe(65)
  })

  it("'u+0041' => 65 (小文字も対応)", () => {
    expect(parseCodePoint('u+0041')).toBe(65)
  })

  it("'65' => 65 (10進数)", () => {
    expect(parseCodePoint('65')).toBe(65)
  })

  it("'0x41' => 65 (0x16進数)", () => {
    expect(parseCodePoint('0x41')).toBe(65)
  })

  it("'0X41' => 65 (0X16進数 大文字も対応)", () => {
    expect(parseCodePoint('0X41')).toBe(65)
  })

  it("'U+3042' => 12354", () => {
    expect(parseCodePoint('U+3042')).toBe(12354)
  })

  it("'12354' => 12354", () => {
    expect(parseCodePoint('12354')).toBe(12354)
  })

  it('空文字列は null を返す', () => {
    expect(parseCodePoint('')).toBeNull()
  })

  it('無効な文字列は null を返す', () => {
    expect(parseCodePoint('xyz')).toBeNull()
  })

  it('前後の空白は無視する', () => {
    expect(parseCodePoint('  U+0041  ')).toBe(65)
  })
})

describe('codePointToChar', () => {
  it('65 => "A"', () => {
    expect(codePointToChar(65)).toBe('A')
  })

  it('12354 => "あ"', () => {
    expect(codePointToChar(12354)).toBe('あ')
  })

  it('0x1F600 => "😀"', () => {
    expect(codePointToChar(0x1f600)).toBe('😀')
  })

  it('負の数は null を返す', () => {
    expect(codePointToChar(-1)).toBeNull()
  })

  it('0x110000 (範囲外) は null を返す', () => {
    expect(codePointToChar(0x110000)).toBeNull()
  })

  it('サロゲート領域 (0xD800) は null を返す', () => {
    expect(codePointToChar(0xd800)).toBeNull()
  })
})
