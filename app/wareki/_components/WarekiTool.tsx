'use client'

import { useState } from 'react'
import { toWareki, toSeireki, type EraStyle } from '../utils'

type Tab = 'toWareki' | 'toSeireki'

export default function WarekiTool() {
  const [tab, setTab] = useState<Tab>('toWareki')

  return (
    <div>
      {/* タブ */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
        {([['toWareki', '西暦 → 和暦'], ['toSeireki', '和暦 → 西暦']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              fontFamily: 'var(--font-noto-sans), sans-serif',
              fontSize: '13px',
              padding: '8px 20px',
              background: 'none',
              border: 'none',
              borderBottom: tab === id ? '2px solid var(--teal)' : '2px solid transparent',
              color: tab === id ? 'var(--teal)' : 'var(--ink-light)',
              cursor: 'pointer',
              marginBottom: '-1px',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'toWareki' ? <ToWarekiPanel /> : <ToSeirekiPanel />}
    </div>
  )
}

function ToWarekiPanel() {
  const today = new Date()
  const [year, setYear] = useState(String(today.getFullYear()))
  const [month, setMonth] = useState(String(today.getMonth() + 1))
  const [day, setDay] = useState(String(today.getDate()))
  const [style, setStyle] = useState<EraStyle>('kanji')

  const y = parseInt(year, 10)
  const m = parseInt(month, 10)
  const d = parseInt(day, 10)
  const valid = !isNaN(y) && !isNaN(m) && !isNaN(d) && m >= 1 && m <= 12 && d >= 1 && d <= 31
  const result = valid ? toWareki(y, m, d, style) : null

  return (
    <div>
      {/* スタイル選択 */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
        {([['kanji', '漢字（令和6年）'], ['alpha', '英字（R6）']] as const).map(([val, label]) => (
          <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)' }}>
            <input type="radio" name="style" value={val} checked={style === val} onChange={() => setStyle(val)} />
            {label}
          </label>
        ))}
      </div>

      {/* 日付入力 */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <Field label="西暦" value={year} onChange={setYear} placeholder="2024" width="100px" />
        <Field label="月" value={month} onChange={setMonth} placeholder="1" width="70px" />
        <Field label="日" value={day} onChange={setDay} placeholder="1" width="70px" />
      </div>

      {/* 結果 */}
      <ResultBox result={result === null && valid ? 'エラー: 明治元年(1868年1月25日)より前の日付は対応していません' : result?.full ?? ''} />
    </div>
  )
}

function ToSeirekiPanel() {
  const [era, setEra] = useState('令和')
  const [eraYear, setEraYear] = useState('6')
  const [month, setMonth] = useState('1')
  const [day, setDay] = useState('1')

  const y = parseInt(eraYear, 10)
  const m = parseInt(month, 10)
  const d = parseInt(day, 10)
  const valid = !isNaN(y) && !isNaN(m) && !isNaN(d)
  const result = valid ? toSeireki(era, y, m, d) : null

  const resultText = result ? `${result.year}年${result.month}月${result.day}日` : valid ? 'エラー: 変換できません' : ''

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: 'var(--ink-faint)', letterSpacing: '0.1em', marginBottom: '4px' }}>元号</label>
          <select
            value={era}
            onChange={e => setEra(e.target.value)}
            style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--surface-alt)', color: 'var(--ink)' }}
          >
            {['令和', '平成', '昭和', '大正', '明治'].map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <Field label="年" value={eraYear} onChange={setEraYear} placeholder="6" width="70px" />
        <Field label="月" value={month} onChange={setMonth} placeholder="1" width="70px" />
        <Field label="日" value={day} onChange={setDay} placeholder="1" width="70px" />
      </div>
      <ResultBox result={resultText} />
    </div>
  )
}

function Field({ label, value, onChange, placeholder, width }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; width: string
}) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: 'var(--ink-faint)', letterSpacing: '0.1em', marginBottom: '4px' }}>
        {label}
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '14px', color: 'var(--ink)', background: 'var(--surface-alt)', boxSizing: 'border-box' }}
      />
    </div>
  )
}

function ResultBox({ result }: { result: string }) {
  if (!result) return null
  const isError = result.startsWith('エラー')
  return (
    <div style={{
      padding: '1rem 1.25rem',
      backgroundColor: isError ? 'rgba(180,0,0,0.06)' : 'var(--navy-light)',
      border: `1px solid ${isError ? 'rgba(180,0,0,0.2)' : 'var(--border)'}`,
      borderRadius: '4px',
      fontFamily: 'var(--font-jetbrains), monospace',
      fontSize: '18px',
      color: isError ? '#a00' : 'var(--navy)',
    }}>
      {result}
    </div>
  )
}
