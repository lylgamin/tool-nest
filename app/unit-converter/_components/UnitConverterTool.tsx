'use client'

import { useState, useCallback } from 'react'
import { convert, UNIT_DEFS, type UnitCategory } from '../utils'

const CATEGORY_LABELS: Record<UnitCategory, string> = {
  length: '長さ',
  weight: '重量',
  temperature: '温度',
  speed: '速度',
  area: '面積',
}

const CATEGORIES: UnitCategory[] = ['length', 'weight', 'temperature', 'speed', 'area']

function formatResult(value: number): string {
  if (!isFinite(value)) return '—'
  // 絶対値が非常に大きい・小さい場合は指数表記
  const abs = Math.abs(value)
  if (abs !== 0 && (abs >= 1e12 || abs < 1e-6)) {
    return value.toExponential(6)
  }
  // 小数点以下の余分なゼロを除去
  const fixed = parseFloat(value.toPrecision(10))
  return String(fixed)
}

export default function UnitConverterTool() {
  const [category, setCategory] = useState<UnitCategory>('length')
  const [inputValue, setInputValue] = useState('')
  const [fromId, setFromId] = useState(UNIT_DEFS['length'][2].id) // 'm'
  const [toId, setToId] = useState(UNIT_DEFS['length'][3].id)     // 'km'

  const units = UNIT_DEFS[category]

  const handleCategoryChange = useCallback((cat: UnitCategory) => {
    setCategory(cat)
    setFromId(UNIT_DEFS[cat][0].id)
    setToId(UNIT_DEFS[cat][1].id)
    setInputValue('')
  }, [])

  const numValue = parseFloat(inputValue)
  const isValidInput = inputValue !== '' && !isNaN(numValue)

  const resultValue = isValidInput
    ? convert(numValue, fromId, toId, category)
    : null

  // 全単位への一括変換結果
  const allResults = isValidInput
    ? units.map(unit => ({
        unit,
        result: convert(numValue, fromId, unit.id, category),
      }))
    : null

  return (
    <div>
      {/* カテゴリタブ */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        marginBottom: '1.5rem',
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11px',
              letterSpacing: '0.08em',
              padding: '5px 12px',
              borderRadius: '4px',
              border: category === cat ? 'none' : '1px solid var(--border)',
              cursor: 'pointer',
              backgroundColor: category === cat ? 'var(--navy)' : 'var(--surface)',
              color: category === cat ? '#fff' : 'var(--ink-mid)',
              transition: 'background 0.15s',
            }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* 変換入力パネル */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
        alignItems: 'end',
      }}>
        {/* 入力値 + From単位 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={labelStyle}>変換元</label>
          <input
            type="number"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="数値を入力"
            style={{
              ...inputBaseStyle,
              marginBottom: '6px',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
          <select
            value={fromId}
            onChange={e => setFromId(e.target.value)}
            style={selectStyle}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </div>

        {/* 矢印 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          color: 'var(--ink-faint)',
          paddingBottom: '2px',
          minWidth: '32px',
          flexShrink: 0,
        }}>
          →
        </div>

        {/* 結果 + To単位 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={labelStyle}>変換先</label>
          <div style={{
            ...inputBaseStyle,
            backgroundColor: 'var(--surface)',
            color: resultValue !== null ? 'var(--teal)' : 'var(--ink-faint)',
            fontWeight: resultValue !== null ? 500 : 400,
            marginBottom: '6px',
            userSelect: 'text',
          }}>
            {resultValue !== null ? formatResult(resultValue) : '—'}
          </div>
          <select
            value={toId}
            onChange={e => setToId(e.target.value)}
            style={selectStyle}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 一括変換テーブル */}
      {allResults ? (
        <div>
          <div style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'var(--ink-light)',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}>
            全単位への変換結果
          </div>
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            {allResults.map(({ unit, result }, idx) => (
              <div
                key={unit.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 1rem',
                  backgroundColor: unit.id === fromId
                    ? 'var(--navy-light)'
                    : idx % 2 === 0 ? 'var(--surface)' : 'var(--surface-alt)',
                  borderBottom: idx < allResults.length - 1 ? '1px solid var(--border-light)' : 'none',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-noto-sans), sans-serif',
                  fontSize: '13px',
                  color: 'var(--ink-mid)',
                }}>
                  {unit.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '13px',
                  color: unit.id === fromId ? 'var(--navy)' : 'var(--ink)',
                  fontWeight: unit.id === fromId ? 600 : 400,
                }}>
                  {formatResult(result)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-faint)',
          textAlign: 'center',
          padding: '2rem',
          border: '1px dashed var(--border-light)',
          borderRadius: '4px',
        }}>
          数値を入力すると全単位への変換結果が表示されます
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: '10px',
  letterSpacing: '0.1em',
  color: 'var(--ink-light)',
  textTransform: 'uppercase',
}

const inputBaseStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  backgroundColor: 'var(--surface-alt)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: '14px',
  color: 'var(--ink)',
  outline: 'none',
  boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  backgroundColor: 'var(--surface-alt)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  fontFamily: 'var(--font-noto-sans), sans-serif',
  fontSize: '13px',
  color: 'var(--ink)',
  outline: 'none',
  cursor: 'pointer',
  boxSizing: 'border-box',
}
