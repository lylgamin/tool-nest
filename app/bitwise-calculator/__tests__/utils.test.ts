import { describe, it, expect } from 'vitest'
import { bitwiseCalc, toBinaryStr, toHexStr, parseIntInput } from '../utils'

describe('bitwiseCalc', () => {
  it('AND: 0b1100 & 0b1010 = 0b1000', () => {
    expect(bitwiseCalc('AND', 0b1100, 0b1010)).toBe(0b1000)
  })

  it('OR: 0b1100 | 0b1010 = 0b1110', () => {
    expect(bitwiseCalc('OR', 0b1100, 0b1010)).toBe(0b1110)
  })

  it('XOR: 0b1100 ^ 0b1010 = 0b0110', () => {
    expect(bitwiseCalc('XOR', 0b1100, 0b1010)).toBe(0b0110)
  })

  it('NOT: ~0 = 0xFFFFFFFF', () => {
    expect(bitwiseCalc('NOT', 0, 0)).toBe(0xFFFFFFFF)
  })

  it('LSHIFT: 1 << 3 = 8', () => {
    expect(bitwiseCalc('LSHIFT', 1, 3)).toBe(8)
  })

  it('RSHIFT: 8 >>> 1 = 4', () => {
    expect(bitwiseCalc('RSHIFT', 8, 1)).toBe(4)
  })

  it('AND の結果は符号なし32bit整数', () => {
    expect(bitwiseCalc('AND', 0xFFFFFFFF, 0xFFFFFFFF)).toBe(0xFFFFFFFF)
  })

  it('NOT の結果は符号なし32bit整数', () => {
    expect(bitwiseCalc('NOT', 0xFFFFFFFF, 0)).toBe(0)
  })
})

describe('toBinaryStr', () => {
  it('5 を32bit2進数文字列に変換', () => {
    expect(toBinaryStr(5)).toBe('00000000000000000000000000000101')
  })

  it('0 を32bit2進数文字列に変換', () => {
    expect(toBinaryStr(0)).toBe('00000000000000000000000000000000')
  })

  it('255 を8bit2進数文字列に変換', () => {
    expect(toBinaryStr(255, 8)).toBe('11111111')
  })

  it('255 を16bit2進数文字列に変換', () => {
    expect(toBinaryStr(255, 16)).toBe('0000000011111111')
  })
})

describe('toHexStr', () => {
  it('255 → "000000FF"', () => {
    expect(toHexStr(255)).toBe('000000FF')
  })

  it('0 → "00000000"', () => {
    expect(toHexStr(0)).toBe('00000000')
  })

  it('0xFFFFFFFF → "FFFFFFFF"', () => {
    expect(toHexStr(0xFFFFFFFF)).toBe('FFFFFFFF')
  })

  it('大文字で出力される', () => {
    expect(toHexStr(0xABCDEF)).toBe('00ABCDEF')
  })
})

describe('parseIntInput', () => {
  it('"1010" in base 2 → 10', () => {
    expect(parseIntInput('1010', 2)).toBe(10)
  })

  it('空文字列は null を返す', () => {
    expect(parseIntInput('', 10)).toBeNull()
  })

  it('不正な入力は null を返す', () => {
    expect(parseIntInput('xyz', 10)).toBeNull()
  })

  it('10進数 "255" → 255', () => {
    expect(parseIntInput('255', 10)).toBe(255)
  })

  it('16進数 "FF" → 255', () => {
    expect(parseIntInput('FF', 16)).toBe(255)
  })

  it('8進数 "17" → 15', () => {
    expect(parseIntInput('17', 8)).toBe(15)
  })

  it('前後の空白を無視する', () => {
    expect(parseIntInput('  42  ', 10)).toBe(42)
  })
})
