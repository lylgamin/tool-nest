'use client'

import { useState } from 'react'
import { parseCron, getNextExecutions } from '../utils'

const PRESETS: { label: string; expr: string }[] = [
  { label: '毎分', expr: '* * * * *' },
  { label: '毎時', expr: '0 * * * *' },
  { label: '毎日9時', expr: '0 9 * * *' },
  { label: '平日9時', expr: '0 9 * * 1-5' },
  { label: '毎月1日', expr: '0 0 1 * *' },
  { label: '5分ごと', expr: '*/5 * * * *' },
  { label: '毎週日曜', expr: '0 0 * * 0' },
]

const FIELD_LABELS = ['分', '時', '日', '月', '曜']

function formatDate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}/${mm}/${dd} ${hh}:${min}`
}

export default function CronParserClient() {
  const [expr, setExpr] = useState('0 9 * * 1-5')

  const result = parseCron(expr)
  const nextExecutions = result.ok ? getNextExecutions(result.fields, 5) : []

  const fieldValues = result.ok
    ? [result.fields.minute, result.fields.hour, result.fields.dayOfMonth, result.fields.month, result.fields.dayOfWeek]
    : expr.trim().split(/\s+/).slice(0, 5)

  return (
    <div>
      {/* プリセットボタン */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          プリセット
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {PRESETS.map((p) => (
            <button
              key={p.expr}
              onClick={() => setExpr(p.expr)}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                letterSpacing: '0.06em',
                padding: '5px 12px',
                border: '1px solid var(--border)',
                borderRadius: '3px',
                backgroundColor: expr === p.expr ? 'var(--navy)' : 'var(--surface-alt)',
                color: expr === p.expr ? '#ffffff' : 'var(--ink-mid)',
                cursor: 'pointer',
                transition: 'background-color 0.15s, color 0.15s',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 入力フィールド */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '6px',
        }}>
          cron式を入力
        </label>
        <input
          type="text"
          value={expr}
          onChange={e => setExpr(e.target.value)}
          placeholder="0 9 * * 1-5"
          spellCheck={false}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--surface-alt)',
            border: `1px solid ${result.ok || !expr.trim() ? 'var(--border)' : 'rgba(180,40,40,0.5)'}`,
            borderRadius: '4px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '16px',
            color: 'var(--ink)',
            outline: 'none',
            boxSizing: 'border-box',
            letterSpacing: '0.06em',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
          onBlur={e => {
            e.currentTarget.style.borderColor =
              result.ok || !expr.trim() ? 'var(--border)' : 'rgba(180,40,40,0.5)'
          }}
        />
      </div>

      {/* フィールド分解表示 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          フィールド分解
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {FIELD_LABELS.map((label, i) => {
            const val = fieldValues[i] ?? '-'
            return (
              <div
                key={label}
                style={{
                  backgroundColor: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '8px 14px',
                  textAlign: 'center',
                  minWidth: '60px',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '18px',
                  fontWeight: 500,
                  color: val === '*' ? 'var(--ink-faint)' : 'var(--teal)',
                  marginBottom: '2px',
                }}>
                  {val}
                </div>
                <div style={{
                  fontFamily: 'var(--font-noto-sans), sans-serif',
                  fontSize: '10px',
                  color: 'var(--ink-light)',
                  letterSpacing: '0.05em',
                }}>
                  {label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* エラー表示 */}
      {!result.ok && expr.trim() && (
        <div style={{
          backgroundColor: 'rgba(180,40,40,0.07)',
          border: '1px solid rgba(180,40,40,0.25)',
          borderRadius: '4px',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: '#b42828',
        }}>
          {result.error}
        </div>
      )}

      {/* 日本語説明 */}
      {result.ok && (
        <div style={{
          backgroundColor: 'var(--navy-light)',
          border: '1px solid rgba(27,45,79,0.12)',
          borderRadius: '4px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: 'var(--ink-light)',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}>
            意味
          </div>
          <div style={{
            fontFamily: 'var(--font-noto-sans), sans-serif',
            fontSize: '18px',
            fontWeight: 500,
            color: 'var(--navy)',
            lineHeight: 1.5,
          }}>
            {result.description}
          </div>
        </div>
      )}

      {/* 次回実行時刻 */}
      {result.ok && (
        <div>
          <div style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: 'var(--ink-light)',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            次回実行時刻（5件）
          </div>
          {nextExecutions.length === 0 ? (
            <div style={{
              fontFamily: 'var(--font-noto-sans), sans-serif',
              fontSize: '13px',
              color: 'var(--ink-light)',
            }}>
              該当する実行時刻が見つかりませんでした（1年以内）
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {nextExecutions.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '3px',
                    padding: '8px 14px',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '10px',
                    color: 'var(--ink-faint)',
                    minWidth: '16px',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '14px',
                    color: 'var(--ink)',
                  }}>
                    {formatDate(d)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
