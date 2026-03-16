'use client'

import { useState, useCallback } from 'react'
import { formatJson, minifyJson, validateJson } from '../utils'

type IndentOption = 2 | 4 | '\t'

const INDENT_LABELS: { value: IndentOption; label: string }[] = [
  { value: 2, label: '2スペース' },
  { value: 4, label: '4スペース' },
  { value: '\t', label: 'タブ' },
]

export default function JsonFormatterTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState<IndentOption>(2)
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)

  const handleFormat = useCallback(() => {
    const indentValue = indent === '\t' ? '\t' : indent
    const result = formatJson(input, indentValue as number)
    if (result.ok) {
      setOutput(result.output)
      setError(null)
      setIsValid(true)
    } else {
      setOutput('')
      setError(result.error)
      setIsValid(false)
    }
  }, [input, indent])

  const handleMinify = useCallback(() => {
    const result = minifyJson(input)
    if (result.ok) {
      setOutput(result.output)
      setError(null)
      setIsValid(true)
    } else {
      setOutput('')
      setError(result.error)
      setIsValid(false)
    }
  }, [input])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setError(null)
    setIsValid(null)
    setCopied(false)
  }, [])

  const handleCopy = useCallback(() => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [output])

  const handleInputChange = useCallback((val: string) => {
    setInput(val)
    if (val.trim() === '') {
      setIsValid(null)
      setError(null)
    } else {
      const v = validateJson(val)
      setIsValid(v.valid)
      setError(v.valid ? null : null) // エラーはボタン押下時のみ表示
    }
  }, [])

  return (
    <div>
      {/* コントロールバー */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1rem',
        alignItems: 'center',
      }}>
        {/* インデント選択 */}
        <div style={{ display: 'flex', gap: '4px', marginRight: '0.5rem' }}>
          {INDENT_LABELS.map(opt => (
            <button
              key={String(opt.value)}
              onClick={() => setIndent(opt.value)}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                letterSpacing: '0.05em',
                padding: '4px 10px',
                borderRadius: '3px',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                backgroundColor: indent === opt.value ? 'var(--navy)' : 'var(--surface)',
                color: indent === opt.value ? '#fff' : 'var(--ink-mid)',
                transition: 'background 0.15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <ActionButton label="整形" onClick={handleFormat} primary />
          <ActionButton label="圧縮" onClick={handleMinify} />
          <ActionButton label="クリア" onClick={handleClear} />
          <ActionButton
            label={copied ? 'コピー済み' : 'コピー'}
            onClick={handleCopy}
            disabled={!output}
          />
        </div>
      </div>

      {/* バリデーション状態 */}
      {isValid !== null && (
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '11px',
          letterSpacing: '0.06em',
          color: isValid ? '#1a7a4a' : '#b83232',
          backgroundColor: isValid ? 'rgba(26,122,74,0.08)' : 'rgba(184,50,50,0.08)',
          border: `1px solid ${isValid ? 'rgba(26,122,74,0.25)' : 'rgba(184,50,50,0.25)'}`,
          borderRadius: '3px',
          padding: '5px 10px',
          marginBottom: '0.75rem',
          display: 'inline-block',
        }}>
          {isValid ? '✓ 有効なJSON' : '✗ 無効なJSON'}
        </div>
      )}

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
            入力 / input
          </label>
          <textarea
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            placeholder={'{\n  "key": "value"\n}'}
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
            出力 / output
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
            <code>{output || '// 整形・圧縮ボタンを押すと結果がここに表示されます'}</code>
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
