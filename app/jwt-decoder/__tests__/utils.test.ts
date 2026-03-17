import { describe, it, expect } from 'vitest'
import { base64UrlDecode, decodeJwt, formatExpiry } from '../utils'

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ' +
  '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('base64UrlDecode', () => {
  it('URLセーフ文字（- と _）を正しく処理する', () => {
    // ">" encodes to "Pg==" in standard base64, "Pg" in base64url
    // base64url: "Pg" → base64: "Pg==" → atob → ">"
    expect(base64UrlDecode('Pg')).toBe('>')
  })

  it('パディングなし文字列を処理する', () => {
    // "Man" → base64: "TWFu" (no padding needed)
    expect(base64UrlDecode('TWFu')).toBe('Man')
  })

  it('- をデコードする（標準base64の +）', () => {
    // base64url "-" corresponds to base64 "+"
    // "3b" in base64url: "3b" pad to "3b==" → "3b==" base64 → atob
    // Use a known value: encode ">" to base64url => "Pg", encode ">>" => "Pg" nope
    // Let's use a known: btoa(String.fromCharCode(0xfb)) = "+w==" → base64url = "-w"
    expect(base64UrlDecode('-w')).toBe(String.fromCharCode(0xfb))
  })

  it('_ をデコードする（標準base64の /）', () => {
    // btoa(String.fromCharCode(0xff)) = "/w==" → base64url = "_w"
    expect(base64UrlDecode('_w')).toBe(String.fromCharCode(0xff))
  })
})

describe('decodeJwt', () => {
  it('正常なJWTをデコードする', () => {
    const result = decodeJwt(SAMPLE_JWT)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.header.alg).toBe('HS256')
    expect(result.header.typ).toBe('JWT')
    expect(result.payload.sub).toBe('1234567890')
    expect(result.payload.name).toBe('John Doe')
  })

  it('rawパートに元のBase64URLエンコード文字列を保持する', () => {
    const result = decodeJwt(SAMPLE_JWT)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.raw.header).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
    expect(result.raw.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
  })

  it('2パートのトークンはエラーを返す', () => {
    const result = decodeJwt('header.payload')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toContain('3つのパート')
  })

  it('不正なBase64はエラーを返す', () => {
    const result = decodeJwt('!!!.!!!.!!!')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toContain('デコードに失敗')
  })

  it('前後の空白を除去してデコードする', () => {
    const result = decodeJwt(`  ${SAMPLE_JWT}  `)
    expect(result.ok).toBe(true)
  })
})

describe('formatExpiry', () => {
  it('数値でないexpは "不明" を返す', () => {
    expect(formatExpiry(undefined)).toBe('不明')
    expect(formatExpiry('string')).toBe('不明')
    expect(formatExpiry(null)).toBe('不明')
  })

  it('過去のタイムスタンプは "期限切れ" を含む', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600 // 1時間前
    const result = formatExpiry(pastExp)
    expect(result).toContain('期限切れ')
  })

  it('未来のタイムスタンプは "有効" を含む', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600 // 1時間後
    const result = formatExpiry(futureExp)
    expect(result).toContain('有効')
  })
})
