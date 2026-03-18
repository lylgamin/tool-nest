import { describe, it, expect } from 'vitest'
import { csvToMarkdownTable } from '../utils'

describe('csvToMarkdownTable', () => {
  it('空入力はエラーを返す', () => {
    const r = csvToMarkdownTable('', ',')
    expect(r.ok).toBe(false)
  })

  it('CSVをMarkdownテーブルに変換する', () => {
    const input = 'Name,Age\nAlice,30\nBob,25'
    const r = csvToMarkdownTable(input, ',')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    const lines = r.output.split('\n')
    expect(lines[0]).toBe('| Name | Age |')
    expect(lines[1]).toBe('| --- | --- |')
    expect(lines[2]).toBe('| Alice | 30 |')
    expect(lines[3]).toBe('| Bob | 25 |')
  })

  it('TSVをMarkdownテーブルに変換する', () => {
    const input = 'Name\tAge\nAlice\t30'
    const r = csvToMarkdownTable(input, '\t')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    const lines = r.output.split('\n')
    expect(lines[0]).toBe('| Name | Age |')
    expect(lines[1]).toBe('| --- | --- |')
    expect(lines[2]).toBe('| Alice | 30 |')
  })

  it('セル内の | はエスケープされる', () => {
    const input = 'Header\nA|B'
    const r = csvToMarkdownTable(input, ',')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.output).toContain('A\\|B')
  })

  it('ヘッダー行のみでも動作する', () => {
    const input = 'Col1,Col2'
    const r = csvToMarkdownTable(input, ',')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    const lines = r.output.split('\n')
    expect(lines).toHaveLength(2) // ヘッダー + セパレーター
  })
})
