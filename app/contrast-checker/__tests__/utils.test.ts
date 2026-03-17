import { describe, it, expect } from 'vitest'
import { parseColor, relativeLuminance, contrastRatio, checkContrast } from '../utils'

describe('parseColor', () => {
  it('#rrggbb を解析', () => {
    const r = parseColor('#1a2b3c')
    expect(r.ok).toBe(true)
    if (r.ok) { expect(r.r).toBe(0x1a); expect(r.g).toBe(0x2b); expect(r.b).toBe(0x3c) }
  })

  it('#rgb を解析', () => {
    const r = parseColor('#fff')
    expect(r.ok).toBe(true)
    if (r.ok) { expect(r.r).toBe(255); expect(r.g).toBe(255); expect(r.b).toBe(255) }
  })

  it('rgb() を解析', () => {
    const r = parseColor('rgb(255, 0, 128)')
    expect(r.ok).toBe(true)
    if (r.ok) { expect(r.r).toBe(255); expect(r.g).toBe(0); expect(r.b).toBe(128) }
  })

  it('不正な入力でエラー', () => {
    expect(parseColor('notacolor').ok).toBe(false)
  })
})

describe('relativeLuminance', () => {
  it('白は 1', () => {
    expect(relativeLuminance(255,255,255)).toBeCloseTo(1, 3)
  })
  it('黒は 0', () => {
    expect(relativeLuminance(0,0,0)).toBeCloseTo(0, 5)
  })
})

describe('contrastRatio', () => {
  it('白黒のコントラストは 21', () => {
    const l1 = relativeLuminance(255,255,255)
    const l2 = relativeLuminance(0,0,0)
    expect(contrastRatio(l1, l2)).toBeCloseTo(21, 0)
  })
  it('同一色のコントラストは 1', () => {
    const l = relativeLuminance(128,128,128)
    expect(contrastRatio(l, l)).toBeCloseTo(1, 5)
  })
})

describe('checkContrast', () => {
  it('黒文字×白背景はAAA', () => {
    const r = checkContrast({ r:0, g:0, b:0 }, { r:255, g:255, b:255 })
    expect(r.normalText).toBe('AAA')
    expect(r.ratio).toBeGreaterThan(20)
  })
  it('低コントラストはFail', () => {
    const r = checkContrast({ r:200, g:200, b:200 }, { r:255, g:255, b:255 })
    expect(r.normalText).toBe('Fail')
  })
})
