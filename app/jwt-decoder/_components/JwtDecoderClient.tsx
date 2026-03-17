'use client'

import { useState } from 'react'
import { decodeJwt, formatExpiry } from '../utils'
import type { JwtDecodeResult } from '../utils'

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ' +
  '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: '10px',
  letterSpacing: '0.14em',
  color: '#63a4d8',
  textTransform: 'uppercase' as const,
  marginBottom: '6px',
}

const jsonStyle: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: '13px',
  color: '#a8b8c8',
  lineHeight: 1.65,
  whiteSpace: 'pre-wrap' as const,
  wordBreak: 'break-all' as const,
  margin: 0,
}

export default function JwtDecoderClient() {
  const [token, setToken] = useState('')
  const [copied, setCopied] = useState(false)

  const result: JwtDecodeResult | null = token.trim() ? decodeJwt(token) : null

  const handleCopy = () => {
    if (!result?.ok) return
    const text = JSON.stringify(
      { header: result.header, payload: result.payload, signature: result.signature },
      null,
      2
    )
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const handleClear = () => {
    setToken('')
    setCopied(false)
  }

  return (
    <div>
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
          JWTトークン
        </label>
        <textarea
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
          rows={5}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '13px',
            color: 'var(--ink)',
            resize: 'vertical',
            outline: 'none',
            lineHeight: 1.6,
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        />
      </div>

      {/* ボタン群 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setToken(SAMPLE_JWT)}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: 'var(--teal)',
            background: 'var(--teal-mid)',
            border: '1px solid rgba(31,107,114,0.3)',
            borderRadius: '3px',
            padding: '6px 14px',
            cursor: 'pointer',
          }}
        >
          サンプル挿入
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
            padding: '6px 14px',
            cursor: 'pointer',
          }}
        >
          クリア
        </button>
        {result?.ok && (
          <button
            onClick={handleCopy}
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: copied ? '#2ec880' : 'var(--ink-light)',
              background: 'none',
              border: '1px solid var(--border-light)',
              borderRadius: '3px',
              padding: '6px 14px',
              cursor: 'pointer',
              marginLeft: 'auto',
              transition: 'color 0.15s',
            }}
          >
            {copied ? 'コピー済み ✓' : '結果をコピー'}
          </button>
        )}
      </div>

      {/* 結果エリア */}
      {result !== null && (
        <>
          {!result.ok ? (
            <div style={{
              backgroundColor: 'rgba(220,38,38,0.08)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: '4px',
              padding: '1rem 1.25rem',
              fontFamily: 'var(--font-noto-sans), sans-serif',
              fontSize: '14px',
              color: '#ef4444',
            }}>
              {result.error}
            </div>
          ) : (
            <div style={{
              backgroundColor: '#111820',
              borderRadius: '6px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}>
              {/* HEADER */}
              <div>
                <div style={labelStyle}>HEADER</div>
                <pre style={jsonStyle}>{JSON.stringify(result.header, null, 2)}</pre>
              </div>
              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
              {/* PAYLOAD */}
              <div>
                <div style={labelStyle}>PAYLOAD</div>
                <pre style={jsonStyle}>{JSON.stringify(result.payload, null, 2)}</pre>
                {typeof result.payload.exp === 'number' && (
                  <div style={{
                    marginTop: '8px',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '11px',
                    color: '#63a4d8',
                  }}>
                    exp → {formatExpiry(result.payload.exp)}
                  </div>
                )}
              </div>
              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
              {/* SIGNATURE */}
              <div>
                <div style={labelStyle}>SIGNATURE</div>
                <div style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '13px',
                  color: '#a8b8c8',
                  wordBreak: 'break-all',
                  lineHeight: 1.6,
                }}>
                  {result.signature}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
