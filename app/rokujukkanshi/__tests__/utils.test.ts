import { describe, it, expect } from 'vitest'
import { getKanshi, getAllKanshi } from '../utils'

describe('getKanshi', () => {
  it('2024 → 甲辰（きのえたつ）cycleIndex=41', () => {
    const r = getKanshi(2024)
    expect(r.kanshi).toBe('甲辰')
    expect(r.yomi).toBe('きのえたつ')
    expect(r.stem).toBe('甲')
    expect(r.branch).toBe('辰')
    expect(r.cycleIndex).toBe(41)
  })

  it('2025 → 乙巳（きのとみ）', () => {
    const r = getKanshi(2025)
    expect(r.kanshi).toBe('乙巳')
    expect(r.yomi).toBe('きのとみ')
  })

  it('1900 → 庚子（かのえね）', () => {
    const r = getKanshi(1900)
    expect(r.kanshi).toBe('庚子')
    expect(r.yomi).toBe('かのえね')
  })

  it('4 AD → 甲子（cycleIndex=1）', () => {
    const r = getKanshi(4)
    expect(r.kanshi).toBe('甲子')
    expect(r.cycleIndex).toBe(1)
  })

  it('BCE年（負の年）でも正値のモジュロを返す', () => {
    const r = getKanshi(-56)
    expect(r.cycleIndex).toBeGreaterThanOrEqual(1)
    expect(r.cycleIndex).toBeLessThanOrEqual(60)
  })

  it('cycleIndex は 1-60 の範囲で60年周期', () => {
    for (let y = 2000; y < 2060; y++) {
      const r = getKanshi(y)
      expect(r.cycleIndex).toBeGreaterThanOrEqual(1)
      expect(r.cycleIndex).toBeLessThanOrEqual(60)
      const r2 = getKanshi(y + 60)
      expect(r2.kanshi).toBe(r.kanshi)
      expect(r2.cycleIndex).toBe(r.cycleIndex)
    }
  })
})

describe('getAllKanshi', () => {
  it('60個のエントリを返す', () => {
    const all = getAllKanshi()
    expect(all).toHaveLength(60)
  })

  it('cycleIndex が 1-60 で連続する', () => {
    const all = getAllKanshi()
    all.forEach((item, i) => {
      expect(item.cycleIndex).toBe(i + 1)
    })
  })
})
