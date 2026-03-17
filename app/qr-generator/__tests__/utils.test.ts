import { describe, it, expect } from 'vitest'
import { validateQrInput } from '../utils'

// Note: generateQrSvg uses dynamic import of 'qrcode', test the pure validation function

describe('validateQrInput', () => {
  it('正常な入力はnull', () => {
    expect(validateQrInput('https://example.com')).toBeNull()
    expect(validateQrInput('hello world')).toBeNull()
  })

  it('空文字はエラー', () => {
    expect(validateQrInput('')).toBeTruthy()
    expect(validateQrInput('   ')).toBeTruthy()
  })

  it('2954文字以上はエラー', () => {
    expect(validateQrInput('a'.repeat(2954))).toBeTruthy()
  })

  it('2953文字はOK', () => {
    expect(validateQrInput('a'.repeat(2953))).toBeNull()
  })

  it('日本語はnull（バイト数チェック後）', () => {
    // short Japanese text is fine
    expect(validateQrInput('こんにちは')).toBeNull()
  })
})
