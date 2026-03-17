import { describe, it, expect } from 'vitest'
import { encodeUrlComponent, decodeUrlComponent, isValidUrlEncoded } from '../utils'

describe('encodeUrlComponent', () => {
  it('ASCII文字列をエンコードする', () => {
    expect(encodeUrlComponent('hello world')).toBe('hello%20world')
  })

  it('日本語をエンコードする', () => {
    expect(encodeUrlComponent('日本語')).toBe('%E6%97%A5%E6%9C%AC%E8%AA%9E')
  })

  it('スペースを%20に変換する', () => {
    expect(encodeUrlComponent(' ')).toBe('%20')
  })

  it('&を%26に変換する', () => {
    expect(encodeUrlComponent('a&b')).toBe('a%26b')
  })

  it('空文字列はそのまま返す', () => {
    expect(encodeUrlComponent('')).toBe('')
  })
})

describe('decodeUrlComponent', () => {
  it('通常のデコードができる', () => {
    const result = decodeUrlComponent('hello%20world')
    expect(result).toEqual({ ok: true, output: 'hello world' })
  })

  it('日本語URLをデコードする', () => {
    const result = decodeUrlComponent('%E6%97%A5%E6%9C%AC%E8%AA%9E')
    expect(result).toEqual({ ok: true, output: '日本語' })
  })

  it('%ZZはデコードエラーになる', () => {
    const result = decodeUrlComponent('%ZZ')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/デコードエラー/)
    }
  })

  it('末尾の%はデコードエラーになる', () => {
    const result = decodeUrlComponent('abc%')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/デコードエラー/)
    }
  })

  it('+はスペースに変換されない（URLエンコードでは+をそのまま扱う）', () => {
    const result = decodeUrlComponent('a+b')
    expect(result).toEqual({ ok: true, output: 'a+b' })
  })
})

describe('isValidUrlEncoded', () => {
  it('正しいエンコード文字列はtrueを返す', () => {
    expect(isValidUrlEncoded('hello%20world')).toBe(true)
  })

  it('不正な%シーケンスはfalseを返す', () => {
    expect(isValidUrlEncoded('%ZZ')).toBe(false)
  })
})
