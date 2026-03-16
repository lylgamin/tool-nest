'use client'

import { useState } from 'react'
import { getDayOfYear } from '../utils'

function todayString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function DayOfYearTool() {
  const [dateInput, setDateInput] = useState(todayString())

  let result = null
  let error = null
  try {
    const parts = dateInput.split('-').map(Number)
    if (parts.length !== 3 || parts.some(isNaN)) throw new Error()
    const [y, m, d] = parts
    if (m < 1 || m > 12 || d < 1 || d > 31) throw new Error()
    result = getDayOfYear(y, m, d)
  } catch {
    error = '有効な日付を入力してください（形式: yyyy-mm-dd）'
  }

  return (
    <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif' }}>
      {/* 入力 */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: '12px', color: 'var(--ink-light)', marginBottom: '4px', display: 'block' }}>
            日付
          </label>
          <input
            type="text"
            value={dateInput}
            onChange={e => setDateInput(e.target.value)}
            placeholder="yyyy-mm-dd"
            style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '14px', color: 'var(--ink)', backgroundColor: 'var(--surface-alt)', outline: 'none', width: '150px' }}
          />
        </div>
        <button
          onClick={() => setDateInput(todayString())}
          style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: '4px', backgroundColor: 'var(--surface)', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)', cursor: 'pointer' }}
        >
          今日
        </button>
      </div>

      {error && <p style={{ color: 'var(--ink-light)', fontSize: '13px' }}>{error}</p>}

      {result && (
        <div>
          {/* メインカード */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {[
              { label: '経過日数',     value: `${result.dayOfYear}日目`, sub: `/ ${result.totalDays}日` },
              { label: '残り日数',     value: `${result.remaining}日`,   sub: result.isLeapYear ? 'うるう年' : '平年' },
              { label: '曜日',         value: result.dayOfWeekJa,        sub: '' },
              { label: 'シンプル週番号', value: `第${result.simpleWeek}週`, sub: 'Math.ceil(dayOfYear / 7)' },
              { label: 'ISO週番号',    value: `W${String(result.isoWeek).padStart(2, '0')}`, sub: `${result.isoYear}年` },
            ].map(({ label, value, sub }) => (
              <div key={label} style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '0.75rem 1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--ink-faint)', fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '0.06em', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '18px', fontWeight: 500, color: 'var(--ink)', fontFamily: 'var(--font-jetbrains), monospace' }}>{value}</div>
                {sub && <div style={{ fontSize: '11px', color: 'var(--ink-light)', marginTop: '2px' }}>{sub}</div>}
              </div>
            ))}
          </div>

          {/* 進捗バー */}
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--ink-light)', fontFamily: 'var(--font-noto-sans), sans-serif' }}>年間進捗</span>
              <span style={{ fontSize: '12px', color: 'var(--navy)', fontFamily: 'var(--font-jetbrains), monospace' }}>{result.progress}%</span>
            </div>
            <div style={{ height: '6px', backgroundColor: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${result.progress}%`, backgroundColor: 'var(--teal)', borderRadius: '3px', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
