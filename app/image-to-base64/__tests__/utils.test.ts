import { describe, it, expect } from 'vitest'
import { formatDataUri, estimateSizeKb, getSupportedMimeTypes, extractBase64FromDataUri } from '../utils'

describe('formatDataUri', () => {
  it('正しいdata URIを生成する', () => {
    const result = formatDataUri('image/png', 'abc123')
    expect(result).toBe('data:image/png;base64,abc123')
  })
})

describe('estimateSizeKb', () => {
  it('Base64文字列からサイズを推定する', () => {
    // 1024文字のBase64 ≈ 0.75KB
    const base64 = 'A'.repeat(1024)
    const size = estimateSizeKb(base64)
    expect(size).toBeGreaterThan(0)
  })
})

describe('getSupportedMimeTypes', () => {
  it('サポートするMIMEタイプリストを返す', () => {
    const types = getSupportedMimeTypes()
    expect(types).toContain('image/png')
    expect(types).toContain('image/jpeg')
  })
})

describe('extractBase64FromDataUri', () => {
  it('data URIからBase64を抽出する', () => {
    const result = extractBase64FromDataUri('data:image/png;base64,abc123')
    expect(result).toEqual({ mimeType: 'image/png', base64: 'abc123' })
  })

  it('不正なdata URIはnullを返す', () => {
    expect(extractBase64FromDataUri('not-a-data-uri')).toBeNull()
  })
})
