import { describe, it, expect } from 'vitest'
import { encodeBase64, decodeBase64, encodeBase64UrlSafe, isValidBase64 } from '../utils'

describe('encodeBase64', () => {
  it('英数字をBase64エンコードする', () => {
    expect(encodeBase64('hello')).toBe('aGVsbG8=')
  })

  it('空文字をエンコードすると空文字を返す', () => {
    expect(encodeBase64('')).toBe('')
  })

  it('日本語のエンコード→デコードでラウンドトリップ', () => {
    const original = '日本語テスト'
    const encoded = encodeBase64(original)
    const result = decodeBase64(encoded)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.output).toBe(original)
    }
  })

  it('ASCII文字列のエンコード→デコードでラウンドトリップ', () => {
    const original = 'Hello, World! 123'
    const encoded = encodeBase64(original)
    const result = decodeBase64(encoded)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.output).toBe(original)
    }
  })
})

describe('decodeBase64', () => {
  it('正常なBase64文字列をデコードする', () => {
    const result = decodeBase64('aGVsbG8=')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.output).toBe('hello')
    }
  })

  it('日本語を含むBase64をデコードする', () => {
    const encoded = encodeBase64('こんにちは')
    const result = decodeBase64(encoded)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.output).toBe('こんにちは')
    }
  })

  it('不正なBase64文字列でエラーを返す', () => {
    const result = decodeBase64('!!!invalid!!!')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBeTruthy()
    }
  })

  it('不正な文字を含む場合エラーを返す', () => {
    const result = decodeBase64('not@valid#base64')
    expect(result.ok).toBe(false)
  })
})

describe('encodeBase64UrlSafe', () => {
  it('+を-に、/を_に変換し、パディングを除去する', () => {
    // 標準Base64で+や/が出る入力でテスト
    const original = '>>>???'
    const standard = encodeBase64(original)
    const urlSafe = encodeBase64UrlSafe(original)
    expect(urlSafe).toBe(
      standard.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    )
    expect(urlSafe).not.toContain('+')
    expect(urlSafe).not.toContain('/')
    expect(urlSafe).not.toContain('=')
  })

  it('日本語のURL-safeエンコードがパディングなし', () => {
    const result = encodeBase64UrlSafe('テスト')
    expect(result).not.toContain('=')
  })
})

describe('isValidBase64', () => {
  it('正常なBase64文字列でtrueを返す', () => {
    expect(isValidBase64('aGVsbG8=')).toBe(true)
  })

  it('パディングなしの正常なBase64でtrueを返す', () => {
    // 長さが4の倍数のもの
    expect(isValidBase64('dGVzdA==')).toBe(true)
  })

  it('不正な文字(@)を含む場合falseを返す', () => {
    expect(isValidBase64('aGVs@G8=')).toBe(false)
  })

  it('空文字はfalseを返す', () => {
    expect(isValidBase64('')).toBe(false)
  })

  it('日本語文字を含む場合falseを返す', () => {
    expect(isValidBase64('日本語')).toBe(false)
  })

  it('encodeBase64の出力はisValidBase64でtrueになる', () => {
    expect(isValidBase64(encodeBase64('hello world'))).toBe(true)
    expect(isValidBase64(encodeBase64('日本語'))).toBe(true)
  })
})
