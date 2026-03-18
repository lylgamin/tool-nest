'use client'

import { useState } from 'react'
import { getHolidays, holidaysToText } from '../utils'
import { useCopy } from '../../_components/useCopy'

export default function JapanHolidaysTool() {
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const { copied, copy } = useCopy()
  const [calculated, setCalculated] = useState(false)

  const y = parseInt(year, 10)
  const valid = !isNaN(y) && y >= 1948 && y <= 2100
  const holidays = (valid && calculated) ? getHolidays(y) : []

  const handleCalculate = () => {
    if (valid) setCalculated(true)
  }

  const handleCopy = () => {
    const text = holidaysToText(holidays)
    copy(text)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: 'var(--ink-faint)', letterSpacing: '0.1em', marginBottom: '4px' }}>
            YEAR
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={year}
            onChange={e => { setYear(e.target.value); setCalculated(false) }}
            placeholder="2024"
            style={{ width: '100px', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '14px', color: 'var(--ink)', background: 'var(--surface-alt)', boxSizing: 'border-box' }}
          />
        </div>
        <button
          onClick={handleCalculate}
          disabled={!valid}
          style={{ padding: '8px 20px', backgroundColor: valid ? 'var(--navy)' : 'var(--border)', color: valid ? '#fff' : 'var(--ink-faint)', border: 'none', borderRadius: '4px', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', cursor: valid ? 'pointer' : 'default' }}
        >
          計算
        </button>
      </div>

      {calculated && holidays.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: 'var(--ink-faint)' }}>
              {y}年の祝日: {holidays.length}件
            </span>
            <button
              onClick={handleCopy}
              style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', padding: '4px 12px', border: '1px solid var(--border)', borderRadius: '3px', background: copied ? 'var(--teal-mid)' : 'var(--surface)', color: copied ? 'var(--teal)' : 'var(--ink-mid)', cursor: 'pointer' }}
            >
              {copied ? 'コピーしました' : '日付リストをコピー'}
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '6px 8px', color: 'var(--ink-light)', fontWeight: 400, fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em' }}>DATE</th>
                <th style={{ textAlign: 'left', padding: '6px 8px', color: 'var(--ink-light)', fontWeight: 400, fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em' }}>名称</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map(h => (
                <tr key={h.date} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '8px 8px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', color: 'var(--navy)' }}>{h.date}</td>
                  <td style={{ padding: '8px 8px', color: 'var(--ink-mid)' }}>{h.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!calculated && (
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-faint)', textAlign: 'center', padding: '2rem 0' }}>
          年を入力して「計算」ボタンを押してください
        </p>
      )}
    </div>
  )
}
