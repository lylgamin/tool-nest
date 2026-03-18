'use client'

import { useState, useCallback } from 'react'
import { generateJsonSchemaFromString } from '../utils'
import { useCopy } from '../../_components/useCopy'

export default function JsonSchemaTool() {
  const [input, setInput] = useState('')
  const [title, setTitle] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { copied, copy } = useCopy()

  const handleGenerate = useCallback(() => {
    const result = generateJsonSchemaFromString(input, title.trim() || undefined)
    if (result.ok) {
      setOutput(result.output)
      setError(null)
    } else {
      setOutput('')
      setError(result.error)
    }
  }, [input, title])

  const handleClear = useCallback(() => {
    setInput('')
    setTitle('')
    setOutput('')
    setError(null)
  }, [])

  const handleCopy = useCallback(() => {
    if (!output) return
    copy(output)
  }, [output, copy])

  return (
    <div>
      {/* タイトル入力 */}
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
          スキーマタイトル（オプション）/ title
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="例: UserProfile"
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '13px',
            color: 'var(--ink)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        />
      </div>

      {/* コントロールバー */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1rem',
        alignItems: 'center',
      }}>
        <ActionButton label="スキーマ生成" onClick={handleGenerate} primary />
        <ActionButton label="クリア" onClick={handleClear} />
        <ActionButton
          label={copied ? 'コピー済み' : 'コピー'}
          onClick={handleCopy}
          disabled={!output}
        />
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: '#b83232',
          backgroundColor: 'rgba(184,50,50,0.06)',
          border: '1px solid rgba(184,50,50,0.2)',
          borderRadius: '4px',
          padding: '0.75rem 1rem',
          marginBottom: '0.75rem',
          lineHeight: 1.5,
        }}>
          {error}
        </div>
      )}

      {/* エディターレイアウト: 左入力・右出力 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
      }}>
        {/* 入力 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'var(--ink-light)',
            textTransform: 'uppercase',
          }}>
            JSON入力 / input
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={'{\n  "name": "Alice",\n  "age": 30,\n  "active": true\n}'}
            rows={18}
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
              tabSize: 2,
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>

        {/* 出力 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'var(--ink-light)',
            textTransform: 'uppercase',
          }}>
            JSON Schema出力 / output
          </label>
          <pre style={{
            margin: 0,
            padding: '1rem',
            backgroundColor: '#111820',
            borderRadius: '4px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '13px',
            color: output ? '#a8b8c8' : '#4a5a6a',
            lineHeight: 1.65,
            overflowX: 'auto',
            overflowY: 'auto',
            minHeight: '18lh',
            whiteSpace: 'pre',
            boxSizing: 'border-box',
          }}>
            <code>{output || '// 「スキーマ生成」ボタンを押すと結果がここに表示されます'}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

function ActionButton({
  label,
  onClick,
  primary,
  disabled,
}: {
  label: string
  onClick: () => void
  primary?: boolean
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '12px',
        letterSpacing: '0.06em',
        padding: '6px 16px',
        borderRadius: '4px',
        border: primary ? 'none' : '1px solid var(--border)',
        cursor: disabled ? 'default' : 'pointer',
        backgroundColor: primary ? 'var(--navy)' : 'var(--surface)',
        color: primary ? '#fff' : disabled ? 'var(--ink-faint)' : 'var(--ink-mid)',
        opacity: disabled ? 0.6 : 1,
        transition: 'background 0.15s',
      }}
    >
      {label}
    </button>
  )
}
