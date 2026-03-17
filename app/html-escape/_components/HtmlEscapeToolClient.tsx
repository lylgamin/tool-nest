'use client'

import { useState } from 'react'
import { escapeHtml, unescapeHtml } from '../utils'

type Tab = 'escape' | 'unescape'

export default function HtmlEscapeToolClient() {
  const [tab, setTab] = useState<Tab>('escape')
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const output: string = (() => {
    if (!input) return ''
    return tab === 'escape' ? escapeHtml(input) : unescapeHtml(input)
  })()

  const handleCopy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const handleClear = () => {
    setInput('')
    setCopied(false)
  }

  const handleTabChange = (next: Tab) => {
    setTab(next)
    setInput('')
    setCopied(false)
  }

  return (
    <div>
      {/* タブ切り替え */}
      <div style={{
        display: 'flex',
        gap: '0',
        borderBottom: '1px solid var(--border)',
        marginBottom: '1.5rem',
      }}>
        {(['escape', 'unescape'] as Tab[]).map((t) => {
          const active = tab === t
          return (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '12px',
                letterSpacing: '0.08em',
                padding: '8px 20px',
                border: 'none',
                borderBottom: active ? '2px solid var(--teal)' : '2px solid transparent',
                background: 'none',
                color: active ? 'var(--teal)' : 'var(--ink-light)',
                cursor: 'pointer',
                marginBottom: '-1px',
                transition: 'color 0.15s',
              }}
            >
              {t === 'escape' ? 'エスケープ' : 'アンエスケープ'}
            </button>
          )
        })}
      </div>

      {/* 入力エリア */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '6px',
        }}>
          {tab === 'escape' ? '入力テキスト' : 'HTMLエンティティ文字列'}
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={tab === 'escape'
            ? 'エスケープしたいHTMLを入力...'
            : 'アンエスケープしたいHTMLエンティティ文字列を入力...'}
          rows={6}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontFamily: 'var(--font-jetbrains), monospace',
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

      {/* 出力エリア */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: 'var(--ink-light)',
            textTransform: 'uppercase',
          }}>
            {tab === 'escape' ? 'エスケープ結果' : 'アンエスケープ結果'}
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleCopy}
              disabled={!output}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: copied ? 'var(--teal)' : 'var(--ink-light)',
                background: 'none',
                border: '1px solid var(--border-light)',
                borderRadius: '3px',
                padding: '4px 10px',
                cursor: output ? 'pointer' : 'default',
                opacity: output ? 1 : 0.4,
                transition: 'color 0.15s',
              }}
            >
              {copied ? 'コピー済み ✓' : 'コピー'}
            </button>
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
                padding: '4px 10px',
                cursor: 'pointer',
              }}
            >
              クリア
            </button>
          </div>
        </div>
        <textarea
          readOnly
          value={output}
          rows={6}
          placeholder="変換結果がここに表示されます"
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border-light)',
            borderRadius: '4px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '14px',
            color: output ? 'var(--ink)' : 'var(--ink-faint)',
            resize: 'vertical',
            outline: 'none',
            lineHeight: 1.7,
            boxSizing: 'border-box',
            cursor: 'default',
          }}
        />
      </div>
    </div>
  )
}
