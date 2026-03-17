import { describe, it, expect } from 'vitest'
import { computeHash, formatHash } from '../utils'

describe('computeHash - SHA-256', () => {
  it('"hello" のSHA-256が既知のハッシュ値と一致する', async () => {
    const result = await computeHash('hello', 'SHA-256')
    expect(result).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  })

  it('空文字のSHA-256が既知のハッシュ値と一致する', async () => {
    const result = await computeHash('', 'SHA-256')
    expect(result).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  })

  it('SHA-256の出力は常に64文字の16進数', async () => {
    const result = await computeHash('hello', 'SHA-256')
    expect(result).toHaveLength(64)
  })

  it('日本語テキストのSHA-256は64文字の16進数', async () => {
    const result = await computeHash('こんにちは', 'SHA-256')
    expect(result).toHaveLength(64)
  })
})

describe('computeHash - SHA-1', () => {
  it('"hello" のSHA-1が既知のハッシュ値と一致する', async () => {
    const result = await computeHash('hello', 'SHA-1')
    expect(result).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d')
  })

  it('SHA-1の出力は常に40文字の16進数', async () => {
    const result = await computeHash('hello', 'SHA-1')
    expect(result).toHaveLength(40)
  })
})

describe('computeHash - SHA-384', () => {
  it('"hello" のSHA-384は96文字の16進数', async () => {
    const result = await computeHash('hello', 'SHA-384')
    expect(result).toHaveLength(96)
  })
})

describe('computeHash - SHA-512', () => {
  it('"hello" のSHA-512は128文字の16進数', async () => {
    const result = await computeHash('hello', 'SHA-512')
    expect(result).toHaveLength(128)
  })
})

describe('computeHash - 出力フォーマット', () => {
  it('出力は小文字の16進数のみで構成される', async () => {
    const result = await computeHash('Hello World', 'SHA-256')
    expect(result).toMatch(/^[0-9a-f]+$/)
  })

  it('異なる入力は異なるハッシュ値を返す', async () => {
    const hash1 = await computeHash('hello', 'SHA-256')
    const hash2 = await computeHash('Hello', 'SHA-256')
    expect(hash1).not.toBe(hash2)
  })
})

describe('formatHash', () => {
  it('8文字ごとにスペースを挿入する', () => {
    const hex = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
    const formatted = formatHash(hex)
    const parts = formatted.split(' ')
    expect(parts.every(p => p.length === 8)).toBe(true)
  })

  it('空文字を渡すと空文字を返す', () => {
    expect(formatHash('')).toBe('')
  })
})
