import { describe, it, expect } from 'vitest'
import {
  deduplicateLines,
  sortLines,
  reverseLines,
  addLineNumbers,
  removeEmptyLines,
  trimLines,
} from '../utils'

describe('deduplicateLines', () => {
  it('空文字列の場合は空文字列を返す', () => {
    expect(deduplicateLines('', true)).toBe('')
    expect(deduplicateLines('', false)).toBe('')
  })

  it('重複行を除去する（大文字小文字を区別する）', () => {
    const input = 'apple\nbanana\napple\ncherry'
    expect(deduplicateLines(input, true)).toBe('apple\nbanana\ncherry')
  })

  it('大文字小文字を区別しない場合、大文字・小文字の重複を除去する', () => {
    const input = 'Apple\napple\nBANANA\nbanana'
    expect(deduplicateLines(input, false)).toBe('Apple\nBANANA')
  })

  it('大文字小文字を区別する場合、異なるケースは重複とみなさない', () => {
    const input = 'Apple\napple\nBANANA\nbanana'
    expect(deduplicateLines(input, true)).toBe('Apple\napple\nBANANA\nbanana')
  })

  it('重複がない場合は変化なし', () => {
    const input = 'foo\nbar\nbaz'
    expect(deduplicateLines(input, true)).toBe('foo\nbar\nbaz')
  })

  it('1行のみの場合は変化なし', () => {
    expect(deduplicateLines('hello', true)).toBe('hello')
  })
})

describe('sortLines', () => {
  it('空文字列の場合は空文字列を返す', () => {
    expect(sortLines('', 'asc', true)).toBe('')
    expect(sortLines('', 'desc', false)).toBe('')
  })

  it('昇順ソート（大文字小文字を区別する）', () => {
    const input = 'banana\napple\ncherry'
    expect(sortLines(input, 'asc', true)).toBe('apple\nbanana\ncherry')
  })

  it('降順ソート（大文字小文字を区別する）', () => {
    const input = 'banana\napple\ncherry'
    expect(sortLines(input, 'desc', true)).toBe('cherry\nbanana\napple')
  })

  it('大文字小文字を区別しない昇順ソート', () => {
    const input = 'Cherry\napple\nBanana'
    const result = sortLines(input, 'asc', false)
    // 大文字小文字を無視して apple < banana < cherry の順
    expect(result).toBe('apple\nBanana\nCherry')
  })

  it('大文字小文字を区別しない降順ソート', () => {
    const input = 'Cherry\napple\nBanana'
    const result = sortLines(input, 'desc', false)
    expect(result).toBe('Cherry\nBanana\napple')
  })

  it('1行のみの場合は変化なし', () => {
    expect(sortLines('hello', 'asc', true)).toBe('hello')
    expect(sortLines('hello', 'desc', true)).toBe('hello')
  })
})

describe('reverseLines', () => {
  it('空文字列の場合は空文字列を返す', () => {
    expect(reverseLines('')).toBe('')
  })

  it('行の順序を逆にする', () => {
    const input = 'line1\nline2\nline3'
    expect(reverseLines(input)).toBe('line3\nline2\nline1')
  })

  it('1行のみの場合は変化なし', () => {
    expect(reverseLines('only')).toBe('only')
  })

  it('2行の場合は入れ替わる', () => {
    expect(reverseLines('first\nsecond')).toBe('second\nfirst')
  })
})

describe('addLineNumbers', () => {
  it('空文字列の場合は空文字列を返す', () => {
    expect(addLineNumbers('', 1)).toBe('')
    expect(addLineNumbers('', 0)).toBe('')
  })

  it('start=1 で番号を付ける', () => {
    const input = 'foo\nbar\nbaz'
    expect(addLineNumbers(input, 1)).toBe('1: foo\n2: bar\n3: baz')
  })

  it('start=0 で番号を付ける', () => {
    const input = 'foo\nbar\nbaz'
    expect(addLineNumbers(input, 0)).toBe('0: foo\n1: bar\n2: baz')
  })

  it('1行のみの場合', () => {
    expect(addLineNumbers('hello', 1)).toBe('1: hello')
    expect(addLineNumbers('hello', 5)).toBe('5: hello')
  })
})

describe('removeEmptyLines', () => {
  it('空文字列の場合は空文字列を返す', () => {
    expect(removeEmptyLines('')).toBe('')
  })

  it('空行を除去する', () => {
    const input = 'line1\n\nline2\n\n\nline3'
    expect(removeEmptyLines(input)).toBe('line1\nline2\nline3')
  })

  it('スペースのみの行も除去する', () => {
    const input = 'line1\n   \nline2\n\t\nline3'
    expect(removeEmptyLines(input)).toBe('line1\nline2\nline3')
  })

  it('空行がない場合は変化なし', () => {
    const input = 'foo\nbar\nbaz'
    expect(removeEmptyLines(input)).toBe('foo\nbar\nbaz')
  })

  it('全行が空行の場合は空文字列を返す', () => {
    expect(removeEmptyLines('\n\n\n')).toBe('')
  })
})

describe('trimLines', () => {
  it('空文字列の場合は空文字列を返す', () => {
    expect(trimLines('')).toBe('')
  })

  it('各行の前後の空白を除去する', () => {
    const input = '  hello  \n  world  \n  foo  '
    expect(trimLines(input)).toBe('hello\nworld\nfoo')
  })

  it('タブも除去する', () => {
    const input = '\t\tfoo\t\t\n\tbar\t'
    expect(trimLines(input)).toBe('foo\nbar')
  })

  it('空白がない行は変化なし', () => {
    const input = 'foo\nbar\nbaz'
    expect(trimLines(input)).toBe('foo\nbar\nbaz')
  })

  it('空行はそのまま空行になる', () => {
    const input = 'foo\n\nbar'
    expect(trimLines(input)).toBe('foo\n\nbar')
  })
})
