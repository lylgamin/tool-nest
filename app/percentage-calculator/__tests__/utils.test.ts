import { describe, it, expect } from 'vitest'
import {
  calcWhatPercent,
  calcPercentOf,
  calcPercentChange,
  calcTotal,
} from '../utils'

describe('calcWhatPercent', () => {
  it('25 は 200 の 12.5%', () => {
    expect(calcWhatPercent(25, 200)).toBe(12.5)
  })
  it('50 は 100 の 50%', () => {
    expect(calcWhatPercent(50, 100)).toBe(50)
  })
  it('全体と同値なら 100%', () => {
    expect(calcWhatPercent(300, 300)).toBe(100)
  })
  it('ゼロ除算は null を返す', () => {
    expect(calcWhatPercent(10, 0)).toBeNull()
  })
  it('小数入力: 1.5 は 3 の 50%', () => {
    expect(calcWhatPercent(1.5, 3)).toBe(50)
  })
  it('0 は何のうちでも 0%', () => {
    expect(calcWhatPercent(0, 500)).toBe(0)
  })
  it('NaN 入力は null を返す', () => {
    expect(calcWhatPercent(NaN, 100)).toBeNull()
  })
})

describe('calcPercentOf', () => {
  it('200 の 12.5% は 25', () => {
    expect(calcPercentOf(12.5, 200)).toBe(25)
  })
  it('100 の 50% は 50', () => {
    expect(calcPercentOf(50, 100)).toBe(50)
  })
  it('0% は 0', () => {
    expect(calcPercentOf(0, 1000)).toBe(0)
  })
  it('100% は total 全体', () => {
    expect(calcPercentOf(100, 250)).toBe(250)
  })
  it('小数パーセント: 1000 の 0.1% は 1', () => {
    expect(calcPercentOf(0.1, 1000)).toBeCloseTo(1)
  })
  it('NaN パーセント は null', () => {
    expect(calcPercentOf(NaN, 100)).toBeNull()
  })
  it('Infinity は null', () => {
    expect(calcPercentOf(Infinity, 100)).toBeNull()
  })
})

describe('calcPercentChange', () => {
  it('100 から 120 は +20%', () => {
    expect(calcPercentChange(100, 120)).toBe(20)
  })
  it('200 から 150 は -25%', () => {
    expect(calcPercentChange(200, 150)).toBe(-25)
  })
  it('変化なしは 0%', () => {
    expect(calcPercentChange(100, 100)).toBe(0)
  })
  it('from が 0 のとき null を返す', () => {
    expect(calcPercentChange(0, 100)).toBeNull()
  })
  it('負の数からの変化: -100 から -80 は -20%', () => {
    expect(calcPercentChange(-100, -80)).toBeCloseTo(-20)
  })
  it('小数: 1.0 から 1.5 は +50%', () => {
    expect(calcPercentChange(1.0, 1.5)).toBeCloseTo(50)
  })
  it('NaN は null', () => {
    expect(calcPercentChange(NaN, 100)).toBeNull()
  })
})

describe('calcTotal', () => {
  it('25 が 12.5% なら全体は 200', () => {
    expect(calcTotal(25, 12.5)).toBe(200)
  })
  it('50 が 50% なら全体は 100', () => {
    expect(calcTotal(50, 50)).toBe(100)
  })
  it('300 が 100% なら全体は 300', () => {
    expect(calcTotal(300, 100)).toBe(300)
  })
  it('パーセントが 0 のとき null を返す（ゼロ除算）', () => {
    expect(calcTotal(100, 0)).toBeNull()
  })
  it('小数パーセント: 1 が 0.5% なら全体は 200', () => {
    expect(calcTotal(1, 0.5)).toBeCloseTo(200)
  })
  it('NaN value は null', () => {
    expect(calcTotal(NaN, 10)).toBeNull()
  })
  it('NaN percent は null', () => {
    expect(calcTotal(100, NaN)).toBeNull()
  })
})
