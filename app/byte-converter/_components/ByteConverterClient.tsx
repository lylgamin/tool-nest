'use client'

import { useState } from 'react'
import { convertBytes, type Unit } from '../utils'

const UNITS: Unit[] = ['B', 'KB', 'MB', 'GB', 'TB']

type Preset = { label: string; value: string; unit: Unit }

const PRESETS: Preset[] = [
  { label: '1 KB', value: '1', unit: 'KB' },
  { label: '1 MB', value: '1', unit: 'MB' },
  { label: '1 GB', value: '1', unit: 'GB' },
  { label: '1 TB', value: '1', unit: 'TB' },
]

const IEC_LABELS: Record<Unit, string> = {
  B:  'B',
  KB: 'KiB',
  MB: 'MiB',
  GB: 'GiB',
  TB: 'TiB',
}

export default function ByteConverterClient() {
  const [value, setValue] = useState('1')
  const [unit, setUnit] = useState<Unit>('MB')

  const result = convertBytes(value, unit)

  const handlePreset = (preset: Preset) => {
    setValue(preset.value)
    setUnit(preset.unit)
  }

  const inputStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--surface-alt)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    fontFamily: 'var(--font-jetbrains), monospace',
    fontSize: '16px',
    color: 'var(--ink)',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
  }

  const unitBtnBase: React.CSSProperties = {
    fontFamily: 'var(--font-jetbrains), monospace',
    fontSize: '12px',
    letterSpacing: '0.08em',
    padding: '7px 14px',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
  }

  const unitBtnActive: React.CSSProperties = {
    ...unitBtnBase,
    backgroundColor: 'var(--navy)',
    color: '#ffffff',
    borderColor: 'var(--navy)',
  }

  const unitBtnInactive: React.CSSProperties = {
    ...unitBtnBase,
    backgroundColor: 'var(--surface)',
    color: 'var(--ink-mid)',
  }

  const resultRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '0.5rem 0',
    borderBottom: '1px solid var(--border-light)',
  }

  const resultLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-jetbrains), monospace',
    fontSize: '11px',
    letterSpacing: '0.1em',
    color: 'var(--ink-light)',
    textTransform: 'uppercase' as const,
    minWidth: '2.5rem',
  }

  const resultValueStyle: React.CSSProperties = {
    fontFamily: 'var(--font-jetbrains), monospace',
    fontSize: '14px',
    color: 'var(--ink)',
    textAlign: 'right' as const,
  }

  return (
    <div>
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
          数値入力
        </label>
        <input
          type="number"
          min="0"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="変換したい数値を入力..."
          style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        />
      </div>

      {/* 単位セレクタ */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}>
          入力単位
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {UNITS.map(u => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              style={u === unit ? unitBtnActive : unitBtnInactive}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* プリセットボタン */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}>
          プリセット
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => handlePreset(p)}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                letterSpacing: '0.08em',
                padding: '5px 12px',
                border: '1px solid var(--border-light)',
                borderRadius: '3px',
                backgroundColor: 'var(--surface)',
                color: 'var(--teal)',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 結果エリア */}
      {result ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}>
          {/* SI（10進） */}
          <div style={{
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '1.25rem',
          }}>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '10px',
              letterSpacing: '0.14em',
              color: 'var(--teal)',
              textTransform: 'uppercase',
              marginBottom: '0.25rem',
            }}>
              SI（10進）
            </div>
            <div style={{
              fontFamily: 'var(--font-noto-sans), sans-serif',
              fontSize: '11px',
              color: 'var(--ink-light)',
              marginBottom: '0.875rem',
            }}>
              1 KB = 1,000 B
            </div>
            {UNITS.map((u, i) => (
              <div
                key={u}
                style={{
                  ...resultRowStyle,
                  borderBottom: i === UNITS.length - 1 ? 'none' : '1px solid var(--border-light)',
                }}
              >
                <span style={resultLabelStyle}>{u}</span>
                <span style={resultValueStyle}>{result.si[u]}</span>
              </div>
            ))}
          </div>

          {/* IEC（2進） */}
          <div style={{
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '1.25rem',
          }}>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '10px',
              letterSpacing: '0.14em',
              color: 'var(--navy)',
              textTransform: 'uppercase',
              marginBottom: '0.25rem',
            }}>
              IEC（2進）
            </div>
            <div style={{
              fontFamily: 'var(--font-noto-sans), sans-serif',
              fontSize: '11px',
              color: 'var(--ink-light)',
              marginBottom: '0.875rem',
            }}>
              1 KiB = 1,024 B
            </div>
            {UNITS.map((u, i) => (
              <div
                key={u}
                style={{
                  ...resultRowStyle,
                  borderBottom: i === UNITS.length - 1 ? 'none' : '1px solid var(--border-light)',
                }}
              >
                <span style={resultLabelStyle}>{IEC_LABELS[u]}</span>
                <span style={resultValueStyle}>{result.iec[u]}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-light)',
          borderRadius: '6px',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--ink-faint)',
        }}>
          有効な数値を入力してください
        </div>
      )}
    </div>
  )
}
