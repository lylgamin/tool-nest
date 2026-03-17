import { describe, it, expect } from 'vitest'
import { generateTypes } from '../utils'

describe('generateTypes', () => {
  it('シンプルなオブジェクト → interface', () => {
    const r = generateTypes('{"id": 1, "name": "Alice"}')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.output).toContain('interface Root')
      expect(r.output).toContain('id: number')
      expect(r.output).toContain('name: string')
    }
  })

  it('type スタイルを生成', () => {
    const r = generateTypes('{"active": true}', 'User', 'type')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.output).toContain('type User =')
      expect(r.output).toContain('active: boolean')
    }
  })

  it('ネストされたオブジェクト', () => {
    const r = generateTypes('{"user": {"id": 1, "name": "Bob"}}')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.output).toContain('user:')
      expect(r.output).toContain('id: number')
      expect(r.output).toContain('name: string')
    }
  })

  it('配列を含むオブジェクト', () => {
    const r = generateTypes('{"tags": ["a","b","c"]}')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.output).toContain('tags: string[]')
    }
  })

  it('ルートが配列の場合', () => {
    const r = generateTypes('[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.output).toContain('RootList')
      expect(r.output).toContain('Root[]')
    }
  })

  it('null値 → optional', () => {
    const r = generateTypes('{"value": null}')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).toContain('null')
  })

  it('空文字でエラー', () => {
    expect(generateTypes('').ok).toBe(false)
  })

  it('不正なJSONでエラー', () => {
    expect(generateTypes('{invalid}').ok).toBe(false)
  })

  it('カスタムルート名', () => {
    const r = generateTypes('{"id": 1}', 'UserResponse')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).toContain('UserResponse')
  })
})
