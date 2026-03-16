'use client'

import { useState } from 'react'
import { calcBusinessDays, parseHolidayText } from '../utils'

export default function BusinessDaysTool() {
  const today = new Date()
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const [startDate, setStartDate] = useState(fmt(today))
  const [endDate, setEndDate] = useState(fmt(new Date(today.getFullYear(), today.getMonth() + 1, 0)))
  const [excludeSaturday, setExcludeSaturday] = useState(true)
  const [holidayText, setHolidayText] = useState('')

  const holidays = parseHolidayText(holidayText)
  const result = calcBusinessDays({ startDate, endDate, excludeSaturday, holidays })

  return (
    <div>
      {/* 日付入力 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: 'var(--ink-faint)', letterSpacing: '0.1em', marginBottom: '4px' }}>開始日</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', color: 'var(--ink)', background: 'var(--surface-alt)', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: 'var(--ink-faint)', letterSpacing: '0.1em', marginBottom: '4px' }}>終了日</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', color: 'var(--ink)', background: 'var(--surface-alt)', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* オプション */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)' }}>
          <input
            type="checkbox"
            checked={excludeSaturday}
            onChange={e => setExcludeSaturday(e.target.checked)}
          />
          土曜日を除外する
        </label>
      </div>

      {/* 祝日入力 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: 'var(--ink-faint)', letterSpacing: '0.1em', marginBottom: '4px' }}>
          祝日リスト（1行1日付、yyyy-mm-dd形式）
        </label>
        <textarea
          value={holidayText}
          onChange={e => setHolidayText(e.target.value)}
          placeholder={'2024-01-01\n2024-01-08\n2024-02-11\n...'}
          rows={6}
          style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', color: 'var(--ink)', background: 'var(--surface-alt)', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7 }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        />
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: 'var(--ink-faint)', marginTop: '4px' }}>
          {holidays.length > 0 ? `${holidays.length}件の祝日を認識` : '「日本の祝日計算」ツールからコピーした日付を貼り付けてください'}
        </div>
      </div>

      {/* 結果 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
        <ResultCard label="営業日数" sub="business days" value={result.businessDays} highlight />
        <ResultCard label="期間合計" sub="total days" value={result.totalDays} />
        <ResultCard label="除外: 日曜" sub="sundays" value={result.excludedSundays} />
        <ResultCard label="除外: 土曜" sub="saturdays" value={result.excludedSaturdays} />
        <ResultCard label="除外: 祝日" sub="holidays" value={result.excludedHolidays} />
      </div>
    </div>
  )
}

function ResultCard({ label, sub, value, highlight }: { label: string; sub: string; value: number; highlight?: boolean }) {
  return (
    <div style={{
      backgroundColor: highlight ? 'var(--navy-light)' : 'var(--surface)',
      border: `1px solid ${highlight ? 'var(--border)' : 'var(--border-light)'}`,
      borderRadius: '4px',
      padding: '1rem',
      textAlign: 'center',
    }}>
      <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: highlight ? '32px' : '24px', fontWeight: 400, color: 'var(--navy)', lineHeight: 1 }}>
        {value.toLocaleString()}
      </div>
      <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)', marginTop: '6px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '9px', color: 'var(--ink-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>
        {sub}
      </div>
    </div>
  )
}
