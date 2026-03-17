'use client'

import { useState, useCallback } from 'react'
import { htmlToJsx, jsxToHtml } from '../utils'

type Direction = 'html-to-jsx' | 'jsx-to-html'

export default function HtmlToJsxTool() {
  const [direction, setDirection] = useState<Direction>('html-to-jsx')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleConvert = useCallback(() => {
    const result = direction === 'html-to-jsx' ? htmlToJsx(input) : jsxToHtml(input)
    if (result.ok) {
      setOutput(result.output)
      setError(null)
    } else {
      setOutput('')
      setError(result.error)
    }
  }, [direction, input])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setError(null)
    setCopied(false)
  }, [])

  const handleCopy = useCallback(() => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [output])

  return (
    <div>
      {/* コントロールバー */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
        {/* 方向切り替え */}
        <div style={{ display: 'flex', gap: '4px', marginRight: '0.5rem' }}>
          {([
            { value: 'html-to-jsx', label: 'HTML → JSX' },
            { value: 'jsx-to-html', label: 'JSX → HTML' },
          ] as { value: Direction; label: string }[]).map(opt => (
            <button
              key={opt.value}
              onClick={() => { setDirection(opt.value); setOutput(''); setError(null) }}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                letterSpacing: '0.05em',
                padding: '4px 12px',
                borderRadius: '3px',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                backgroundColor: direction === opt.value ? 'var(--navy)' : 'var(--surface)',
                color: direction === opt.value ? '#fff' : 'var(--ink-mid)',
                transition: 'background 0.15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <ActionButton label="変換" onClick={handleConvert} primary />
          <ActionButton label="クリア" onClick={handleClear} />
          <ActionButton label={copied ? 'コピー済み' : 'コピー'} onClick={handleCopy} disabled={!output} />
        </div>
      </div>

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>
            {direction === 'html-to-jsx' ? '入力 / HTML' : '入力 / JSX'}
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={direction === 'html-to-jsx' ? '<div class="container">\n  <input type="text">\n  <label for="name">名前</label>\n</div>' : '<div className="container">\n  <input type="text" />\n  <label htmlFor="name">名前</label>\n</div>'}
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
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>
            {direction === 'html-to-jsx' ? '出力 / JSX' : '出力 / HTML'}
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
            <code>{output || '// 変換ボタンを押すと結果がここに表示されます'}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

function ActionButton({ label, onClick, primary, disabled }: { label: string; onClick: () => void; primary?: boolean; disabled?: boolean }) {
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
