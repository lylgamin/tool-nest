import { describe, it, expect } from 'vitest'
import { searchHttpStatus, groupByCategory, HTTP_STATUS_CODES } from '../utils'

describe('searchHttpStatus', () => {
  it('空文字列で全件返す', () => {
    const result = searchHttpStatus('')
    expect(result).toHaveLength(HTTP_STATUS_CODES.length)
  })

  it('"200" で code:200 を含む結果を返す', () => {
    const result = searchHttpStatus('200')
    expect(result.some(s => s.code === 200)).toBe(true)
  })

  it('"not found" で code:404 を返す', () => {
    const result = searchHttpStatus('not found')
    expect(result.some(s => s.code === 404)).toBe(true)
  })

  it('"認証" で code:401 を返す', () => {
    const result = searchHttpStatus('認証')
    expect(result.some(s => s.code === 401)).toBe(true)
  })

  it('"xyzxyz" で空配列を返す', () => {
    const result = searchHttpStatus('xyzxyz')
    expect(result).toHaveLength(0)
  })

  it('大文字小文字を区別しない', () => {
    const lower = searchHttpStatus('ok')
    const upper = searchHttpStatus('OK')
    expect(lower).toEqual(upper)
    expect(lower.some(s => s.code === 200)).toBe(true)
  })
})

describe('groupByCategory', () => {
  it('2xx グループに code:200 が含まれる', () => {
    const grouped = groupByCategory(HTTP_STATUS_CODES)
    expect(grouped['2xx']).toBeDefined()
    expect(grouped['2xx'].some(s => s.code === 200)).toBe(true)
  })

  it('4xx グループに code:404 が含まれる', () => {
    const grouped = groupByCategory(HTTP_STATUS_CODES)
    expect(grouped['4xx']).toBeDefined()
    expect(grouped['4xx'].some(s => s.code === 404)).toBe(true)
  })

  it('5xx グループに code:500 が含まれる', () => {
    const grouped = groupByCategory(HTTP_STATUS_CODES)
    expect(grouped['5xx']).toBeDefined()
    expect(grouped['5xx'].some(s => s.code === 500)).toBe(true)
  })

  it('空配列を渡すと空オブジェクトを返す', () => {
    const grouped = groupByCategory([])
    expect(Object.keys(grouped)).toHaveLength(0)
  })

  it('フィルター済みコードを正しくグループ化する', () => {
    const filtered = searchHttpStatus('redirect')
    const grouped = groupByCategory(filtered)
    expect(grouped['3xx']).toBeDefined()
    expect(grouped['3xx'].length).toBeGreaterThan(0)
  })
})
