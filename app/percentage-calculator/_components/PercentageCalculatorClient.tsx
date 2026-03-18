'use client'

import { useState } from 'react'
import { calcWhatPercent, calcPercentOf, calcPercentChange, calcTotal, fmtNumber } from '../utils'
import { useCopy } from '../../_components/useCopy'

type TabId = 'A' | 'B' | 'C' | 'D'

const TABS: { id: TabId; label: string; desc: string }[] = [
  { id: 'A', label: '何%か', desc: '「値」が「全体」の何%かを求める' },
  { id: 'B', label: 'n%はいくつか', desc: '「全体」の「n%」がいくつかを求める' },
  { id: 'C', label: '増減率', desc: '「変化前」から「変化後」への増減率を求める' },
  { id: 'D', label: '全体を求める', desc: '「値」が「n%」のとき全体を逆算する' },
]

const inputStyle: React.CSSProperties = {
  padding: '0.6rem 0.875rem',
  backgroundColor: 'var(--surface-alt)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: '15px',
  color: 'var(--ink)',
  outline: 'none',
  boxSizing: 'border-box',
  width: '100%',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: '10px',
  letterSpacing: '0.12em',
  color: 'var(--ink-light)',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '5px',
}

function NumInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={labelStyle}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? '数値を入力'}
        style={inputStyle}
        onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
        onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
      />
    </div>
  )
}

function ResultBox({ result, unit = '%' }: { result: number | null; unit?: string }) {
  const { copied, copy } = useCopy()
  const display = result !== null ? fmtNumber(result) : null

  return (
    <div style={{
      backgroundColor: '#111820',
      borderRadius: '6px',
      padding: '1rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      minHeight: '54px',
    }}>
      {display !== null ? (
        <>
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '22px',
            color: '#2ec880',
            fontWeight: 500,
          }}>
            {display}
            <span style={{ fontSize: '14px', marginLeft: '4px', color: '#63a4d8' }}>{unit}</span>
          </span>
          <button
            onClick={() => copy(display)}
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11px',
              letterSpacing: '0.08em',
              padding: '5px 12px',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '3px',
              backgroundColor: 'transparent',
              color: copied ? 'var(--teal)' : '#a8b8c8',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {copied ? 'コピー済み ✓' : 'コピー'}
          </button>
        </>
      ) : (
        <span style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: '#4a5568',
        }}>
          数値を入力すると結果が表示されます
        </span>
      )}
    </div>
  )
}

function TabA() {
  const [value, setValue] = useState('')
  const [total, setTotal] = useState('')
  const v = parseFloat(value)
  const t = parseFloat(total)
  const result = value !== '' && total !== '' ? calcWhatPercent(v, t) : null
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)', marginBottom: '1.25rem', lineHeight: 1.7 }}>
        「値」が「全体」の何パーセントかを計算します。
        例：25 ÷ 200 × 100 = 12.5%
      </p>
      <NumInput label="値 (value)" value={value} onChange={setValue} placeholder="例: 25" />
      <NumInput label="全体 (total)" value={total} onChange={setTotal} placeholder="例: 200" />
      <div style={{ marginBottom: '6px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>
        結果
      </div>
      <ResultBox result={result} unit="%" />
    </div>
  )
}

function TabB() {
  const [percent, setPercent] = useState('')
  const [total, setTotal] = useState('')
  const p = parseFloat(percent)
  const t = parseFloat(total)
  const result = percent !== '' && total !== '' ? calcPercentOf(p, t) : null
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)', marginBottom: '1.25rem', lineHeight: 1.7 }}>
        「全体」の「n%」がいくつになるかを計算します。
        例：200 の 12.5% = 25
      </p>
      <NumInput label="パーセント (%)" value={percent} onChange={setPercent} placeholder="例: 12.5" />
      <NumInput label="全体 (total)" value={total} onChange={setTotal} placeholder="例: 200" />
      <div style={{ marginBottom: '6px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>
        結果
      </div>
      <ResultBox result={result} unit="" />
    </div>
  )
}

function TabC() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const f = parseFloat(from)
  const t = parseFloat(to)
  const result = from !== '' && to !== '' ? calcPercentChange(f, t) : null
  const isNegative = result !== null && result < 0
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)', marginBottom: '1.25rem', lineHeight: 1.7 }}>
        変化前の値から変化後の値への増減率（%）を計算します。
        例：100 → 120 = +20%
      </p>
      <NumInput label="変化前 (from)" value={from} onChange={setFrom} placeholder="例: 100" />
      <NumInput label="変化後 (to)" value={to} onChange={setTo} placeholder="例: 120" />
      <div style={{ marginBottom: '6px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>
        結果
      </div>
      <div style={{
        backgroundColor: '#111820',
        borderRadius: '6px',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        minHeight: '54px',
      }}>
        {result !== null ? (
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '22px',
            color: isNegative ? '#f87171' : '#2ec880',
            fontWeight: 500,
          }}>
            {result > 0 ? '+' : ''}{fmtNumber(result)}
            <span style={{ fontSize: '14px', marginLeft: '4px', color: '#63a4d8' }}>%</span>
          </span>
        ) : (
          <span style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: '#4a5568' }}>
            数値を入力すると結果が表示されます
          </span>
        )}
      </div>
    </div>
  )
}

function TabD() {
  const [value, setValue] = useState('')
  const [percent, setPercent] = useState('')
  const v = parseFloat(value)
  const p = parseFloat(percent)
  const result = value !== '' && percent !== '' ? calcTotal(v, p) : null
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)', marginBottom: '1.25rem', lineHeight: 1.7 }}>
        「値」が全体の「n%」であるとき、全体の数値を逆算します。
        例：25 が 12.5% なら全体 = 200
      </p>
      <NumInput label="値 (value)" value={value} onChange={setValue} placeholder="例: 25" />
      <NumInput label="パーセント (%)" value={percent} onChange={setPercent} placeholder="例: 12.5" />
      <div style={{ marginBottom: '6px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>
        結果
      </div>
      <ResultBox result={result} unit="" />
    </div>
  )
}

const TAB_CONTENT: Record<TabId, React.ReactNode> = {
  A: <TabA />,
  B: <TabB />,
  C: <TabC />,
  D: <TabD />,
}

export default function PercentageCalculatorClient() {
  const [activeTab, setActiveTab] = useState<TabId>('A')

  return (
    <div>
      {/* タブ */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '12px',
              letterSpacing: '0.06em',
              padding: '7px 16px',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
              backgroundColor: activeTab === tab.id ? 'var(--navy)' : 'var(--surface)',
              color: activeTab === tab.id ? '#ffffff' : 'var(--ink-mid)',
              borderColor: activeTab === tab.id ? 'var(--navy)' : 'var(--border)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* タブの説明 */}
      <div style={{
        fontFamily: 'var(--font-noto-sans), sans-serif',
        fontSize: '11px',
        color: 'var(--teal)',
        letterSpacing: '0.04em',
        marginBottom: '1.25rem',
        paddingLeft: '2px',
      }}>
        {TABS.find(t => t.id === activeTab)?.desc}
      </div>

      {/* タブコンテンツ */}
      {TAB_CONTENT[activeTab]}
    </div>
  )
}
