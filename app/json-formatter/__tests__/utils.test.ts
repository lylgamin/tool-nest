import { describe, it, expect } from 'vitest'
import { formatJson, minifyJson, validateJson } from '../utils'

describe('formatJson', () => {
  it('正常なJSONが整形される', () => {
    const result = formatJson('{"a":1,"b":2}')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.output).toBe('{\n  "a": 1,\n  "b": 2\n}')
    }
  })

  it('不正なJSONでエラーを返す', () => {
    const result = formatJson('{invalid}')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('JSONの解析に失敗しました')
    }
  })

  it('indent=4が機能する', () => {
    const result = formatJson('{"x":1}', 4)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.output).toBe('{\n    "x": 1\n}')
    }
  })

  it('ネストされたオブジェクトが整形される', () => {
    const input = '{"a":{"b":{"c":42}}}'
    const result = formatJson(input)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.output).toContain('"a"')
      expect(result.output).toContain('"b"')
      expect(result.output).toContain('"c": 42')
      // indentation present
      expect(result.output).toMatch(/^\{/)
    }
  })
})

describe('minifyJson', () => {
  it('整形済みJSONが圧縮される', () => {
    const input = '{\n  "a": 1,\n  "b": 2\n}'
    const result = minifyJson(input)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.output).toBe('{"a":1,"b":2}')
    }
  })

  it('不正なJSONでエラーを返す', () => {
    const result = minifyJson('[1,2,}')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('JSONの解析に失敗しました')
    }
  })
})

describe('validateJson', () => {
  it('正常なJSONでvalid: true', () => {
    const result = validateJson('{"key":"value"}')
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('不正なJSONでvalid: false + error', () => {
    const result = validateJson('{bad json}')
    expect(result.valid).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('空文字でvalid: false', () => {
    const result = validateJson('')
    expect(result.valid).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('数値はvalidなJSON', () => {
    expect(validateJson('42').valid).toBe(true)
  })

  it('配列はvalidなJSON', () => {
    expect(validateJson('[1,2,3]').valid).toBe(true)
  })

  it('booleanはvalidなJSON', () => {
    expect(validateJson('true').valid).toBe(true)
    expect(validateJson('false').valid).toBe(true)
  })
})
