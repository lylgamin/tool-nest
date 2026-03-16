'use client'

import { useState } from 'react'
import { TIMEZONES, convertAllTimezones, parseToUnixMs } from '../utils'
import type { ConvertedTime } from '../utils'

export default function TimezoneTool() {
  const [dateInput, setDateInput] = useState('2024-01-01')
  const [timeInput, setTimeInput] = useState('00:00:00')
  const [sourceTz, setSourceTz]   = useState('JST')
  const [copied, setCopied]       = useState<string | null>(null)

  let results: ConvertedTime[] | null = null
  let error: string | null = null
  try {
    const ms = parseToUnixMs(dateInput, timeInput, sourceTz)
    results = convertAllTimezones(ms)
  } catch {
    error = '有効な日時を入力してください（形式: yyyy-mm-dd HH:MM:SS）'
  }

  function handleNow() {
    const tz = TIMEZONES.find(t => t.id === sourceTz)!
    const offsetSign = tz.offset.startsWith('-') ? -1 : 1
    const offsetParts = tz.offset.replace(/[+-]/, '').split(':').map(Number)
    const offsetMs = offsetSign * (offsetParts[0] * 60 + (offsetParts[1] || 0)) * 60 * 1000
    const local = new Date(Date.now() + offsetMs)
    const y  = local.getUTCFullYear()
    const mo = String(local.getUTCMonth() + 1).padStart(2, '0')
    const d  = String(local.getUTCDate()).padStart(2, '0')
    const h  = String(local.getUTCHours()).padStart(2, '0')
    const mi = String(local.getUTCMinutes()).padStart(2, '0')
    const s  = String(local.getUTCSeconds()).padStart(2, '0')
    setDateInput(`${y}-${mo}-${d}`)
    setTimeInput(`${h}:${mi}:${s}`)
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    fontFamily: 'var(--font-jetbrains), monospace',
    fontSize: '14px',
    color: 'var(--ink)',
    backgroundColor: 'var(--surface-alt)',
    outline: 'none',
  }

  const labelStyle = {
    fontSize: '12px',
    color: 'var(--ink-light)',
    fontFamily: 'var(--font-noto-sans), sans-serif',
    marginBottom: '4px',
    display: 'block' as const,
  }

  return (
    <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif' }}>
      {/* 入力 */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <label style={labelStyle}>日付</label>
          <input
            type="text"
            value={dateInput}
            onChange={e => setDateInput(e.target.value)}
            placeholder="yyyy-mm-dd"
            style={{ ...inputStyle, width: '130px' }}
          />
        </div>
        <div>
          <label style={labelStyle}>時刻</label>
          <input
            type="text"
            value={timeInput}
            onChange={e => setTimeInput(e.target.value)}
            placeholder="HH:MM:SS"
            style={{ ...inputStyle, width: '110px' }}
          />
        </div>
        <div>
          <label style={labelStyle}>元タイムゾーン</label>
          <select
            value={sourceTz}
            onChange={e => setSourceTz(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {TIMEZONES.map(tz => (
              <option key={tz.id} value={tz.id}>{tz.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleNow}
          style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: '4px', backgroundColor: 'var(--surface)', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)', cursor: 'pointer' }}
        >
          現在時刻
        </button>
      </div>

      {/* 結果 */}
      {error && <p style={{ color: 'var(--ink-light)', fontSize: '13px' }}>{error}</p>}
      {results && (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {results.map(r => (
            <div
              key={r.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: r.id === sourceTz ? 'var(--navy-light)' : 'var(--surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                padding: '0.75rem 1rem',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', minWidth: 0 }}>
                <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: 'var(--ink-faint)', letterSpacing: '0.08em', width: '3.5rem', flexShrink: 0 }}>{r.id}</span>
                <span style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)', flexShrink: 0 }}>{r.label}</span>
                <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '14px', color: 'var(--ink)' }}>{r.formatted}</span>
              </div>
              <button
                onClick={() => handleCopy(r.formatted, r.id)}
                style={{ padding: '4px 10px', border: '1px solid var(--border-light)', borderRadius: '3px', backgroundColor: 'transparent', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: copied === r.id ? 'var(--teal)' : 'var(--ink-light)', cursor: 'pointer', flexShrink: 0 }}
              >
                {copied === r.id ? 'copied!' : 'copy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
