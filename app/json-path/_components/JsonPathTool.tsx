'use client'

import { useState, useCallback } from 'react'
import { queryJsonPath } from '../utils'

const DEFAULT_JSON = `{
  "store": {
    "book": [
      { "title": "JavaScript入門", "price": 1200, "author": "田中太郎" },
      { "title": "TypeScript実践", "price": 2400, "author": "山田花子" },
      { "title": "React完全ガイド", "price": 3200, "author": "佐藤次郎" }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}`

const SAMPLE_QUERIES = [
  { label: '$.store.book[*].title', desc: '全書籍タイトル' },
  { label: '$..price', desc: '全価格（再帰）' },
  { label: '$.store.bicycle', desc: '自転車オブジェクト' },
  { label: '$.store.book[0].author', desc: '最初の著者' },
  { label: '$.store.book[-1].title', desc: '最後の書籍タイトル' },
]

export default function JsonPathTool() {
  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON)
  const [pathInput, setPathInput] = useState('$.store.book[*].title')
  const [output, setOutput] = useState<string | null>(null)
  const [matchCount, setMatchCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRun = useCallback(() => {
    const result = queryJsonPath(jsonInput, pathInput)
    if (result.ok) {
      setOutput(result.results.map(r => JSON.stringify(r, null, 2)).join('\n'))
      setMatchCount(result.count)
      setError(null)
    } else {
      setOutput(null)
      setMatchCount(null)
      setError(result.error)
    }
  }, [jsonInput, pathInput])

  const handleClear = useCallback(() => {
    setJsonInput('')
    setPathInput('')
    setOutput(null)
    setMatchCount(null)
    setError(null)
  }, [])

  const handleSampleQuery = useCallback((query: string) => {
    setPathInput(query)
    setOutput(null)
    setMatchCount(null)
    setError(null)
  }, [])

  return (
    <div>
      {/* JSONテキストエリア */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}>
          JSON 入力
        </label>
        <textarea
          value={jsonInput}
          onChange={e => setJsonInput(e.target.value)}
          rows={14}
          spellCheck={false}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '13px',
            color: 'var(--ink)',
            resize: 'vertical',
            outline: 'none',
            lineHeight: 1.65,
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        />
      </div>

      {/* パスクエリ入力 */}
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}>
          JSONPath クエリ
        </label>
        <input
          type="text"
          value={pathInput}
          onChange={e => setPathInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleRun() }}
          placeholder="$.store.book[*].title"
          style={{
            width: '100%',
            padding: '10px 14px',
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

      {/* サンプルクエリボタン */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.08em',
          color: 'var(--ink-faint)',
          marginBottom: '6px',
        }}>
          サンプルクエリ
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {SAMPLE_QUERIES.map(sq => (
            <button
              key={sq.label}
              onClick={() => handleSampleQuery(sq.label)}
              title={sq.desc}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                letterSpacing: '0.04em',
                padding: '4px 10px',
                borderRadius: '3px',
                border: '1px solid var(--border-light)',
                cursor: 'pointer',
                backgroundColor: pathInput === sq.label ? 'var(--teal-mid)' : 'var(--surface)',
                color: pathInput === sq.label ? 'var(--teal)' : 'var(--ink-mid)',
                transition: 'background 0.15s',
              }}
            >
              {sq.label}
            </button>
          ))}
        </div>
      </div>

      {/* アクションボタン */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          onClick={handleRun}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '12px',
            letterSpacing: '0.06em',
            padding: '8px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: 'var(--navy)',
            color: '#fff',
            transition: 'background 0.15s',
          }}
        >
          実行
        </button>
        <button
          onClick={handleClear}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '12px',
            letterSpacing: '0.06em',
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            backgroundColor: 'var(--surface)',
            color: 'var(--ink-mid)',
          }}
        >
          クリア
        </button>
      </div>

      {/* エラー表示 */}
      {error && (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: '#b83232',
          backgroundColor: 'rgba(184,50,50,0.06)',
          border: '1px solid rgba(184,50,50,0.2)',
          borderRadius: '4px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          lineHeight: 1.5,
        }}>
          {error}
        </div>
      )}

      {/* 結果表示（ターミナルスタイル） */}
      {output !== null && !error && (
        <div style={{
          backgroundColor: '#111820',
          borderRadius: '6px',
          overflow: 'hidden',
        }}>
          {/* ターミナルヘッダー */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f57', display: 'inline-block' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#febc2e', display: 'inline-block' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#28c840', display: 'inline-block' }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11px',
              color: matchCount === 0 ? '#9e9084' : '#2ec880',
              letterSpacing: '0.06em',
            }}>
              {matchCount} 件マッチ
            </span>
          </div>
          {/* 結果本体 */}
          <pre style={{
            margin: 0,
            padding: '1rem 1.25rem',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '13px',
            color: matchCount === 0 ? '#4a5a6a' : '#a8b8c8',
            lineHeight: 1.65,
            overflowX: 'auto',
            whiteSpace: 'pre',
            maxHeight: '320px',
            overflowY: 'auto',
          }}>
            <code>
              {matchCount === 0
                ? '// マッチする結果がありませんでした'
                : output}
            </code>
          </pre>
        </div>
      )}
    </div>
  )
}
