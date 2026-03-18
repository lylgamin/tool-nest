import { describe, it, expect } from 'vitest'
import { calcTaxIncluded, calcTaxExcluded } from '../utils'

describe('calcTaxIncluded', () => {
  describe('税率10%', () => {
    it('切り捨て: 1000円 → 税100円・税込1100円', () => {
      const result = calcTaxIncluded(1000, 0.10, 'floor')
      expect(result.taxAmount).toBe(100)
      expect(result.priceIncluded).toBe(1100)
    })

    it('切り捨て: 端数あり 123円 → 税12円・税込135円', () => {
      const result = calcTaxIncluded(123, 0.10, 'floor')
      expect(result.taxAmount).toBe(12)
      expect(result.priceIncluded).toBe(135)
    })

    it('切り上げ: 端数あり 123円 → 税13円・税込136円', () => {
      const result = calcTaxIncluded(123, 0.10, 'ceil')
      expect(result.taxAmount).toBe(13)
      expect(result.priceIncluded).toBe(136)
    })

    it('四捨五入: 端数あり 123円 → 税12円・税込135円', () => {
      const result = calcTaxIncluded(123, 0.10, 'round')
      expect(result.taxAmount).toBe(12)
      expect(result.priceIncluded).toBe(135)
    })

    it('四捨五入: 端数0.5以上 155円 → 税16円・税込171円', () => {
      // 155 * 0.10 = 15.5 → 四捨五入 → 16
      const result = calcTaxIncluded(155, 0.10, 'round')
      expect(result.taxAmount).toBe(16)
      expect(result.priceIncluded).toBe(171)
    })

    it('0円 → 税0円・税込0円', () => {
      const result = calcTaxIncluded(0, 0.10, 'floor')
      expect(result.taxAmount).toBe(0)
      expect(result.priceIncluded).toBe(0)
    })
  })

  describe('軽減税率8%', () => {
    it('切り捨て: 1000円 → 税80円・税込1080円', () => {
      const result = calcTaxIncluded(1000, 0.08, 'floor')
      expect(result.taxAmount).toBe(80)
      expect(result.priceIncluded).toBe(1080)
    })

    it('切り捨て: 端数あり 123円 → 税9円・税込132円', () => {
      // 123 * 0.08 = 9.84 → 切り捨て → 9
      const result = calcTaxIncluded(123, 0.08, 'floor')
      expect(result.taxAmount).toBe(9)
      expect(result.priceIncluded).toBe(132)
    })

    it('切り上げ: 端数あり 123円 → 税10円・税込133円', () => {
      const result = calcTaxIncluded(123, 0.08, 'ceil')
      expect(result.taxAmount).toBe(10)
      expect(result.priceIncluded).toBe(133)
    })
  })
})

describe('calcTaxExcluded', () => {
  describe('税率10%', () => {
    it('切り捨て: 税込1100円 → 税抜1000円・税100円（浮動小数点精度対策確認）', () => {
      const result = calcTaxExcluded(1100, 0.10, 'floor')
      expect(result.priceExcluded).toBe(1000)
      expect(result.taxAmount).toBe(100)
    })

    it('切り捨て: 端数あり 税込135円 → 税抜122円', () => {
      // 135 / 1.10 = 122.727... → 切り捨て → 122
      const result = calcTaxExcluded(135, 0.10, 'floor')
      expect(result.priceExcluded).toBe(122)
      expect(result.taxAmount).toBe(13)
    })

    it('切り上げ: 端数あり 税込135円 → 税抜123円', () => {
      const result = calcTaxExcluded(135, 0.10, 'ceil')
      expect(result.priceExcluded).toBe(123)
      expect(result.taxAmount).toBe(12)
    })

    it('四捨五入: 端数あり 税込135円 → 税抜123円', () => {
      // 135 / 1.10 = 122.727... → 四捨五入 → 123
      const result = calcTaxExcluded(135, 0.10, 'round')
      expect(result.priceExcluded).toBe(123)
      expect(result.taxAmount).toBe(12)
    })

    it('0円 → 税抜0円・税0円', () => {
      const result = calcTaxExcluded(0, 0.10, 'floor')
      expect(result.priceExcluded).toBe(0)
      expect(result.taxAmount).toBe(0)
    })
  })

  describe('軽減税率8%', () => {
    it('切り捨て: 税込1080円 → 税抜1000円・税80円', () => {
      const result = calcTaxExcluded(1080, 0.08, 'floor')
      expect(result.priceExcluded).toBe(1000)
      expect(result.taxAmount).toBe(80)
    })

    it('切り捨て: 端数あり 税込132円 → 税抜122円', () => {
      // 132 / 1.08 = 122.222... → 切り捨て → 122
      const result = calcTaxExcluded(132, 0.08, 'floor')
      expect(result.priceExcluded).toBe(122)
      expect(result.taxAmount).toBe(10)
    })

    it('切り上げ: 端数あり 税込132円 → 税抜123円', () => {
      const result = calcTaxExcluded(132, 0.08, 'ceil')
      expect(result.priceExcluded).toBe(123)
      expect(result.taxAmount).toBe(9)
    })
  })
})
