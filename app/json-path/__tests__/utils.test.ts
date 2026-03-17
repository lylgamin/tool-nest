import { describe, it, expect } from 'vitest'
import { queryJsonPath } from '../utils'

const sampleJson = JSON.stringify({
  store: {
    book: [
      { title: 'JavaScript入門', price: 1200, author: '田中太郎' },
      { title: 'TypeScript実践', price: 2400, author: '山田花子' },
      { title: 'React完全ガイド', price: 3200, author: '佐藤次郎' },
    ],
    bicycle: {
      color: 'red',
      price: 19.95,
    },
  },
})

describe('queryJsonPath — 基本アクセス', () => {
  it('$.store.book[0].title → "JavaScript入門"', () => {
    const result = queryJsonPath(sampleJson, '$.store.book[0].title')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.results).toEqual(['JavaScript入門'])
      expect(result.count).toBe(1)
    }
  })

  it('$.store.book[-1].title → "React完全ガイド"（後ろからのインデックス）', () => {
    const result = queryJsonPath(sampleJson, '$.store.book[-1].title')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.results).toEqual(['React完全ガイド'])
    }
  })

  it('$.store.bicycle.color → "red"', () => {
    const result = queryJsonPath(sampleJson, '$.store.bicycle.color')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.results).toEqual(['red'])
    }
  })
})

describe('queryJsonPath — ワイルドカード', () => {
  it('$.store.book[*].title → 3件', () => {
    const result = queryJsonPath(sampleJson, '$.store.book[*].title')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.count).toBe(3)
      expect(result.results).toEqual(['JavaScript入門', 'TypeScript実践', 'React完全ガイド'])
    }
  })

  it('$.store.book[*].price → 3件の価格', () => {
    const result = queryJsonPath(sampleJson, '$.store.book[*].price')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.count).toBe(3)
      expect(result.results).toEqual([1200, 2400, 3200])
    }
  })
})

describe('queryJsonPath — 再帰検索（..）', () => {
  it('$..price → 4件（book3冊＋bicycle）', () => {
    const result = queryJsonPath(sampleJson, '$..price')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.count).toBe(4)
      expect(result.results).toContain(1200)
      expect(result.results).toContain(2400)
      expect(result.results).toContain(3200)
      expect(result.results).toContain(19.95)
    }
  })

  it('$..title → 3件', () => {
    const result = queryJsonPath(sampleJson, '$..title')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.count).toBe(3)
    }
  })
})

describe('queryJsonPath — ルートアクセス', () => {
  it('$ のみ → ルートオブジェクト1件', () => {
    const result = queryJsonPath(sampleJson, '$')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.count).toBe(1)
    }
  })

  it('ルートが配列の場合 $[*] → 全要素', () => {
    const arrJson = JSON.stringify([1, 2, 3])
    const result = queryJsonPath(arrJson, '$[*]')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.results).toEqual([1, 2, 3])
      expect(result.count).toBe(3)
    }
  })
})

describe('queryJsonPath — エラーケース', () => {
  it('無効なJSON → ok: false', () => {
    const result = queryJsonPath('{invalid json}', '$.foo')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('JSONの解析に失敗しました')
    }
  })

  it('空文字JSON → ok: false', () => {
    const result = queryJsonPath('', '$.foo')
    expect(result.ok).toBe(false)
  })

  it('$ で始まらないパス → ok: false', () => {
    const result = queryJsonPath(sampleJson, 'store.book')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('$')
    }
  })

  it('存在しないパス → 0件', () => {
    const result = queryJsonPath(sampleJson, '$.nonexistent.path')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.count).toBe(0)
      expect(result.results).toEqual([])
    }
  })

  it('閉じられていない括弧 → ok: false', () => {
    const result = queryJsonPath(sampleJson, '$.store.book[0')
    expect(result.ok).toBe(false)
  })
})
