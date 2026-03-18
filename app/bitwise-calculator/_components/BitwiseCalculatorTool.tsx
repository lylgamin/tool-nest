'use client'

import { useState, useCallback } from 'react'
import { bitwiseCalc, toBinaryStr, toHexStr, parseIntInput, type BitwiseOp } from '../utils'

const OPS: { value: BitwiseOp; label: string; needsB: boolean }[] = [
  { value: 'AND',    label: 'AND  (A & B)',   needsB: true },
  { value: 'OR',     label: 'OR   (A | B)',   needsB: true },
  { value: 'XOR',    label: 'XOR  (A ^ B)',   needsB: true },
  { value: 'NOT',    label: 'NOT  (~A)',       needsB: false },
  { value: 'LSHIFT', label: 'LSHIFT  (A << B)', needsB: true },
  { value: 'RSHIFT', label: 'RSHIFT  (A >>> B)', needsB: false },
]

const BASES: { value: 2 | 8 | 10 | 16; label: string; prefix: string }[] = [
  { value: 2,  label: '2進数 (BIN)',  prefix: '0b' },
  { value: 8,  label: '8進数 (OCT)',  prefix: '0o' },
  { value: 10, label: '10進数 (DEC)', prefix: '' },
  { value: 16, label: '16進数 (HEX)', prefix: '0x' },
]

interface Result {
  bin: string
  oct: string
  dec: string
  hex: string
}

export default function BitwiseCalculatorTool() {
  const [inputA, setInputA] = useState('')
  const [inputB, setInputB] = useState('')
  const [base, setBase] = useState<2 | 8 | 10 | 16>(10)
  const [op, setOp] = useState<BitwiseOp>('AND')
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  const currentOp = OPS.find(o => o.value === op)!

  const handleCalc = useCallback(() => {
    setError(null)
    setResult(null)

    const a = parseIntInput(inputA, base)
    if (a === null) {
      setError('入力Aが無効です。選択した基数に合った値を入力してください。')
      return
    }

    let b = 0
    if (currentOp.needsB) {
      const bParsed = parseIntInput(inputB, base)
      if (bParsed === null) {
        setError('入力Bが無効です。選択した基数に合った値を入力してください。')
        return
      }
      b = bParsed
    }

    const r = bitwiseCalc(op, a, b)
    setResult({
      bin: toBinaryStr(r, 32),
      oct: (r >>> 0).toString(8),
      dec: String(r >>> 0),
      hex: toHexStr(r),
    })
  }, [inputA, inputB, base, op, currentOp.needsB])

  const handleClear = useCallback(() => {
    setInputA('')
    setInputB('')
    setResult(null)
    setError(null)
  }, [])

  return (
    <div>
      {/* 基数選択 */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>入力基数 / input base</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '6px' }}>
          {BASES.map(b => (
            <button
              key={b.value}
              onClick={() => { setBase(b.value); setResult(null); setError(null) }}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '12px',
                padding: '5px 14px',
                borderRadius: '4px',
                border: base === b.value ? 'none' : '1px solid var(--border)',
                backgroundColor: base === b.value ? 'var(--navy)' : 'var(--surface)',
                color: base === b.value ? '#fff' : 'var(--ink-mid)',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* 演算子選択 */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>演算子 / operator</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '6px' }}>
          {OPS.map(o => (
            <button
              key={o.value}
              onClick={() => { setOp(o.value); setResult(null); setError(null) }}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '12px',
                padding: '5px 14px',
                borderRadius: '4px',
                border: op === o.value ? 'none' : '1px solid var(--border)',
                backgroundColor: op === o.value ? 'var(--teal)' : 'var(--surface)',
                color: op === o.value ? '#fff' : 'var(--ink-mid)',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {o.value}
            </button>
          ))}
        </div>
      </div>

      {/* 入力フィールド */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={labelStyle}>
            値 A
          </label>
          <input
            type="text"
            value={inputA}
            onChange={e => { setInputA(e.target.value); setResult(null); setError(null) }}
            placeholder={base === 2 ? '例: 1100' : base === 8 ? '例: 17' : base === 16 ? '例: FF' : '例: 255'}
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ ...labelStyle, color: currentOp.needsB ? 'var(--ink-light)' : 'var(--ink-faint)' }}>
            値 B
            {!currentOp.needsB && (
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10px',
                color: 'var(--ink-faint)',
                marginLeft: '8px',
                letterSpacing: '0.06em',
              }}>
                ({op} は B 不要)
              </span>
            )}
          </label>
          <input
            type="text"
            value={inputB}
            onChange={e => { setInputB(e.target.value); setResult(null); setError(null) }}
            placeholder={currentOp.needsB ? (base === 2 ? '例: 1010' : base === 8 ? '例: 12' : base === 16 ? '例: 0F' : '例: 170') : '不使用'}
            disabled={!currentOp.needsB}
            style={{
              ...inputStyle,
              opacity: currentOp.needsB ? 1 : 0.4,
              cursor: currentOp.needsB ? 'text' : 'default',
            }}
            onFocus={e => { if (currentOp.needsB) e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>
      </div>

      {/* ボタン */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={handleCalc}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '12px',
            letterSpacing: '0.06em',
            padding: '6px 18px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: 'var(--navy)',
            color: '#fff',
            transition: 'background 0.15s',
          }}
        >
          計算する
        </button>
        <button
          onClick={handleClear}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '12px',
            letterSpacing: '0.06em',
            padding: '6px 16px',
            borderRadius: '4px',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            backgroundColor: 'var(--surface)',
            color: 'var(--ink-mid)',
          }}
        >
          クリア
        </button>
      </div>

      {/* エラー表示 */}
      {error && (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: '#c85050',
          backgroundColor: 'rgba(200,80,80,0.08)',
          border: '1px solid rgba(200,80,80,0.25)',
          borderRadius: '4px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      {/* 結果表示 */}
      {result && (
        <div style={{
          backgroundColor: '#111820',
          borderRadius: '6px',
          padding: '1.25rem 1.5rem',
          fontFamily: 'var(--font-jetbrains), monospace',
        }}>
          <div style={{
            fontSize: '10px',
            letterSpacing: '0.14em',
            color: '#63a4d8',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            result
          </div>
          <ResultRow label="BIN" value={formatBinaryBlocks(result.bin)} />
          <ResultRow label="OCT" value={result.oct} />
          <ResultRow label="DEC" value={result.dec} />
          <ResultRow label="HEX" value={result.hex} />
        </div>
      )}

      {/* 初期状態 */}
      {!result && !error && (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-faint)',
          textAlign: 'center',
          padding: '2rem',
          border: '1px dashed var(--border-light)',
          borderRadius: '4px',
        }}>
          値Aを入力して「計算する」ボタンを押すと結果が表示されます
        </div>
      )}
    </div>
  )
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: '1rem',
      padding: '0.4rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <span style={{
        fontSize: '10px',
        color: '#63a4d8',
        letterSpacing: '0.1em',
        minWidth: '2.5rem',
        flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '14px',
        color: '#2ec880',
        letterSpacing: '0.06em',
        wordBreak: 'break-all',
      }}>
        {value}
      </span>
    </div>
  )
}

/** 32bit 2進数を8bit区切りでスペース表示 */
function formatBinaryBlocks(bin: string): string {
  return bin.match(/.{1,8}/g)?.join(' ') ?? bin
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: '10px',
  letterSpacing: '0.1em',
  color: 'var(--ink-light)',
  textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
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
