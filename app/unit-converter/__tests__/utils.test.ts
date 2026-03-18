import { describe, it, expect } from 'vitest'
import { convert } from '../utils'

describe('convert', () => {
  // 長さ
  it('m → km', () => {
    expect(convert(1000, 'm', 'km', 'length')).toBeCloseTo(1)
  })

  it('km → m', () => {
    expect(convert(1, 'km', 'm', 'length')).toBeCloseTo(1000)
  })

  it('in → cm', () => {
    expect(convert(1, 'in', 'cm', 'length')).toBeCloseTo(2.54)
  })

  // 重量
  it('kg → g', () => {
    expect(convert(1, 'kg', 'g', 'weight')).toBeCloseTo(1000)
  })

  it('g → kg', () => {
    expect(convert(500, 'g', 'kg', 'weight')).toBeCloseTo(0.5)
  })

  // 温度
  it('0°C → 32°F', () => {
    expect(convert(0, 'c', 'f', 'temperature')).toBeCloseTo(32)
  })

  it('0°C → 273.15K', () => {
    expect(convert(0, 'c', 'k', 'temperature')).toBeCloseTo(273.15)
  })

  it('100°C → 212°F', () => {
    expect(convert(100, 'c', 'f', 'temperature')).toBeCloseTo(212)
  })

  // 速度
  it('1 m/s → 3.6 km/h', () => {
    expect(convert(1, 'mps', 'kmh', 'speed')).toBeCloseTo(3.6)
  })

  // 面積
  it('1 m² → 10000 cm²', () => {
    expect(convert(1, 'm2', 'cm2', 'area')).toBeCloseTo(10000)
  })

  // エラー
  it('存在しない単位IDはエラーを投げる', () => {
    expect(() => convert(1, 'unknown', 'm', 'length')).toThrow('Unknown unit')
  })

  // 同じ単位の変換は元の値を返す
  it('同じ単位への変換は値が変わらない', () => {
    expect(convert(42, 'kg', 'kg', 'weight')).toBeCloseTo(42)
  })
})
