'use client'

import { useState, useMemo } from 'react'
import { searchPorts } from '../data'
import type { PortEntry } from '../data'

const CATEGORIES: Array<{ value: string; label: string }> = [
  { value: '', label: '全て' },
  { value: 'web', label: 'Web' },
  { value: 'email', label: 'Email' },
  { value: 'database', label: 'Database' },
  { value: 'remote', label: 'Remote' },
  { value: 'file', label: 'File' },
  { value: 'security', label: 'Security' },
  { value: 'dns', label: 'DNS' },
  { value: 'other', label: 'Other' },
]

const CATEGORY_COLORS: Record<string, string> = {
  web: '#63a4d8',
  email: '#e8a040',
  database: '#2ec880',
  remote: '#d04040',
  file: '#a87cd0',
  security: '#e85050',
  dns: '#4ab8b8',
  other: 'var(--ink-light)',
}

const PROTOCOL_COLORS: Record<string, string> = {
  TCP: '#63a4d8',
  UDP: '#e8a040',
  'TCP/UDP': '#2ec880',
}

function isWellKnown(port: number) {
  return port <= 1023
}

export default function PortNumbersClient() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const filtered = useMemo(
    () => searchPorts(query, selectedCategory),
    [query, selectedCategory]
  )

  return (
    <div>
      {/* 検索ボックス */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ポート番号・サービス名・説明で検索..."
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
          const active = selectedCategory === cat.value
          return (
            <button
              key={cat.value || 'all'}
              onClick={() => setSelectedCategory(cat.value)}
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
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* 件数表示 */}
      <div style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '11px',
        color: 'var(--ink-light)',
        letterSpacing: '0.08em',
        marginBottom: '1rem',
      }}>
        {filtered.length} 件
      </div>

      {/* テーブル */}
      {filtered.length === 0 ? (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-faint)',
          textAlign: 'center',
          padding: '2rem 0',
        }}>
          該当するポートが見つかりません
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-noto-sans), sans-serif',
            fontSize: '13px',
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={thStyle}>ポート番号</th>
                <th style={thStyle}>プロトコル</th>
                <th style={thStyle}>サービス</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>説明</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry: PortEntry) => {
                const catColor = CATEGORY_COLORS[entry.category] ?? 'var(--ink-light)'
                return (
                  <tr
                    key={`${entry.port}-${entry.protocol}`}
                    style={{ borderBottom: '1px solid var(--border-light)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--navy-light)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor = ''
                    }}
                  >
                    {/* ポート番号 */}
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <span style={{
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: catColor,
                      }}>
                        {entry.port}
                      </span>
                      {isWellKnown(entry.port) && (
                        <span style={{
                          display: 'inline-block',
                          marginLeft: '6px',
                          fontFamily: 'var(--font-jetbrains), monospace',
                          fontSize: '9px',
                          letterSpacing: '0.1em',
                          color: 'var(--ink-faint)',
                          border: '1px solid var(--border-light)',
                          borderRadius: '2px',
                          padding: '1px 4px',
                          verticalAlign: 'middle',
                        }}>
                          WK
                        </span>
                      )}
                    </td>
                    {/* プロトコル */}
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={{
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: PROTOCOL_COLORS[entry.protocol] ?? 'var(--ink-mid)',
                        letterSpacing: '0.05em',
                      }}>
                        {entry.protocol}
                      </span>
                    </td>
                    {/* サービス名 */}
                    <td style={tdStyle}>
                      <span style={{
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: '12px',
                        color: 'var(--ink)',
                        fontWeight: 500,
                      }}>
                        {entry.service}
                      </span>
                    </td>
                    {/* 説明 */}
                    <td style={{ ...tdStyle, color: 'var(--ink-mid)', lineHeight: 1.5 }}>
                      {entry.description}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: '10px',
  letterSpacing: '0.12em',
  color: 'var(--ink-light)',
  textTransform: 'uppercase',
  textAlign: 'center',
  whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  verticalAlign: 'middle',
}
