import { describe, it, expect } from 'vitest'
import { getHolidays } from '../utils'

describe('getHolidays', () => {
  it('2024年の祝日数は20件', () => {
    expect(getHolidays(2024).length).toBe(20)
  })

  it('2024年の元日が含まれる', () => {
    const h = getHolidays(2024)
    expect(h.some(x => x.date === '2024-01-01' && x.name === '元日')).toBe(true)
  })

  it('2024年の春分の日が含まれる', () => {
    const h = getHolidays(2024)
    expect(h.some(x => x.date === '2024-03-21' && x.name === '春分の日')).toBe(true)
  })

  it('2024年の秋分の日が含まれる', () => {
    const h = getHolidays(2024)
    expect(h.some(x => x.date === '2024-09-23' && x.name === '秋分の日')).toBe(true)
  })

  it('2024年の成人の日は第2月曜（2024-01-08）', () => {
    const h = getHolidays(2024)
    expect(h.some(x => x.date === '2024-01-08' && x.name === '成人の日')).toBe(true)
  })

  it('振替休日: 2024-01-01が月曜なので振替なし（月曜は振替不要）', () => {
    const h = getHolidays(2024)
    // 2024-01-01は月曜なので振替休日が2日に発生しないこと
    expect(h.some(x => x.date === '2024-01-02' && x.name === '振替休日')).toBe(false)
  })

  it('振替休日: 2024年の建国記念の日（日曜）→翌月曜が振替休日', () => {
    // 2024-02-11は日曜 → 2024-02-12(月)が振替休日
    const h = getHolidays(2024)
    expect(h.some(x => x.date === '2024-02-12' && x.name === '振替休日')).toBe(true)
  })

  it('振替休日: 土曜の祝日は振替休日にならない', () => {
    // 2023-09-23(秋分の日)は土曜 → 振替休日なし
    const h = getHolidays(2023)
    expect(h.some(x => x.date === '2023-09-25' && x.name === '振替休日')).toBe(false)
  })

  it('昇順にソートされている', () => {
    const h = getHolidays(2024)
    for (let i = 1; i < h.length; i++) {
      expect(h[i].date >= h[i - 1].date).toBe(true)
    }
  })
})
