'use client'

import { useState, useCallback } from 'react'
import { calcDiff, formatDuration, type DiffResult } from '../utils'

function getNow(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
}

function getOneWeekAgo(): string {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function DateDiffClient() {
  const [date1, setDate1] = useState<string>(getOneWeekAgo)
  const [date2, setDate2] = useState<string>(getNow)

  const result: DiffResult | null = (date1 && date2) ? calcDiff(date1, date2) : null

  const handleSetNowToDate2 = useCallback(() => {
    setDate2(getNow())
  }, [])

  const handleSetNowToDate1 = useCallback(() => {
    setDate1(getNow())
  }, [])

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--surface-alt)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    fontFamily: 'var(--font-jetbrains), monospace',
    fontSize: '14px',
    color: 'var(--ink)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-jetbrains), monospace',
    fontSize: '10px',
    letterSpacing: '0.12em',
    color: 'var(--ink-light)',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px',
  }

  const nowBtnStyle: React.CSSProperties = {
    fontFamily: 'var(--font-jetbrains), monospace',
    fontSize: '11px',
    letterSpacing: '0.06em',
    color: 'var(--teal)',
    background: 'none',
    border: '1px solid var(--border-light)',
    borderRadius: '3px',
    padding: '4px 10px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  }

  return (
    <div>
      {/* 入力フィールド */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {/* 開始日時 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>開始日時</label>
            <button style={nowBtnStyle} onClick={handleSetNowToDate1}>今すぐ設定</button>
          </div>
          <input
            type="datetime-local"
            value={date1}
            onChange={e => setDate1(e.target.value)}
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>

        {/* 終了日時 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>終了日時</label>
            <button style={nowBtnStyle} onClick={handleSetNowToDate2}>今すぐ設定</button>
          </div>
          <input
            type="datetime-local"
            value={date2}
            onChange={e => setDate2(e.target.value)}
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>
      </div>

      {/* 逆転注記 */}
      {result?.isPast && (
        <div style={{
          backgroundColor: 'rgba(31,107,114,0.07)',
          border: '1px solid rgba(31,107,114,0.25)',
          borderRadius: '4px',
          padding: '0.625rem 1rem',
          marginBottom: '1.25rem',
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--teal)',
        }}>
          終了日時が開始日時より前です。差分は絶対値で計算しています。
        </div>
      )}

      {/* 結果エリア */}
      {result ? (
        <div>
          {/* メイン表示 */}
          <div style={{
            backgroundColor: '#111820',
            borderRadius: '6px',
            padding: '1.5rem',
            marginBottom: '1rem',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '10px',
              letterSpacing: '0.14em',
              color: '#63a4d8',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}>
              差分
            </div>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              fontWeight: 500,
              color: '#2ec880',
              lineHeight: 1.2,
              letterSpacing: '0.02em',
              marginBottom: '0.5rem',
            }}>
              {result.days}日 {result.hours}時間 {result.minutes}分 {result.seconds}秒
            </div>
            <div style={{
              fontFamily: 'var(--font-noto-sans), sans-serif',
              fontSize: '14px',
              color: '#a8b8c8',
            }}>
              約 {formatDuration(result)}
            </div>
          </div>

          {/* 年月日概算 */}
          <div style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border-light)',
            borderRadius: '4px',
            padding: '0.875rem 1.25rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'var(--ink-light)',
              textTransform: 'uppercase',
            }}>
              概算
            </span>
            <span style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '15px',
              color: 'var(--navy)',
              fontWeight: 500,
            }}>
              約{result.approxYears}年{result.approxMonths}ヶ月{result.approxDaysRemainder}日
            </span>
          </div>

          {/* 総計カード 4列 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.75rem',
          }}>
            {[
              { label: '総日数', value: result.totalDays.toLocaleString(), unit: '日' },
              { label: '総時間数', value: result.totalHours.toLocaleString(), unit: '時間' },
              { label: '総分数', value: result.totalMinutes.toLocaleString(), unit: '分' },
              { label: '総秒数', value: result.totalSeconds.toLocaleString(), unit: '秒' },
            ].map(({ label, value, unit }) => (
              <div key={label} style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                padding: '0.875rem 1rem',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  color: 'var(--ink-light)',
                  textTransform: 'uppercase',
                  marginBottom: '0.375rem',
                }}>
                  {label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '18px',
                  fontWeight: 500,
                  color: 'var(--ink)',
                  lineHeight: 1.2,
                }}>
                  {value}
                  <span style={{ fontSize: '11px', color: 'var(--ink-mid)', marginLeft: '3px' }}>{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-light)',
          borderRadius: '4px',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-faint)',
        }}>
          開始日時と終了日時を入力してください
        </div>
      )}
    </div>
  )
}
