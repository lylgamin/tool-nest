import { describe, it, expect } from 'vitest'
import { countStats } from '../utils'

describe('countStats', () => {
  it('空文字はすべて0', () => {
    const result = countStats('')
    expect(result.chars).toBe(0)
    expect(result.charsNoSpace).toBe(0)
    expect(result.bytes).toBe(0)
    expect(result.lines).toBe(0)
    expect(result.words).toBe(0)
  })

  it('ASCII文字: 文字数 === バイト数', () => {
    const result = countStats('hello')
    expect(result.chars).toBe(5)
    expect(result.bytes).toBe(5)
  })

  it('日本語: バイト数 > 文字数（UTF-8は3バイト/文字）', () => {
    const result = countStats('日本語')
    expect(result.chars).toBe(3)
    expect(result.bytes).toBe(9) // 3バイト × 3文字
  })

  it('スペース除く文字数が正しい', () => {
    const result = countStats('hello world')
    expect(result.chars).toBe(11)
    expect(result.charsNoSpace).toBe(10)
  })

  it('改行で行数をカウント', () => {
    const result = countStats('line1\nline2\nline3')
    expect(result.lines).toBe(3)
  })

  it('1行テキストの行数は1', () => {
    const result = countStats('single line')
    expect(result.lines).toBe(1)
  })

  it('日本語の単語カウントは空白区切り', () => {
    const result = countStats('日本語 テキスト 処理')
    expect(result.words).toBe(3)
  })

  it('スペースのみは単語数0', () => {
    const result = countStats('   ')
    expect(result.words).toBe(0)
  })
})
