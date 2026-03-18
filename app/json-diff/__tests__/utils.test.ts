import { describe, it, expect } from 'vitest'
import { diffJson } from '../utils'

describe('diffJson', () => {
  it('同一オブジェクト → unchanged のみ', () => {
    const result = diffJson('{"a":1,"b":"hello"}', '{"a":1,"b":"hello"}')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.output.every(e => e.type === 'unchanged')).toBe(true)
    expect(result.output).toHaveLength(2)
  })

  it('キー追加 → added エントリ', () => {
    const result = diffJson('{"a":1}', '{"a":1,"b":2}')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const added = result.output.filter(e => e.type === 'added')
    expect(added).toHaveLength(1)
    expect(added[0].path).toBe('b')
    expect(added[0].right).toBe(2)
  })

  it('キー削除 → removed エントリ', () => {
    const result = diffJson('{"a":1,"b":2}', '{"a":1}')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const removed = result.output.filter(e => e.type === 'removed')
    expect(removed).toHaveLength(1)
    expect(removed[0].path).toBe('b')
    expect(removed[0].left).toBe(2)
  })

  it('値変更 → changed エントリ', () => {
    const result = diffJson('{"a":1}', '{"a":99}')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const changed = result.output.filter(e => e.type === 'changed')
    expect(changed).toHaveLength(1)
    expect(changed[0].path).toBe('a')
    expect(changed[0].left).toBe(1)
    expect(changed[0].right).toBe(99)
  })

  it('ネストしたオブジェクト', () => {
    const left = JSON.stringify({ outer: { inner: 'old', keep: true } })
    const right = JSON.stringify({ outer: { inner: 'new', keep: true } })
    const result = diffJson(left, right)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const changed = result.output.filter(e => e.type === 'changed')
    expect(changed).toHaveLength(1)
    expect(changed[0].path).toBe('outer.inner')
    expect(changed[0].left).toBe('old')
    expect(changed[0].right).toBe('new')
    const unchanged = result.output.filter(e => e.type === 'unchanged')
    expect(unchanged.some(e => e.path === 'outer.keep')).toBe(true)
  })

  it('配列の変更', () => {
    const result = diffJson('[1,2,3]', '[1,2,99]')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const changed = result.output.filter(e => e.type === 'changed')
    expect(changed).toHaveLength(1)
    expect(changed[0].path).toBe('[2]')
    expect(changed[0].left).toBe(3)
    expect(changed[0].right).toBe(99)
  })

  it('配列への要素追加', () => {
    const result = diffJson('[1,2]', '[1,2,3]')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const added = result.output.filter(e => e.type === 'added')
    expect(added).toHaveLength(1)
    expect(added[0].path).toBe('[2]')
    expect(added[0].right).toBe(3)
  })

  it('配列からの要素削除', () => {
    const result = diffJson('[1,2,3]', '[1,2]')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const removed = result.output.filter(e => e.type === 'removed')
    expect(removed).toHaveLength(1)
    expect(removed[0].path).toBe('[2]')
    expect(removed[0].left).toBe(3)
  })

  it('不正JSON入力 → error', () => {
    const result = diffJson('{not valid json}', '{}')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toMatch(/JSONパースエラー/)
  })

  it('右側が不正JSON → error', () => {
    const result = diffJson('{}', '{bad}')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toMatch(/JSONパースエラー/)
  })

  it('型が変わる場合 → changed エントリ', () => {
    const result = diffJson('{"a":1}', '{"a":"1"}')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const changed = result.output.filter(e => e.type === 'changed')
    expect(changed).toHaveLength(1)
    expect(changed[0].left).toBe(1)
    expect(changed[0].right).toBe('1')
  })

  it('オブジェクトから配列への型変更 → changed エントリ', () => {
    const result = diffJson('{"a":{}}', '{"a":[]}')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const changed = result.output.filter(e => e.type === 'changed')
    expect(changed).toHaveLength(1)
    expect(changed[0].path).toBe('a')
  })
})
