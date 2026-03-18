'use client'

import { useState, useCallback } from 'react'
import { csvToMarkdownTable } from '../utils'
import { useCopy } from '../../_components/useCopy'

type Delimiter = ',' | '\t'

export default function TextToTableTool() {
  const [input, setInput] = useState('')
  const [delimiter, setDelimiter] = useState<Delimiter>(',')
  const [output, setOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { copied, copy } = useCopy()

  const handleConvert = useCallback(() => {
    const result = csvToMarkdownTable(input, delimiter)
    if (result.ok) {
      setOutput(result.output)
      setError(null)
    } else {
      setOutput(null)
      setError(result.error)
    }
  }, [input, delimiter])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput(null)
    setError(null)
  }, [])

  const handleCopy = useCallback(() => {
    if (!output) return
    copy(output)
  }, [output, copy])

  return (
    <div>
      {/* 区切り文字選択 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
        }}>
          区切り文字
        </span>
        <DelimiterButton
          label="カンマ ( , )"
          active={delimiter === ','}
          onClick={() => setDelimiter(',')}
        />
        <DelimiterButton
          label="タブ ( ⇥ )"
          active={delimiter === '\t'}
          onClick={() => setDelimiter('\t')}
        />
      </div>

      {/* 入力エリア */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' }}>
        <label style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
        }}>
          入力 — CSV / TSV
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={'Name,Age,Role\nAlice,30,Engineer\nBob,25,Designer'}
          rows={10}
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

      {/* アクションボタン */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <ActionButton label="変換" onClick={handleConvert} primary />
        <ActionButton label="クリア" onClick={handleClear} />
        {output !== null && (
          <ActionButton
            label={copied ? 'コピー済み ✓' : 'コピー'}
            onClick={handleCopy}
          />
        )}
      </div>

      {/* エラー表示 */}
      {error !== null && (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: '#c85050',
          backgroundColor: 'rgba(200,80,80,0.08)',
          border: '1px solid rgba(200,80,80,0.25)',
          borderRadius: '4px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      {/* 出力エリア */}
      {output !== null && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'var(--ink-light)',
            textTransform: 'uppercase',
          }}>
            出力 — Markdown テーブル
          </label>
          <pre style={{
            backgroundColor: '#111820',
            color: '#a8b8c8',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '13px',
            lineHeight: 1.65,
            padding: '1.25rem 1.5rem',
            borderRadius: '4px',
            overflowX: 'auto',
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}>
            {output}
          </pre>
        </div>
      )}

      {/* 初期状態のメッセージ */}
      {output === null && error === null && (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-faint)',
          textAlign: 'center',
          padding: '2rem',
          border: '1px dashed var(--border-light)',
          borderRadius: '4px',
        }}>
          CSV または TSV テキストを入力し、「変換」ボタンを押してください
        </div>
      )}
    </div>
  )
}

function DelimiterButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '11px',
        letterSpacing: '0.06em',
        padding: '4px 12px',
        borderRadius: '4px',
        border: active ? '1px solid var(--teal)' : '1px solid var(--border)',
        cursor: 'pointer',
        backgroundColor: active ? 'var(--teal-mid)' : 'var(--surface)',
        color: active ? 'var(--teal)' : 'var(--ink-mid)',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
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
