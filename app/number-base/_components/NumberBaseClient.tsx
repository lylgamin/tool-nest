'use client'

import { useState } from 'react'
import { convertBase } from '../utils'
import type { Base } from '../utils'

const BASES: { value: Base; label: string }[] = [
  { value: 2,  label: '2進数 (BIN)' },
  { value: 8,  label: '8進数 (OCT)' },
  { value: 10, label: '10進数 (DEC)' },
  { value: 16, label: '16進数 (HEX)' },
]

const RESULT_ROWS: { key: 'bin' | 'oct' | 'dec' | 'hex'; label: string; prefix: string }[] = [
  { key: 'bin', label: '2進数 (BIN)',  prefix: '0b' },
  { key: 'oct', label: '8進数 (OCT)',  prefix: '0o' },
  { key: 'dec', label: '10進数 (DEC)', prefix: ''   },
  { key: 'hex', label: '16進数 (HEX)', prefix: '0x' },
]

export default function NumberBaseClient() {
  const [input, setInput]       = useState('')
  const [fromBase, setFromBase] = useState<Base>(10)
  const [copied, setCopied]     = useState<string | null>(null)

  const result = convertBase(input, fromBase)

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  const handleClear = () => {
    setInput('')
    setCopied(null)
  }

  return (
    <div>
      {/* 基数セレクタ */}
      <div style={{
        display: 'flex',
        gap: '0',
        borderBottom: '1px solid var(--border)',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
      }}>
        {BASES.map(({ value, label }) => {
          const active = fromBase === value
          return (
            <button
              key={value}
              onClick={() => { setFromBase(value); setInput(''); setCopied(null) }}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '12px',
                letterSpacing: '0.08em',
                padding: '8px 18px',
                border: 'none',
                borderBottom: active ? '2px solid var(--teal)' : '2px solid transparent',
                background: 'none',
                color: active ? 'var(--teal)' : 'var(--ink-light)',
                cursor: 'pointer',
                marginBottom: '-1px',
                transition: 'color 0.15s',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* 入力エリア */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '6px',
        }}>
          入力値（{fromBase}進数）
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setCopied(null) }}
            placeholder={fromBase === 16 ? '例: 1A2F' : fromBase === 2 ? '例: 11010110' : fromBase === 8 ? '例: 777' : '例: 255'}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '15px',
              color: 'var(--ink)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
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
              padding: '4px 12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            クリア
          </button>
        </div>
      </div>

      {/* エラー表示 */}
      {input && !result.ok && result.error && (
        <div style={{
          backgroundColor: 'rgba(180,40,40,0.07)',
          border: '1px solid rgba(180,40,40,0.25)',
          borderRadius: '4px',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: '#b42828',
        }}>
          {result.error}
        </div>
      )}

      {/* 変換結果 */}
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {RESULT_ROWS.map(({ key, label, prefix }) => {
          const value = result.ok ? result[key] : ''
          const isCopied = copied === key
          return (
            <div
              key={key}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr auto',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                padding: '0.75rem 1rem',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'var(--ink-light)',
                textTransform: 'uppercase',
              }}>
                {label}
              </span>
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '14px',
                color: value ? 'var(--ink)' : 'var(--ink-faint)',
                wordBreak: 'break-all',
              }}>
                {value
                  ? <><span style={{ color: 'var(--ink-faint)' }}>{prefix}</span>{value}</>
                  : '—'}
              </span>
              <button
                onClick={() => { if (value) handleCopy(key, value) }}
                disabled={!value}
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  color: isCopied ? 'var(--teal)' : 'var(--ink-light)',
                  background: 'none',
                  border: '1px solid var(--border-light)',
                  borderRadius: '3px',
                  padding: '4px 10px',
                  cursor: value ? 'pointer' : 'default',
                  opacity: value ? 1 : 0.4,
                  transition: 'color 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {isCopied ? '✓ コピー済み' : 'コピー'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
