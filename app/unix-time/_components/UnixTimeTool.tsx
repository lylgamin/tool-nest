'use client'

import { useState } from 'react'
import { fromUnix, toUnix } from '../utils'

type Tab = 'from' | 'to'

const TZ_OPTIONS = [
  { label: 'UTC (+0:00)',         offset: 0   },
  { label: 'JST (+9:00)',         offset: 9   },
  { label: 'CST (+8:00)',         offset: 8   },
  { label: 'IST (+5:30)',         offset: 5.5 },
  { label: 'CET (+1:00)',         offset: 1   },
  { label: 'EST (-5:00)',         offset: -5  },
  { label: 'PST (-8:00)',         offset: -8  },
  { label: 'AEST (+10:00)',       offset: 10  },
]

export default function UnixTimeTool() {
  const [tab, setTab] = useState<Tab>('from')

  // Tab 1 state
  const [unixInput, setUnixInput] = useState('0')

  // Tab 2 state
  const [dateInput, setDateInput] = useState('2024-01-01')
  const [timeInput, setTimeInput] = useState('00:00:00')
  const [tzOffset, setTzOffset] = useState(9)

  const tabStyle = (active: boolean) => ({
    padding: '8px 16px',
    border: 'none',
    borderBottom: active ? '2px solid var(--navy)' : '2px solid transparent',
    backgroundColor: 'transparent',
    fontFamily: 'var(--font-noto-sans), sans-serif',
    fontSize: '13px',
    color: active ? 'var(--navy)' : 'var(--ink-light)',
    cursor: 'pointer',
    fontWeight: active ? 500 : 400,
  })

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

  const resultItemStyle = {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: '4px',
    padding: '0.75rem 1rem',
    marginBottom: '0.5rem',
  }

  return (
    <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif' }}>
      {/* タブ */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
        <button style={tabStyle(tab === 'from')} onClick={() => setTab('from')}>
          タイムスタンプ → 日時
        </button>
        <button style={tabStyle(tab === 'to')} onClick={() => setTab('to')}>
          日時 → タイムスタンプ
        </button>
      </div>

      {tab === 'from' && (
        <div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <label style={labelStyle}>Unixタイムスタンプ（秒）</label>
              <input
                type="number"
                value={unixInput}
                onChange={e => setUnixInput(e.target.value)}
                style={{ ...inputStyle, width: '200px' }}
              />
            </div>
            <button
              onClick={() => setUnixInput(String(Math.floor(Date.now() / 1000)))}
              style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: '4px', backgroundColor: 'var(--surface)', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)', cursor: 'pointer' }}
            >
              現在時刻
            </button>
          </div>
          {(() => {
            const unix = Number(unixInput)
            if (!isFinite(unix)) return <p style={{ color: 'var(--ink-light)', fontSize: '13px' }}>有効な数値を入力してください</p>
            const r = fromUnix(unix)
            return (
              <div>
                {[
                  { label: 'ISO 8601 (UTC)', value: r.iso },
                  { label: 'UTC',            value: r.utc },
                  { label: 'JST',            value: r.jst },
                  { label: 'Unixミリ秒',      value: String(r.unixMs) },
                ].map(({ label, value }) => (
                  <div key={label} style={resultItemStyle}>
                    <div style={{ fontSize: '11px', color: 'var(--ink-faint)', fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontSize: '15px', fontFamily: 'var(--font-jetbrains), monospace', color: 'var(--ink)' }}>{value}</div>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      )}

      {tab === 'to' && (
        <div>
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
              <label style={labelStyle}>タイムゾーン</label>
              <select
                value={tzOffset}
                onChange={e => setTzOffset(Number(e.target.value))}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {TZ_OPTIONS.map(tz => (
                  <option key={tz.label} value={tz.offset}>{tz.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                const now = new Date()
                const offsetMs = tzOffset * 60 * 60 * 1000
                const local = new Date(now.getTime() + offsetMs)
                const y  = local.getUTCFullYear()
                const mo = String(local.getUTCMonth() + 1).padStart(2, '0')
                const d  = String(local.getUTCDate()).padStart(2, '0')
                const h  = String(local.getUTCHours()).padStart(2, '0')
                const mi = String(local.getUTCMinutes()).padStart(2, '0')
                const s  = String(local.getUTCSeconds()).padStart(2, '0')
                setDateInput(`${y}-${mo}-${d}`)
                setTimeInput(`${h}:${mi}:${s}`)
              }}
              style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: '4px', backgroundColor: 'var(--surface)', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)', cursor: 'pointer' }}
            >
              現在時刻
            </button>
          </div>
          {(() => {
            try {
              const unix = toUnix(dateInput, timeInput, tzOffset)
              if (!isFinite(unix)) throw new Error()
              return (
                <div>
                  {[
                    { label: 'Unixタイムスタンプ（秒）',   value: String(unix) },
                    { label: 'Unixタイムスタンプ（ミリ秒）', value: String(unix * 1000) },
                  ].map(({ label, value }) => (
                    <div key={label} style={resultItemStyle}>
                      <div style={{ fontSize: '11px', color: 'var(--ink-faint)', fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
                      <div style={{ fontSize: '15px', fontFamily: 'var(--font-jetbrains), monospace', color: 'var(--ink)' }}>{value}</div>
                    </div>
                  ))}
                </div>
              )
            } catch {
              return <p style={{ color: 'var(--ink-light)', fontSize: '13px' }}>有効な日時を入力してください（形式: yyyy-mm-dd HH:MM:SS）</p>
            }
          })()}
        </div>
      )}
    </div>
  )
}
