import { describe, it, expect } from 'vitest'
import { buildOgpTags, validateOgp } from '../utils'

const base = {
  title: 'Test Page',
  description: 'A test description',
  url: 'https://example.com',
  imageUrl: 'https://example.com/image.png',
  siteName: 'Example',
  type: 'website',
  twitterCard: 'summary_large_image' as const,
  twitterSite: '@example',
  twitterCreator: '',
}

describe('buildOgpTags', () => {
  it('og:titleが含まれる', () => {
    const r = buildOgpTags(base)
    expect(r).toContain('og:title')
    expect(r).toContain('Test Page')
  })

  it('og:descriptionが含まれる', () => {
    const r = buildOgpTags(base)
    expect(r).toContain('og:description')
  })

  it('twitter:cardが含まれる', () => {
    const r = buildOgpTags(base)
    expect(r).toContain('twitter:card')
    expect(r).toContain('summary_large_image')
  })

  it('twitter:siteに@が付く', () => {
    const r = buildOgpTags({ ...base, twitterSite: 'example' })
    expect(r).toContain('@example')
  })

  it('空フィールドはタグを出力しない', () => {
    const r = buildOgpTags({ ...base, siteName: '', imageUrl: '' })
    expect(r).not.toContain('og:site_name')
    expect(r).not.toContain('og:image')
  })

  it('ダブルクォートをエスケープ', () => {
    const r = buildOgpTags({ ...base, title: 'Say "hello"' })
    expect(r).toContain('&quot;')
    // content属性内に未エスケープの " が含まれないこと（タグ境界 > で止める）
    expect(r).not.toMatch(/content="[^">]*"[^">]*"/)
  })
})

describe('validateOgp', () => {
  it('正常な入力でエラーなし', () => {
    const errors = validateOgp(base)
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('タイトルが空でエラー', () => {
    const errors = validateOgp({ ...base, title: '' })
    expect(errors.title).toBeTruthy()
  })

  it('タイトル60文字超で警告', () => {
    const errors = validateOgp({ ...base, title: 'a'.repeat(61) })
    expect(errors.title).toBeTruthy()
  })

  it('不正URLでエラー', () => {
    const errors = validateOgp({ ...base, url: 'not-a-url' })
    expect(errors.url).toBeTruthy()
  })
})
