import { describe, it, expect } from 'vitest'
import { buildCspHeader, parseCspHeader, CSP_DIRECTIVES } from '../utils'

describe('buildCspHeader', () => {
  it('単一ディレクティブを正しく生成する', () => {
    const result = buildCspHeader({ 'default-src': ["'self'"] })
    expect(result).toBe("default-src 'self'")
  })

  it('複数ディレクティブをセミコロン区切りで生成する', () => {
    const result = buildCspHeader({
      'default-src': ["'self'"],
      'script-src': ["'self'", 'https://cdn.example.com'],
    })
    expect(result).toBe("default-src 'self'; script-src 'self' https://cdn.example.com")
  })

  it('値が空のディレクティブはスキップする', () => {
    const result = buildCspHeader({ 'default-src': ["'self'"], 'script-src': [] })
    expect(result).toBe("default-src 'self'")
  })
})

describe('parseCspHeader', () => {
  it('CSPヘッダーをパースする', () => {
    const result = parseCspHeader("default-src 'self'; script-src 'self' https://cdn.example.com")
    expect(result['default-src']).toEqual(["'self'"])
    expect(result['script-src']).toEqual(["'self'", 'https://cdn.example.com'])
  })

  it('空文字列は空オブジェクトを返す', () => {
    expect(parseCspHeader('')).toEqual({})
  })
})

describe('CSP_DIRECTIVES', () => {
  it('10個のディレクティブが定義されている', () => {
    expect(CSP_DIRECTIVES).toHaveLength(10)
  })
})
