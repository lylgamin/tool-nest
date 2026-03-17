'use client'

import { useState } from 'react'
import { analyzePassword, type StrengthLevel } from '../utils'

const STRENGTH_COLORS: Record<StrengthLevel, string> = {
  'very-weak':   '#c85050',
  'weak':        '#c8804a',
  'fair':        '#c8b040',
  'strong':      '#4a9460',
  'very-strong': '#2ec880',
}

const STRENGTH_FILL: Record<StrengthLevel, number> = {
  'very-weak':   1,
  'weak':        2,
  'fair':        3,
  'strong':      4,
  'very-strong': 5,
}

export default function PasswordStrengthTool() {
  const [password, setPassword]   = useState('')
  const [visible, setVisible]     = useState(false)
  const [copied, setCopied]       = useState(false)

  const analysis = analyzePassword(password)
  const color    = STRENGTH_COLORS[analysis.level]
  const fill     = STRENGTH_FILL[analysis.level]
  const hasInput = password.length > 0

  function handleCopy() {
    if (!hasInput) return
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const checkItems = [
    { label: '小文字（a-z）を含む',    ok: analysis.hasLower },
    { label: '大文字（A-Z）を含む',    ok: analysis.hasUpper },
    { label: '数字（0-9）を含む',      ok: analysis.hasDigit },
    { label: '記号（!@#$など）を含む', ok: analysis.hasSymbol },
    { label: '12文字以上',             ok: analysis.length >= 12 },
  ]

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>

      {/* 入力フィールド */}
      <div>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--ink-mid)',
          marginBottom: '0.5rem',
        }}>
          パスワードを入力
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={visible ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="パスワードをここに入力..."
            autoComplete="off"
            spellCheck={false}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 'clamp(14px, 2.5vw, 18px)',
              padding: '0.875rem 3.5rem 0.875rem 1rem',
              border: `1px solid ${hasInput ? color : 'var(--border)'}`,
              borderRadius: '6px',
              backgroundColor: 'var(--surface-alt)',
              color: 'var(--ink)',
              outline: 'none',
              letterSpacing: '0.05em',
              transition: 'border-color 0.2s',
            }}
          />
          <button
            type="button"
            onClick={() => setVisible(v => !v)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11px',
              color: 'var(--ink-light)',
              border: '1px solid var(--border-light)',
              borderRadius: '3px',
              padding: '4px 8px',
              backgroundColor: 'var(--surface)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {visible ? '非表示' : '表示'}
          </button>
        </div>
      </div>

      {/* 強度バー */}
      <div>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <div
              key={n}
              style={{
                flex: 1,
                height: '8px',
                borderRadius: '4px',
                backgroundColor: hasInput && n <= fill ? color : 'var(--border-light)',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: 'var(--font-noto-sans), sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: hasInput ? color : 'var(--ink-faint)',
          }}>
            {hasInput ? analysis.levelLabel : '—'}
          </span>
          {hasInput && (
            <button
              type="button"
              onClick={handleCopy}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                padding: '4px 12px',
                borderRadius: '3px',
                border: '1px solid var(--border)',
                backgroundColor: copied ? 'var(--teal-mid)' : 'var(--surface)',
                color: copied ? 'var(--teal)' : 'var(--ink-mid)',
                cursor: 'pointer',
                transition: 'background-color 0.15s, color 0.15s',
              }}
            >
              {copied ? '✓ コピー済み' : 'コピー'}
            </button>
          )}
        </div>
      </div>

      {/* 詳細情報グリッド */}
      {hasInput && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.75rem',
        }}>
          {[
            { label: '文字数',          value: `${analysis.length} 文字` },
            { label: 'エントロピー',    value: `${analysis.entropy.toFixed(1)} bit` },
            { label: '文字集合サイズ',  value: `${analysis.charsetSize} 種類` },
            { label: '解読時間の目安',  value: analysis.crackTime },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                backgroundColor: '#111820',
                borderRadius: '4px',
                padding: '0.75rem 1rem',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10px',
                color: '#63a4d8',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '15px',
                color: '#a8b8c8',
                fontWeight: 500,
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* チェックリスト */}
      <div>
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--ink-mid)',
          marginBottom: '0.5rem',
          fontWeight: 500,
        }}>
          チェックリスト
        </div>
        <div style={{ display: 'grid', gap: '6px' }}>
          {checkItems.map(({ label, ok }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-noto-sans), sans-serif',
                fontSize: '13px',
                color: !hasInput ? 'var(--ink-faint)' : ok ? 'var(--ink)' : 'var(--ink-light)',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '12px',
                color: !hasInput ? 'var(--ink-faint)' : ok ? '#2ec880' : '#c85050',
                minWidth: '1em',
              }}>
                {!hasInput ? '·' : ok ? '✓' : '✗'}
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* 改善提案 */}
      {hasInput && analysis.suggestions.length > 0 && (
        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-light)',
          borderRadius: '4px',
          padding: '1rem 1.25rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-noto-sans), sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--ink)',
            marginBottom: '0.5rem',
          }}>
            改善提案
          </div>
          <ul style={{
            margin: 0,
            paddingLeft: '1.25rem',
            display: 'grid',
            gap: '4px',
          }}>
            {analysis.suggestions.map((s, i) => (
              <li
                key={i}
                style={{
                  fontFamily: 'var(--font-noto-sans), sans-serif',
                  fontSize: '13px',
                  color: 'var(--ink-mid)',
                  lineHeight: 1.6,
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
