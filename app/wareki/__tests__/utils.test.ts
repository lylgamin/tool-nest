import { describe, it, expect } from 'vitest'
import { toWareki, toSeireki } from '../utils'

describe('toWareki', () => {
  it('明治開始前日 → null', () => {
    expect(toWareki(1868, 1, 24, 'kanji')).toBeNull()
  })
  it('明治元年初日', () => {
    const r = toWareki(1868, 1, 25, 'kanji')!
    expect(r.year).toBe(1)
    expect(r.yearLabel).toBe('明治元年')
  })
  it('明治 alpha', () => {
    const r = toWareki(1868, 1, 25, 'alpha')!
    expect(r.yearLabel).toBe('M1')
    expect(r.full).toBe('M1.01.25')
  })
  it('大正前日 → 明治45年', () => {
    const r = toWareki(1912, 7, 29, 'kanji')!
    expect(r.era).toBe('明治')
    expect(r.year).toBe(45)
  })
  it('大正元年初日', () => {
    const r = toWareki(1912, 7, 30, 'kanji')!
    expect(r.era).toBe('大正')
    expect(r.year).toBe(1)
    expect(r.yearLabel).toBe('大正元年')
  })
  it('大正 alpha T15', () => {
    const r = toWareki(1912, 7, 30, 'alpha')!
    expect(r.yearLabel).toBe('T1')
  })
  it('昭和前日 → 大正15年', () => {
    const r = toWareki(1926, 12, 24, 'kanji')!
    expect(r.era).toBe('大正')
    expect(r.year).toBe(15)
  })
  it('昭和元年初日', () => {
    const r = toWareki(1926, 12, 25, 'kanji')!
    expect(r.era).toBe('昭和')
    expect(r.year).toBe(1)
  })
  it('昭和64年', () => {
    const r = toWareki(1989, 1, 7, 'kanji')!
    expect(r.era).toBe('昭和')
    expect(r.year).toBe(64)
  })
  it('平成元年初日', () => {
    const r = toWareki(1989, 1, 8, 'kanji')!
    expect(r.era).toBe('平成')
    expect(r.year).toBe(1)
    expect(r.yearLabel).toBe('平成元年')
  })
  it('平成31年 → 令和前日', () => {
    const r = toWareki(2019, 4, 30, 'kanji')!
    expect(r.era).toBe('平成')
    expect(r.year).toBe(31)
  })
  it('令和元年初日', () => {
    const r = toWareki(2019, 5, 1, 'kanji')!
    expect(r.era).toBe('令和')
    expect(r.year).toBe(1)
    expect(r.yearLabel).toBe('令和元年')
  })
  it('令和元年 alpha', () => {
    const r = toWareki(2019, 5, 1, 'alpha')!
    expect(r.yearLabel).toBe('R1')
  })
  it('令和6年1月1日 alpha full format', () => {
    const r = toWareki(2024, 1, 1, 'alpha')!
    expect(r.full).toBe('R6.01.01')
  })
  it('令和6年 kanji full', () => {
    const r = toWareki(2024, 1, 1, 'kanji')!
    expect(r.full).toBe('令和6年1月1日')
  })
})

describe('toSeireki', () => {
  it('令和1→2019-05-01', () => {
    const r = toSeireki('R', 1, 5, 1)!
    expect(r).toEqual({ year: 2019, month: 5, day: 1 })
  })
  it('漢字元号でも変換できる', () => {
    const r = toSeireki('令和', 6, 1, 1)!
    expect(r).toEqual({ year: 2024, month: 1, day: 1 })
  })
  it('不正な元号 → null', () => {
    expect(toSeireki('X', 1, 1, 1)).toBeNull()
  })
  it('往復変換', () => {
    const wareki = toWareki(1989, 1, 8, 'alpha')!
    const back = toSeireki(wareki.era, wareki.year, 1, 8)!
    expect(back.year).toBe(1989)
  })
})
