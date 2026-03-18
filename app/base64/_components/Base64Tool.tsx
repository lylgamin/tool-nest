'use client'

import { useState } from 'react'
import { encodeBase64, encodeBase64UrlSafe, decodeBase64 } from '../utils'
import { useCopy } from '../../_components/useCopy'

type Tab = 'encode' | 'decode'

export default function Base64Tool() {
  const [tab, setTab] = useState<Tab>('encode')
  const [input, setInput] = useState('')
  const [urlSafe, setUrlSafe] = useState(false)
  const { copied, copy } = useCopy()

  const output: string = (() => {
    if (!input) return ''
    if (tab === 'encode') {
      return urlSafe ? encodeBase64UrlSafe(input) : encodeBase64(input)
    }
    const result = decodeBase64(input)
    return result.ok ? result.output : ''
  })()

  const decodeError: string | null = (() => {
    if (tab !== 'decode' || !input) return null
    const result = decodeBase64(input)
    return result.ok ? null : result.error
  })()

  const handleCopy = () => {
    if (!output) return
    copy(output)
  }

  const handleClear = () => {
    setInput('')
  }

  const handleTabChange = (next: Tab) => {
    setTab(next)
    setInput('')
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
        {(['encode', 'decode'] as Tab[]).map((t) => {
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
              {t === 'encode' ? 'エンコード' : 'デコード'}
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
          {tab === 'encode' ? '入力テキスト' : 'Base64 文字列'}
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={tab === 'encode'
            ? 'エンコードしたいテキストを入力...'
            : 'デコードしたいBase64文字列を入力...'}
          rows={6}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontFamily: tab === 'decode' ? 'var(--font-jetbrains), monospace' : 'var(--font-noto-sans), sans-serif',
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

      {/* URL-safeオプション（エンコードタブのみ） */}
      {tab === 'encode' && (
        <label style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--ink-mid)',
          cursor: 'pointer',
          marginBottom: '1.25rem',
          userSelect: 'none',
        }}>
          <input
            type="checkbox"
            checked={urlSafe}
            onChange={e => setUrlSafe(e.target.checked)}
            style={{ accentColor: 'var(--teal)', width: '15px', height: '15px', cursor: 'pointer' }}
          />
          URL-safe（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px' }}>+→-、/→_、パディング除去</code>）
        </label>
      )}

      {/* エラー表示 */}
      {decodeError && (
        <div style={{
          backgroundColor: 'rgba(180,40,40,0.07)',
          border: '1px solid rgba(180,40,40,0.25)',
          borderRadius: '4px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: '#b42828',
        }}>
          {decodeError}
        </div>
      )}

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
            {tab === 'encode' ? 'Base64 出力' : 'デコード結果'}
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
            fontFamily: tab === 'encode' ? 'var(--font-jetbrains), monospace' : 'var(--font-noto-sans), sans-serif',
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
