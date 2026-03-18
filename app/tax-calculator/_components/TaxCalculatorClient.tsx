'use client'

import { useState } from 'react'
import { useCopy, useStringCopy } from '../../_components/useCopy'
import { useLocalInput } from '../../_components/useLocalInput'
import { calcTaxIncluded, calcTaxExcluded, type RoundingMode, type TaxRate } from '../utils'

type TabMode = 'excl-to-incl' | 'incl-to-excl'

export default function TaxCalculatorClient() {
  const [tab, setTab] = useState<TabMode>('excl-to-incl')
  const [rate, setRate] = useState<TaxRate>(0.10)
  const [rounding, setRounding] = useState<RoundingMode>('floor')

  const [exclInput, setExclInput] = useLocalInput('tax-calculator-excl')
  const [inclInput, setInclInput] = useLocalInput('tax-calculator-incl')

  const { copiedKey, copy } = useStringCopy()

  // 税抜→税込の計算
  const exclNum = parseFloat(exclInput)
  const exclResult =
    isFinite(exclNum) && exclNum >= 0
      ? calcTaxIncluded(exclNum, rate, rounding)
      : null

  // 税込→税抜の計算
  const inclNum = parseFloat(inclInput)
  const inclResult =
    isFinite(inclNum) && inclNum >= 0
      ? calcTaxExcluded(inclNum, rate, rounding)
      : null

  const tabStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-noto-sans), sans-serif',
    fontSize: '14px',
    fontWeight: active ? 500 : 400,
    color: active ? 'var(--navy)' : 'var(--ink-mid)',
    background: active ? 'var(--surface-alt)' : 'transparent',
    border: 'none',
    borderBottom: active ? '2px solid var(--teal)' : '2px solid transparent',
    padding: '0.6rem 1.25rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
  })

  const radioGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  }

  return (
    <div>
      {/* タブ */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        marginBottom: '1.5rem',
      }}>
        <button style={tabStyle(tab === 'excl-to-incl')} onClick={() => setTab('excl-to-incl')}>
          税抜 → 税込
        </button>
        <button style={tabStyle(tab === 'incl-to-excl')} onClick={() => setTab('incl-to-excl')}>
          税込 → 税抜
        </button>
      </div>

      {/* 共通設定 */}
      <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* 税率 */}
        <div>
          <div style={{
            fontFamily: 'var(--font-noto-sans), sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--ink-mid)',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem',
          }}>
            税率
          </div>
          <div style={radioGroupStyle}>
            {([0.10, 0.08] as TaxRate[]).map((r) => (
              <label key={r} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '13px',
                color: rate === r ? 'var(--navy)' : 'var(--ink-mid)',
                cursor: 'pointer',
                backgroundColor: rate === r ? 'var(--navy-light)' : 'transparent',
                border: `1px solid ${rate === r ? 'var(--navy)' : 'var(--border)'}`,
                borderRadius: '4px',
                padding: '5px 12px',
                transition: 'all 0.15s',
              }}>
                <input
                  type="radio"
                  name="rate"
                  value={String(r)}
                  checked={rate === r}
                  onChange={() => setRate(r)}
                  style={{ accentColor: 'var(--navy)', cursor: 'pointer' }}
                />
                {r === 0.10 ? '10%（標準）' : '8%（軽減）'}
              </label>
            ))}
          </div>
        </div>

        {/* 端数処理 */}
        <div>
          <div style={{
            fontFamily: 'var(--font-noto-sans), sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--ink-mid)',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem',
          }}>
            端数処理
          </div>
          <div style={radioGroupStyle}>
            {([
              { value: 'floor', label: '切り捨て' },
              { value: 'ceil',  label: '切り上げ' },
              { value: 'round', label: '四捨五入' },
            ] as { value: RoundingMode; label: string }[]).map((opt) => (
              <label key={opt.value} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-noto-sans), sans-serif',
                fontSize: '13px',
                color: rounding === opt.value ? 'var(--navy)' : 'var(--ink-mid)',
                cursor: 'pointer',
                backgroundColor: rounding === opt.value ? 'var(--navy-light)' : 'transparent',
                border: `1px solid ${rounding === opt.value ? 'var(--navy)' : 'var(--border)'}`,
                borderRadius: '4px',
                padding: '5px 12px',
                transition: 'all 0.15s',
              }}>
                <input
                  type="radio"
                  name="rounding"
                  value={opt.value}
                  checked={rounding === opt.value}
                  onChange={() => setRounding(opt.value)}
                  style={{ accentColor: 'var(--navy)', cursor: 'pointer' }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 税抜→税込 */}
      {tab === 'excl-to-incl' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-noto-sans), sans-serif',
              fontSize: '13px',
              color: 'var(--ink-mid)',
              marginBottom: '6px',
            }}>
              税抜き価格（円）
            </label>
            <input
              type="number"
              min="0"
              value={exclInput}
              onChange={(e) => setExclInput(e.target.value)}
              placeholder="例: 1000"
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '16px',
                color: 'var(--ink)',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '10px 14px',
                width: '100%',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {exclResult !== null && exclInput !== '' ? (
            <ResultPanel
              rows={[
                { label: '消費税額', value: exclResult.taxAmount, copyKey: 'tax-excl' },
                { label: '税込み価格', value: exclResult.priceIncluded, copyKey: 'price-incl', primary: true },
              ]}
              copyFn={copy}
              copiedKey={copiedKey}
              rateLabel={rate === 0.10 ? '消費税10%' : '消費税8%（軽減）'}
              roundingLabel={rounding === 'floor' ? '切り捨て' : rounding === 'ceil' ? '切り上げ' : '四捨五入'}
            />
          ) : null}
        </div>
      )}

      {/* 税込→税抜 */}
      {tab === 'incl-to-excl' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-noto-sans), sans-serif',
              fontSize: '13px',
              color: 'var(--ink-mid)',
              marginBottom: '6px',
            }}>
              税込み価格（円）
            </label>
            <input
              type="number"
              min="0"
              value={inclInput}
              onChange={(e) => setInclInput(e.target.value)}
              placeholder="例: 1100"
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '16px',
                color: 'var(--ink)',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '10px 14px',
                width: '100%',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {inclResult !== null && inclInput !== '' ? (
            <ResultPanel
              rows={[
                { label: '消費税額', value: inclResult.taxAmount, copyKey: 'tax-incl' },
                { label: '税抜き価格', value: inclResult.priceExcluded, copyKey: 'price-excl', primary: true },
              ]}
              copyFn={copy}
              copiedKey={copiedKey}
              rateLabel={rate === 0.10 ? '消費税10%' : '消費税8%（軽減）'}
              roundingLabel={rounding === 'floor' ? '切り捨て' : rounding === 'ceil' ? '切り上げ' : '四捨五入'}
            />
          ) : null}
        </div>
      )}
    </div>
  )
}

type ResultRow = {
  label: string
  value: number
  copyKey: string
  primary?: boolean
}

function ResultPanel({
  rows,
  copyFn,
  copiedKey,
  rateLabel,
  roundingLabel,
}: {
  rows: ResultRow[]
  copyFn: (key: string, text: string) => void
  copiedKey: string | null
  rateLabel: string
  roundingLabel: string
}) {
  return (
    <div style={{
      backgroundColor: '#111820',
      borderRadius: '6px',
      padding: '1.25rem 1.5rem',
    }}>
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1rem',
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: '#63a4d8',
          border: '1px solid rgba(99,164,216,0.3)',
          borderRadius: '3px',
          padding: '2px 8px',
          textTransform: 'uppercase',
        }}>
          {rateLabel}
        </span>
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: '#a8b8c8',
          border: '1px solid rgba(168,184,200,0.3)',
          borderRadius: '3px',
          padding: '2px 8px',
        }}>
          {roundingLabel}
        </span>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {rows.map((row) => (
          <div key={row.copyKey} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-noto-sans), sans-serif',
                fontSize: '11px',
                color: '#a8b8c8',
                marginBottom: '2px',
              }}>
                {row.label}
              </div>
              <div style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: row.primary ? '2rem' : '1.25rem',
                fontWeight: row.primary ? 500 : 400,
                color: row.primary ? '#2ec880' : '#a8b8c8',
                lineHeight: 1,
              }}>
                ¥{row.value.toLocaleString('ja-JP')}
              </div>
            </div>
            <button
              onClick={() => copyFn(row.copyKey, String(row.value))}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                color: copiedKey === row.copyKey ? 'var(--teal)' : '#63a4d8',
                background: 'transparent',
                border: `1px solid ${copiedKey === row.copyKey ? 'var(--teal)' : 'rgba(99,164,216,0.4)'}`,
                borderRadius: '3px',
                padding: '4px 10px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
            >
              {copiedKey === row.copyKey ? 'コピー済み ✓' : 'コピー'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
