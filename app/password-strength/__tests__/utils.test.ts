import { describe, it, expect } from 'vitest'
import { analyzePassword } from '../utils'

describe('analyzePassword - 空文字', () => {
  it('空文字は length=0, score=0, level=very-weak を返す', () => {
    const result = analyzePassword('')
    expect(result.length).toBe(0)
    expect(result.score).toBe(0)
    expect(result.level).toBe('very-weak')
  })
})

describe('analyzePassword - 小文字のみ', () => {
  it('"password" は hasLower=true, hasUpper=false, hasDigit=false', () => {
    const result = analyzePassword('password')
    expect(result.hasLower).toBe(true)
    expect(result.hasUpper).toBe(false)
    expect(result.hasDigit).toBe(false)
    expect(result.hasSymbol).toBe(false)
  })

  it('"password" の charsetSize は26（小文字のみ）', () => {
    const result = analyzePassword('password')
    expect(result.charsetSize).toBe(26)
  })
})

describe('analyzePassword - 強いパスワード', () => {
  it('"P@ssw0rd123!SecureKey2024" は strong または very-strong', () => {
    const result = analyzePassword('P@ssw0rd123!SecureKey2024')
    expect(['strong', 'very-strong']).toContain(result.level)
  })

  it('強いパスワードの score は 75 以上', () => {
    const result = analyzePassword('P@ssw0rd123!SecureKey2024')
    expect(result.score).toBeGreaterThanOrEqual(75)
  })
})

describe('analyzePassword - 日本語', () => {
  it('"あいうえお" は hasJapanese=true', () => {
    const result = analyzePassword('あいうえお')
    expect(result.hasJapanese).toBe(true)
  })

  it('"あいうえお" の charsetSize には4000が含まれる', () => {
    const result = analyzePassword('あいうえお')
    expect(result.charsetSize).toBeGreaterThanOrEqual(4000)
  })
})

describe('analyzePassword - エントロピー計算', () => {
  it('"A" のエントロピーは log2(26) * 1 ≈ 4.7', () => {
    const result = analyzePassword('A')
    // hasUpper=true のみ → charsetSize=26, entropy = log2(26) * 1
    const expected = Math.log2(26)
    expect(result.entropy).toBeCloseTo(expected, 5)
  })

  it('長さが2倍になるとエントロピーも2倍になる', () => {
    const r1 = analyzePassword('aaa')
    const r2 = analyzePassword('aaaaaa')
    expect(r2.entropy).toBeCloseTo(r1.entropy * 2, 5)
  })

  it('文字集合が大きいほどエントロピーが高い（同じ長さ）', () => {
    const rLower  = analyzePassword('aaaa')       // 小文字のみ
    const rMixed  = analyzePassword('aA1!')       // 4種混在
    expect(rMixed.entropy).toBeGreaterThan(rLower.entropy)
  })
})

describe('analyzePassword - suggestions', () => {
  it('短いパスワードには12文字以上の提案が含まれる', () => {
    const result = analyzePassword('abc')
    const hasSuggestion = result.suggestions.some(s => s.includes('12文字'))
    expect(hasSuggestion).toBe(true)
  })

  it('suggestions は最大3つ', () => {
    const result = analyzePassword('a')
    expect(result.suggestions.length).toBeLessThanOrEqual(3)
  })
})

describe('analyzePassword - crackTime', () => {
  it('非常に弱いパスワードの crackTime は "即時〜数秒"', () => {
    const result = analyzePassword('abc')
    expect(result.crackTime).toBe('即時〜数秒')
  })

  it('強いパスワードの crackTime は数百年以上', () => {
    const result = analyzePassword('P@ssw0rd123!SecureKey2024')
    expect(['数百年', '数百万年以上']).toContain(result.crackTime)
  })
})
