import { describe, it, expect } from 'vitest'
import { calcBusinessDays, parseHolidayText } from '../utils'

describe('calcBusinessDays', () => {
  it('月〜金の5営業日', () => {
    const r = calcBusinessDays({
      startDate: '2024-01-08',
      endDate: '2024-01-12',
      excludeSaturday: true,
      holidays: [],
    })
    expect(r.businessDays).toBe(5)
    expect(r.totalDays).toBe(5)
  })

  it('土曜除外ONで月〜土は5営業日', () => {
    const r = calcBusinessDays({
      startDate: '2024-01-08',
      endDate: '2024-01-13',
      excludeSaturday: true,
      holidays: [],
    })
    expect(r.businessDays).toBe(5)
    expect(r.excludedSaturdays).toBe(1)
  })

  it('土曜除外OFFで月〜土は6営業日', () => {
    const r = calcBusinessDays({
      startDate: '2024-01-08',
      endDate: '2024-01-13',
      excludeSaturday: false,
      holidays: [],
    })
    expect(r.businessDays).toBe(6)
    expect(r.excludedSaturdays).toBe(0)
  })

  it('祝日が正しく除外される', () => {
    const r = calcBusinessDays({
      startDate: '2024-01-01',
      endDate: '2024-01-05',
      excludeSaturday: true,
      holidays: ['2024-01-01'],
    })
    // 01: 月(祝日) 02: 火 03: 水 04: 木 05: 金 → 4営業日
    expect(r.businessDays).toBe(4)
    expect(r.excludedHolidays).toBe(1)
  })

  it('開始=終了（平日）は1営業日', () => {
    const r = calcBusinessDays({
      startDate: '2024-01-08',
      endDate: '2024-01-08',
      excludeSaturday: true,
      holidays: [],
    })
    expect(r.businessDays).toBe(1)
    expect(r.totalDays).toBe(1)
  })

  it('開始=終了（日曜）は0営業日', () => {
    const r = calcBusinessDays({
      startDate: '2024-01-07',
      endDate: '2024-01-07',
      excludeSaturday: true,
      holidays: [],
    })
    expect(r.businessDays).toBe(0)
    expect(r.excludedSundays).toBe(1)
  })

  it('startDate > endDate → 全ゼロ', () => {
    const r = calcBusinessDays({
      startDate: '2024-01-10',
      endDate: '2024-01-08',
      excludeSaturday: true,
      holidays: [],
    })
    expect(r.businessDays).toBe(0)
    expect(r.totalDays).toBe(0)
  })

  it('土日と重なる祝日が二重カウントされない', () => {
    // 2024-01-07は日曜、これを祝日に指定しても excludedHolidays に入らない
    const r = calcBusinessDays({
      startDate: '2024-01-07',
      endDate: '2024-01-07',
      excludeSaturday: true,
      holidays: ['2024-01-07'],
    })
    expect(r.excludedSundays).toBe(1)
    expect(r.excludedHolidays).toBe(0)
  })
})

describe('parseHolidayText', () => {
  it('正しい日付のみ抽出', () => {
    const text = '2024-01-01\n2024-02-11\ninvalid\n2024-03-21'
    expect(parseHolidayText(text)).toEqual(['2024-01-01', '2024-02-11', '2024-03-21'])
  })
  it('空文字は空配列', () => {
    expect(parseHolidayText('')).toEqual([])
  })
})
