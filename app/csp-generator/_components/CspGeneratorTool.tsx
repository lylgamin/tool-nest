'use client'

import { useState, useCallback } from 'react'
import { CSP_DIRECTIVES, buildCspHeader, parseCspHeader } from '../utils'
import { useCopy } from '../../_components/useCopy'

type DirectiveState = {
  enabled: boolean
  input: string
}

const PRESET_VALUES = ["'self'", "'none'", "'unsafe-inline'", "'unsafe-eval'", 'data:', 'https:', '*']

function initState(): Record<string, DirectiveState> {
  const state: Record<string, DirectiveState> = {}
  for (const def of CSP_DIRECTIVES) {
    state[def.name] = {
      enabled: true,
      input: def.defaultValues.join(' '),
    }
  }
  return state
}

export default function CspGeneratorTool() {
  const [directives, setDirectives] = useState<Record<string, DirectiveState>>(initState)
  const [importText, setImportText] = useState('')
  const { copied, copy } = useCopy()

  const getConfig = useCallback((): Record<string, string[]> => {
    const config: Record<string, string[]> = {}
    for (const def of CSP_DIRECTIVES) {
      const state = directives[def.name]
      if (!state.enabled) continue
      const values = state.input.trim().split(/\s+/).filter(Boolean)
      config[def.name] = values
    }
    return config
  }, [directives])

  const cspOutput = buildCspHeader(getConfig())

  const handleToggle = useCallback((name: string) => {
    setDirectives(prev => ({
      ...prev,
      [name]: { ...prev[name], enabled: !prev[name].enabled },
    }))
  }, [])

  const handleInputChange = useCallback((name: string, value: string) => {
    setDirectives(prev => ({
      ...prev,
      [name]: { ...prev[name], input: value },
    }))
  }, [])

  const handleAddPreset = useCallback((name: string, preset: string) => {
    setDirectives(prev => {
      const current = prev[name].input.trim()
      const parts = current ? current.split(/\s+/) : []
      if (parts.includes(preset)) return prev
      return {
        ...prev,
        [name]: { ...prev[name], input: [...parts, preset].join(' ') },
      }
    })
  }, [])

  const handleImport = useCallback(() => {
    const parsed = parseCspHeader(importText.trim())
    if (Object.keys(parsed).length === 0) return

    setDirectives(prev => {
      const next = { ...prev }
      // Reset all to disabled first
      for (const def of CSP_DIRECTIVES) {
        next[def.name] = { ...next[def.name], enabled: false }
      }
      // Apply parsed values
      for (const [name, values] of Object.entries(parsed)) {
        if (next[name] !== undefined) {
          next[name] = { enabled: true, input: values.join(' ') }
        }
      }
      return next
    })
    setImportText('')
  }, [importText])

  const handleReset = useCallback(() => {
    setDirectives(initState())
    setImportText('')
  }, [])

  const handleCopy = useCallback(() => {
    if (!cspOutput) return
    copy(cspOutput)
  }, [cspOutput, copy])

  return (
    <div>
      {/* インポート */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '6px',
        }}>
          既存のCSPヘッダーをインポート（任意）
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder="default-src 'self'; script-src 'self' https://cdn.example.com"
            style={{
              flex: 1,
              minWidth: '240px',
              padding: '7px 10px',
              backgroundColor: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '12px',
              color: 'var(--ink)',
              outline: 'none',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
          <ActionButton label="インポート" onClick={handleImport} disabled={!importText.trim()} />
        </div>
      </div>

      {/* ディレクティブ設定 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {CSP_DIRECTIVES.map(def => {
          const state = directives[def.name]
          return (
            <div
              key={def.name}
              style={{
                backgroundColor: 'var(--surface-alt)',
                border: `1px solid ${state.enabled ? 'var(--border)' : 'var(--border-light)'}`,
                borderRadius: '4px',
                padding: '0.75rem 1rem',
                opacity: state.enabled ? 1 : 0.5,
                transition: 'opacity 0.15s, border-color 0.15s',
              }}
            >
              {/* ヘッダー行 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: state.enabled ? '0.6rem' : 0 }}>
                <button
                  onClick={() => handleToggle(def.name)}
                  style={{
                    width: '36px',
                    height: '20px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: state.enabled ? 'var(--teal)' : 'var(--border)',
                    position: 'relative',
                    flexShrink: 0,
                    transition: 'background 0.15s',
                    padding: 0,
                  }}
                  aria-label={`${def.name} ${state.enabled ? 'を無効化' : 'を有効化'}`}
                >
                  <span style={{
                    display: 'block',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: '3px',
                    left: state.enabled ? '19px' : '3px',
                    transition: 'left 0.15s',
                  }} />
                </button>
                <span style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '13px',
                  color: 'var(--navy)',
                  fontWeight: 500,
                }}>
                  {def.name}
                </span>
                <span style={{
                  fontFamily: 'var(--font-noto-sans), sans-serif',
                  fontSize: '11px',
                  color: 'var(--ink-light)',
                }}>
                  {def.description}
                </span>
              </div>

              {/* 入力エリア（有効時のみ） */}
              {state.enabled && (
                <div>
                  <input
                    type="text"
                    value={state.input}
                    onChange={e => handleInputChange(def.name, e.target.value)}
                    placeholder="スペース区切りで値を入力"
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-jetbrains), monospace',
                      fontSize: '12px',
                      color: 'var(--ink)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      marginBottom: '6px',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
                  />
                  {/* プリセットボタン */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {PRESET_VALUES.map(preset => (
                      <button
                        key={preset}
                        onClick={() => handleAddPreset(def.name, preset)}
                        style={{
                          fontFamily: 'var(--font-jetbrains), monospace',
                          fontSize: '10px',
                          letterSpacing: '0.05em',
                          padding: '2px 8px',
                          borderRadius: '3px',
                          border: '1px solid var(--border-light)',
                          backgroundColor: 'var(--surface)',
                          color: 'var(--ink-mid)',
                          cursor: 'pointer',
                        }}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* アクションボタン */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <ActionButton label="リセット" onClick={handleReset} />
      </div>

      {/* 生成結果 */}
      <div>
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}>
          生成された Content-Security-Policy ヘッダー
        </div>
        <div style={{
          backgroundColor: '#111820',
          borderRadius: '4px',
          padding: '1rem 1.25rem',
          marginBottom: '0.5rem',
          minHeight: '56px',
          position: 'relative',
        }}>
          {cspOutput ? (
            <pre style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '12px',
              color: '#a8b8c8',
              lineHeight: 1.65,
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}>
              {cspOutput}
            </pre>
          ) : (
            <span style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '12px',
              color: '#4a5a6a',
            }}>
              // ディレクティブを有効にして値を入力してください
            </span>
          )}
        </div>
        <ActionButton
          label={copied ? 'コピーしました！' : 'クリップボードにコピー'}
          onClick={handleCopy}
          primary
          disabled={!cspOutput}
        />
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
