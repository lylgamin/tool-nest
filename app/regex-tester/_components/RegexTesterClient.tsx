'use client'

import { useState, useMemo } from 'react'
import { testRegex, type RegexTestResult } from '../utils'

type FlagKey = 'g' | 'i' | 'm'

const FLAG_LABELS: { key: FlagKey; label: string; description: string }[] = [
  { key: 'g', label: 'g', description: 'グローバル（全マッチ）' },
  { key: 'i', label: 'i', description: '大文字小文字無視' },
  { key: 'm', label: 'm', description: '複数行モード' },
]

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState<Set<FlagKey>>(new Set(['g']))
  const [input, setInput] = useState('')

  const flagString = [...flags].join('')
  const result: RegexTestResult = useMemo(
    () => testRegex(pattern, flagString, input),
    [pattern, flagString, input]
  )

  const toggleFlag = (key: FlagKey) => {
    setFlags(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleClear = () => {
    setPattern('')
    setFlags(new Set(['g']))
    setInput('')
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-jetbrains), monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    color: 'var(--ink-light)',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px',
  }

  return (
    <div>
      {/* パターン入力 */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>パターン</label>
        <input
          type="text"
          value={pattern}
          onChange={e => setPattern(e.target.value)}
          placeholder="/pattern/flags"
          spellCheck={false}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '14px',
            color: 'var(--ink)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        />
      </div>

      {/* フラグチェックボックス */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>フラグ</label>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {FLAG_LABELS.map(({ key, label, description }) => (
            <label key={key} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontFamily: 'var(--font-noto-sans), sans-serif',
              fontSize: '13px',
              color: 'var(--ink-mid)',
              userSelect: 'none',
            }}>
              <input
                type="checkbox"
                checked={flags.has(key)}
                onChange={() => toggleFlag(key)}
                style={{ accentColor: 'var(--teal)', width: '15px', height: '15px' }}
              />
              <code style={{ fontFamily: 'var(--font-jetbrains), monospace', color: 'var(--teal)' }}>{label}</code>
              {description}
            </label>
          ))}
        </div>
      </div>

      {/* テスト対象テキスト */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>テスト対象テキスト</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="マッチを確認したいテキストを入力..."
          rows={8}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontFamily: 'var(--font-noto-sans), sans-serif',
            fontSize: '14px',
            color: 'var(--ink)',
            resize: 'vertical',
            outline: 'none',
            lineHeight: 1.7,
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        />
      </div>

      {/* クリアボタン */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button
          onClick={handleClear}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: 'var(--ink-light)',
            background: 'none',
            border: '1px solid var(--border-light)',
            borderRadius: '3px',
            padding: '5px 12px',
            cursor: 'pointer',
          }}
        >
          クリア
        </button>
      </div>

      {/* 結果エリア */}
      <ResultArea result={result} />
    </div>
  )
}

function ResultArea({ result }: { result: RegexTestResult }) {
  if (!result.ok) {
    return (
      <div style={{
        backgroundColor: 'rgba(180,40,40,0.07)',
        border: '1px solid rgba(180,40,40,0.25)',
        borderRadius: '4px',
        padding: '0.75rem 1rem',
        fontFamily: 'var(--font-noto-sans), sans-serif',
        fontSize: '13px',
        color: '#b42828',
      }}>
        {result.error}
      </div>
    )
  }

  if (result.matches.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border-light)',
        borderRadius: '4px',
        padding: '1rem 1.25rem',
        fontFamily: 'var(--font-noto-sans), sans-serif',
        fontSize: '13px',
        color: 'var(--ink-light)',
        textAlign: 'center',
      }}>
        マッチなし
      </div>
    )
  }

  return (
    <div>
      {/* マッチ件数バッジ */}
      <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
        }}>マッチ数</span>
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '13px',
          color: 'var(--teal)',
          backgroundColor: 'var(--teal-mid)',
          border: '1px solid rgba(31,107,114,0.2)',
          borderRadius: '3px',
          padding: '2px 8px',
        }}>
          {result.totalCount}
        </span>
      </div>

      {/* マッチ一覧 */}
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {result.matches.map((m, i) => (
          <div key={i} style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border-light)',
            borderRadius: '4px',
            padding: '0.75rem 1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: m.groups.length > 0 ? '0.5rem' : 0 }}>
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10px',
                color: 'var(--ink-faint)',
                letterSpacing: '0.08em',
                minWidth: '60px',
              }}>
                index: {m.index}
              </span>
              <code style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '13px',
                color: 'var(--ink)',
                backgroundColor: 'var(--navy-light)',
                padding: '2px 6px',
                borderRadius: '3px',
                wordBreak: 'break-all',
              }}>
                {m.match || '(空文字列)'}
              </code>
            </div>
            {m.groups.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {m.groups.map((g, gi) => (
                  <span key={gi} style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '11px',
                    color: 'var(--ink-mid)',
                    backgroundColor: 'var(--surface-alt)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '3px',
                    padding: '2px 7px',
                  }}>
                    ${gi + 1}: {g ?? 'undefined'}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
