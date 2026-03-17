import { describe, it, expect } from 'vitest'
import { testRegex } from '../utils'

describe('testRegex', () => {
  it('空パターンは空配列を返す', () => {
    const result = testRegex('', 'g', 'hello world')
    expect(result).toEqual({ ok: true, matches: [], totalCount: 0 })
  })

  it('基本マッチング: /hello/ で "hello world" → 1件', () => {
    const result = testRegex('hello', '', 'hello world')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.totalCount).toBe(1)
      expect(result.matches[0].match).toBe('hello')
      expect(result.matches[0].index).toBe(0)
    }
  })

  it('gフラグで全マッチ取得: /a/g で "banana" → 3件', () => {
    const result = testRegex('a', 'g', 'banana')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.totalCount).toBe(3)
    }
  })

  it('キャプチャグループ: /(\\w+)/ で "hello" → groups[0] === "hello"', () => {
    const result = testRegex('(\\w+)', '', 'hello')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.matches[0].groups[0]).toBe('hello')
    }
  })

  it('不正なフラグでエラー', () => {
    const result = testRegex('hello', 'z', 'hello')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/正規表現エラー/)
    }
  })

  it('不正なパターン ([/) でエラー', () => {
    const result = testRegex('[', '', 'hello')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/正規表現エラー/)
    }
  })

  it('空入力でマッチなし', () => {
    const result = testRegex('hello', '', '')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.totalCount).toBe(0)
    }
  })
})
