import { describe, it, expect } from 'vitest'
import { diffLines } from '../utils'

describe('diffLines', () => {
  it('両方空文字列の場合は空配列を返す', () => {
    expect(diffLines('', '')).toEqual([])
  })

  it('追加のみのケース（旧が空、新に行あり）', () => {
    const result = diffLines('', 'hello\nworld')
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ kind: 'added', lineOld: null, lineNew: 1, content: 'hello' })
    expect(result[1]).toMatchObject({ kind: 'added', lineOld: null, lineNew: 2, content: 'world' })
  })

  it('削除のみのケース（旧に行あり、新が空）', () => {
    const result = diffLines('hello\nworld', '')
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ kind: 'removed', lineOld: 1, lineNew: null, content: 'hello' })
    expect(result[1]).toMatchObject({ kind: 'removed', lineOld: 2, lineNew: null, content: 'world' })
  })

  it('変更のあるケース（一部の行が異なる）', () => {
    const result = diffLines('foo\nbar\nbaz', 'foo\nQUX\nbaz')
    const kinds = result.map(l => l.kind)
    // 'foo' と 'baz' は equal、'bar' は removed、'QUX' は added
    expect(kinds).toContain('equal')
    expect(kinds).toContain('removed')
    expect(kinds).toContain('added')

    const removed = result.filter(l => l.kind === 'removed')
    const added = result.filter(l => l.kind === 'added')
    expect(removed[0].content).toBe('bar')
    expect(added[0].content).toBe('QUX')
  })

  it('同一テキストの場合は全行 equal', () => {
    const text = 'line1\nline2\nline3'
    const result = diffLines(text, text)
    expect(result).toHaveLength(3)
    result.forEach(line => {
      expect(line.kind).toBe('equal')
    })
  })

  it('equal 行の行番号が正しく設定される', () => {
    const result = diffLines('a\nb\nc', 'a\nb\nc')
    expect(result[0]).toMatchObject({ kind: 'equal', lineOld: 1, lineNew: 1, content: 'a' })
    expect(result[1]).toMatchObject({ kind: 'equal', lineOld: 2, lineNew: 2, content: 'b' })
    expect(result[2]).toMatchObject({ kind: 'equal', lineOld: 3, lineNew: 3, content: 'c' })
  })

  it('1行のみ変更（旧テキスト行番号と新テキスト行番号が正しい）', () => {
    const result = diffLines('alpha', 'beta')
    expect(result).toHaveLength(2)
    const removed = result.find(l => l.kind === 'removed')
    const added = result.find(l => l.kind === 'added')
    expect(removed).toMatchObject({ lineOld: 1, lineNew: null, content: 'alpha' })
    expect(added).toMatchObject({ lineOld: null, lineNew: 1, content: 'beta' })
  })
})
