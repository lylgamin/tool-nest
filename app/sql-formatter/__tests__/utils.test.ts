import { describe, it, expect } from 'vitest'
import { formatSql, minifySql } from '../utils'

describe('formatSql', () => {
  it('SELECT文をフォーマット', () => {
    const r = formatSql('select id, name from users where id = 1')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.output).toContain('SELECT')
      expect(r.output).toContain('FROM')
      expect(r.output).toContain('WHERE')
    }
  })

  it('キーワードを大文字化', () => {
    const r = formatSql('select * from foo')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.output).toMatch(/SELECT/)
      expect(r.output).toMatch(/FROM/)
    }
  })

  it('空文字でエラー', () => {
    const r = formatSql('   ')
    expect(r.ok).toBe(false)
  })

  it('JOIN句', () => {
    const r = formatSql('select a.id from a left join b on a.id = b.a_id')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.output).toContain('LEFT JOIN')
      expect(r.output).toContain('ON')
    }
  })

  it('ORDER BY', () => {
    const r = formatSql('select id from t order by id desc')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).toContain('ORDER BY')
  })
})

describe('minifySql', () => {
  it('改行・スペースを圧縮', () => {
    const r = minifySql('SELECT\n  id,\n  name\nFROM\n  users')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).not.toContain('\n')
  })

  it('コメントを除去', () => {
    const r = minifySql('SELECT id -- comment\nFROM t')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).not.toContain('comment')
  })

  it('空文字でエラー', () => {
    const r = minifySql('')
    expect(r.ok).toBe(false)
  })
})
