import { describe, it, expect } from 'vitest'
import { getDayOfYear, isLeapYear } from '../utils'

describe('isLeapYear', () => {
  it('2024 はうるう年', () => expect(isLeapYear(2024)).toBe(true))
  it('2023 は平年',     () => expect(isLeapYear(2023)).toBe(false))
  it('1900 はうるう年でない（100で割り切れる）', () => expect(isLeapYear(1900)).toBe(false))
  it('2000 はうるう年（400で割り切れる）',       () => expect(isLeapYear(2000)).toBe(true))
})

describe('getDayOfYear', () => {
  it('2024-01-01 → dayOfYear=1, isLeapYear=true, totalDays=366', () => {
    const r = getDayOfYear(2024, 1, 1)
    expect(r.dayOfYear).toBe(1)
    expect(r.isLeapYear).toBe(true)
    expect(r.totalDays).toBe(366)
  })

  it('2024-12-31 → dayOfYear=366, remaining=0', () => {
    const r = getDayOfYear(2024, 12, 31)
    expect(r.dayOfYear).toBe(366)
    expect(r.remaining).toBe(0)
  })

  it('2023-01-01 → dayOfYear=1, isLeapYear=false', () => {
    const r = getDayOfYear(2023, 1, 1)
    expect(r.dayOfYear).toBe(1)
    expect(r.isLeapYear).toBe(false)
    expect(r.totalDays).toBe(365)
  })

  it('2024-03-01 → dayOfYear=61（うるう年）', () => {
    const r = getDayOfYear(2024, 3, 1)
    expect(r.dayOfYear).toBe(61)
  })

  it('2023-03-01 → dayOfYear=60（平年）', () => {
    const r = getDayOfYear(2023, 3, 1)
    expect(r.dayOfYear).toBe(60)
  })

  it('progress は 0-100 の範囲', () => {
    const r = getDayOfYear(2024, 7, 1)
    expect(r.progress).toBeGreaterThan(0)
    expect(r.progress).toBeLessThan(100)
  })

  it('simpleWeek = Math.ceil(dayOfYear / 7)', () => {
    const r = getDayOfYear(2024, 1, 7)
    expect(r.simpleWeek).toBe(1)
    const r2 = getDayOfYear(2024, 1, 8)
    expect(r2.simpleWeek).toBe(2)
  })
})

describe('ISO週番号', () => {
  it('2024-01-01 → isoWeek=1, isoYear=2024', () => {
    const r = getDayOfYear(2024, 1, 1)
    expect(r.isoWeek).toBe(1)
    expect(r.isoYear).toBe(2024)
  })

  it('2023-01-01 → isoWeek=52, isoYear=2022（前年の最終週）', () => {
    const r = getDayOfYear(2023, 1, 1)
    expect(r.isoWeek).toBe(52)
    expect(r.isoYear).toBe(2022)
  })
})
