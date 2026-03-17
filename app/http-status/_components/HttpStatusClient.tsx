'use client'

import { useState, useMemo } from 'react'
import { searchHttpStatus, groupByCategory } from '../utils'

const CATEGORIES = ['', '1xx', '2xx', '3xx', '4xx', '5xx'] as const
type Category = typeof CATEGORIES[number]

const CATEGORY_LABELS: Record<string, string> = {
  '': '全て',
  '1xx': '1xx 情報',
  '2xx': '2xx 成功',
  '3xx': '3xx リダイレクト',
  '4xx': '4xx クライアントエラー',
  '5xx': '5xx サーバーエラー',
}

const CATEGORY_COLORS: Record<string, string> = {
  '1xx': 'var(--ink-faint)',
  '2xx': '#2ec880',
  '3xx': '#63a4d8',
  '4xx': '#e8a040',
  '5xx': '#d04040',
}

export default function HttpStatusClient() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category>('')

  const filtered = useMemo(() => {
    const searched = searchHttpStatus(query)
    if (!selectedCategory) return searched
    return searched.filter(s => s.category === selectedCategory)
  }, [query, selectedCategory])

  const grouped = useMemo(() => groupByCategory(filtered), [filtered])

  const categoryOrder = ['1xx', '2xx', '3xx', '4xx', '5xx']

  return (
    <div>
      {/* 検索入力 */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="コード番号・キーワードで検索..."
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontFamily: 'var(--font-noto-sans), sans-serif',
            fontSize: '14px',
            color: 'var(--ink)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        />
      </div>

      {/* カテゴリフィルター */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
        {CATEGORIES.map(cat => {
          const active = selectedCategory === cat
          return (
            <button
              key={cat || 'all'}
              onClick={() => setSelectedCategory(cat)}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                letterSpacing: '0.06em',
                padding: '5px 12px',
                border: active ? '1px solid var(--teal)' : '1px solid var(--border)',
                borderRadius: '3px',
                background: active ? 'var(--teal-mid)' : 'var(--surface-alt)',
                color: active ? 'var(--teal)' : 'var(--ink-mid)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          )
        })}
      </div>

      {/* 結果件数 */}
      <div style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '11px',
        color: 'var(--ink-light)',
        letterSpacing: '0.08em',
        marginBottom: '1.25rem',
      }}>
        {filtered.length} 件
      </div>

      {/* コードカード一覧（カテゴリ別） */}
      {filtered.length === 0 ? (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-faint)',
          textAlign: 'center',
          padding: '2rem 0',
        }}>
          該当するステータスコードが見つかりません
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {categoryOrder.map(cat => {
            const codes = grouped[cat]
            if (!codes || codes.length === 0) return null
            const borderColor = CATEGORY_COLORS[cat]
            return (
              <div key={cat}>
                <div style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  color: borderColor,
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}>
                  {cat} — {CATEGORY_LABELS[cat].replace(`${cat} `, '')}
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '0.75rem',
                }}>
                  {codes.map(status => (
                    <div
                      key={status.code}
                      style={{
                        backgroundColor: 'var(--surface-alt)',
                        border: '1px solid var(--border-light)',
                        borderLeft: `3px solid ${borderColor}`,
                        borderRadius: '4px',
                        padding: '1rem 1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.625rem', marginBottom: '4px' }}>
                        <span style={{
                          fontFamily: 'var(--font-jetbrains), monospace',
                          fontSize: '22px',
                          fontWeight: 600,
                          color: borderColor,
                          lineHeight: 1,
                        }}>
                          {status.code}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-jetbrains), monospace',
                          fontSize: '12px',
                          color: 'var(--ink-mid)',
                        }}>
                          {status.name}
                        </span>
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-noto-sans), sans-serif',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--ink)',
                        marginBottom: '6px',
                      }}>
                        {status.nameJa}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-noto-sans), sans-serif',
                        fontSize: '12px',
                        color: 'var(--ink-mid)',
                        lineHeight: 1.6,
                      }}>
                        {status.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
