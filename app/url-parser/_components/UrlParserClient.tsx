'use client'

import { useState } from 'react'
import { parseUrl, type ParsedUrl } from '../utils'

export default function UrlParserClient() {
  const [input, setInput] = useState('')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const result = parseUrl(input)

  const handleCopy = (value: string, field: string) => {
    if (!value) return
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 1500)
    })
  }

  const handleClear = () => {
    setInput('')
    setCopiedField(null)
  }

  const parsed = result.ok ? result.parsed : null

  const fieldLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-jetbrains), monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    color: 'var(--ink-light)',
    textTransform: 'uppercase',
    width: '120px',
    flexShrink: 0,
    paddingTop: '2px',
  }

  const fieldValueStyle: React.CSSProperties = {
    fontFamily: 'var(--font-jetbrains), monospace',
    fontSize: '13px',
    color: 'var(--ink)',
    flex: 1,
    wordBreak: 'break-all',
  }

  const emptyValueStyle: React.CSSProperties = {
    ...fieldValueStyle,
    color: 'var(--ink-faint)',
    fontStyle: 'italic',
  }

  const copyBtnStyle = (field: string, value: string): React.CSSProperties => ({
    fontFamily: 'var(--font-jetbrains), monospace',
    fontSize: '10px',
    letterSpacing: '0.08em',
    color: copiedField === field ? 'var(--teal)' : 'var(--ink-light)',
    background: 'none',
    border: '1px solid var(--border-light)',
    borderRadius: '3px',
    padding: '3px 8px',
    cursor: value ? 'pointer' : 'default',
    opacity: value ? 1 : 0.3,
    transition: 'color 0.15s',
    flexShrink: 0,
  })

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.625rem 0',
    borderBottom: '1px solid var(--border-light)',
  }

  type FieldDef = { key: keyof ParsedUrl; label: string; fieldId: string }

  const fields: FieldDef[] = [
    { key: 'protocol', label: 'protocol', fieldId: 'protocol' },
    { key: 'hostname', label: 'hostname', fieldId: 'hostname' },
    { key: 'port', label: 'port', fieldId: 'port' },
    { key: 'pathname', label: 'pathname', fieldId: 'pathname' },
    { key: 'search', label: 'search', fieldId: 'search' },
    { key: 'hash', label: 'hash', fieldId: 'hash' },
    { key: 'username', label: 'username', fieldId: 'username' },
    { key: 'password', label: 'password', fieldId: 'password' },
  ]

  return (
    <div>
      {/* 入力フィールド */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: 'var(--ink-light)',
            textTransform: 'uppercase',
          }}>
            URL 入力
          </label>
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
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="https://example.com/path?key=value#section"
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
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

      {/* エラー表示 */}
      {!result.ok && result.error && (
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
          {result.error}
        </div>
      )}

      {/* パース結果 */}
      {parsed && (
        <div style={{
          backgroundColor: 'var(--surface-alt)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '0.5rem 1rem',
        }}>
          {/* 基本フィールド */}
          {fields.map(({ key, label, fieldId }) => {
            const raw = parsed[key]
            const value = typeof raw === 'string' ? raw : ''
            const displayValue = key === 'port' && !value ? '（デフォルト）' : value || '（なし）'
            const isEmpty = !value
            return (
              <div key={fieldId} style={rowStyle}>
                <span style={fieldLabelStyle}>{label}</span>
                <span style={isEmpty ? emptyValueStyle : fieldValueStyle}>
                  {displayValue}
                </span>
                <button
                  onClick={() => handleCopy(value, fieldId)}
                  disabled={isEmpty}
                  style={copyBtnStyle(fieldId, value)}
                >
                  {copiedField === fieldId ? '✓' : 'copy'}
                </button>
              </div>
            )
          })}

          {/* クエリパラメータ */}
          <div style={{ paddingTop: '0.625rem' }}>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'var(--ink-light)',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}>
              query params
              <span style={{
                marginLeft: '0.5rem',
                color: 'var(--ink-faint)',
                fontStyle: 'normal',
              }}>
                ({parsed.params.length})
              </span>
            </div>

            {parsed.params.length === 0 ? (
              <div style={{ ...emptyValueStyle, paddingBottom: '0.375rem' }}>（なし）</div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '0 0.75rem',
                alignItems: 'start',
              }}>
                {/* ヘッダー行 */}
                <div style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  color: 'var(--ink-faint)',
                  textTransform: 'uppercase',
                  paddingBottom: '4px',
                  borderBottom: '1px solid var(--border-light)',
                }}>key</div>
                <div style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  color: 'var(--ink-faint)',
                  textTransform: 'uppercase',
                  paddingBottom: '4px',
                  borderBottom: '1px solid var(--border-light)',
                }}>value</div>
                <div style={{
                  borderBottom: '1px solid var(--border-light)',
                  paddingBottom: '4px',
                }} />

                {parsed.params.map(({ key, value }, i) => {
                  const fieldId = `param-${i}`
                  return (
                    <>
                      <div key={`k-${i}`} style={{
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: '12px',
                        color: 'var(--teal)',
                        padding: '4px 0',
                        wordBreak: 'break-all',
                      }}>
                        {key}
                      </div>
                      <div key={`v-${i}`} style={{
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: '12px',
                        color: 'var(--ink)',
                        padding: '4px 0',
                        wordBreak: 'break-all',
                      }}>
                        {value || <span style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>（空）</span>}
                      </div>
                      <button
                        key={`b-${i}`}
                        onClick={() => handleCopy(value, fieldId)}
                        style={{
                          fontFamily: 'var(--font-jetbrains), monospace',
                          fontSize: '10px',
                          letterSpacing: '0.08em',
                          color: copiedField === fieldId ? 'var(--teal)' : 'var(--ink-light)',
                          background: 'none',
                          border: '1px solid var(--border-light)',
                          borderRadius: '3px',
                          padding: '3px 8px',
                          cursor: 'pointer',
                          transition: 'color 0.15s',
                          marginTop: '2px',
                        }}
                      >
                        {copiedField === fieldId ? '✓' : 'copy'}
                      </button>
                    </>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
