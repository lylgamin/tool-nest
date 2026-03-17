import { describe, it, expect } from 'vitest'
import {
  parseHex, rgbToHex, rgbToHsl, hslToRgb, rgbToHsv, hsvToRgb, fromRgb,
} from './utils'

describe('parseHex', () => {
  it('6桁HEXをパースする', () => {
    expect(parseHex('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
    expect(parseHex('1a2b3c')).toEqual({ r: 26, g: 43, b: 60 })
  })
  it('3桁HEXを6桁相当に展開する', () => {
    expect(parseHex('#abc')).toEqual({ r: 170, g: 187, b: 204 })
    expect(parseHex('fff')).toEqual({ r: 255, g: 255, b: 255 })
  })
  it('無効な入力はnullを返す', () => {
    expect(parseHex('')).toBeNull()
    expect(parseHex('#gg0000')).toBeNull()
    expect(parseHex('#12345')).toBeNull()
  })
})

describe('rgbToHex', () => {
  it('RGBを小文字HEXに変換する', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000')
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000')
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff')
  })
  it('1桁の値をゼロパディングする', () => {
    expect(rgbToHex({ r: 1, g: 2, b: 3 })).toBe('#010203')
  })
})

describe('rgbToHsl / hslToRgb 往復', () => {
  it('純色（赤）の変換', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
  })
  it('無彩色（白）の変換', () => {
    expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 100 })
  })
  it('無彩色（黒）の変換', () => {
    expect(rgbToHsl({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0 })
  })
  it('HSL→RGB→HSLで往復できる', () => {
    const hsl = { h: 210, s: 60, l: 40 }
    const rgb = hslToRgb(hsl)
    const back = rgbToHsl(rgb)
    expect(back.h).toBeCloseTo(hsl.h, -1)
    expect(back.s).toBeCloseTo(hsl.s, -1)
    expect(back.l).toBeCloseTo(hsl.l, -1)
  })
})

describe('rgbToHsv / hsvToRgb 往復', () => {
  it('純色（緑）の変換', () => {
    expect(rgbToHsv({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 100, v: 100 })
  })
  it('HSV→RGB→HSVで往復できる', () => {
    const hsv = { h: 270, s: 50, v: 80 }
    const rgb = hsvToRgb(hsv)
    const back = rgbToHsv(rgb)
    expect(back.h).toBeCloseTo(hsv.h, -1)
    expect(back.s).toBeCloseTo(hsv.s, -1)
    expect(back.v).toBeCloseTo(hsv.v, -1)
  })
})

describe('fromRgb', () => {
  it('全形式を同時に返す', () => {
    const result = fromRgb({ r: 255, g: 0, b: 0 })
    expect(result.hex).toBe('#ff0000')
    expect(result.rgb).toEqual({ r: 255, g: 0, b: 0 })
    expect(result.hsl).toEqual({ h: 0, s: 100, l: 50 })
    expect(result.hsv).toEqual({ h: 0, s: 100, v: 100 })
  })
})
