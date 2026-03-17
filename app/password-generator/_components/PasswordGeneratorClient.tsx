'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  generatePassword,
  calcEntropy,
  getStrengthLevel,
  getStrengthLabel,
  type PasswordOptions,
  type StrengthLevel,
} from '../utils'

const STRENGTH_COLORS: Record<StrengthLevel, string> = {
  'very-weak':   '#e53e3e',
  'weak':        '#dd6b20',
  'fair':        '#d69e2e',
  'strong':      '#38a169',
  'very-strong': '#1f6b72',
}

const STRENGTH_FILL: Record<StrengthLevel, number> = {
  'very-weak':   1,
  'weak':        2,
  'fair':        3,
  'strong':      4,
  'very-strong': 5,
}

export default function PasswordGeneratorClient() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  })
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [bulkPasswords, setBulkPasswords] = useState<string[]>([])
  const [bulkCopied, setBulkCopied] = useState<number | null>(null)

  const generate = useCallback(() => {
    setPassword(generatePassword(options))
  }, [options])

  // 初回自動生成
  useEffect(() => {
    generate()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // オプション変更時に再生成
  useEffect(() => {
    generate()
  }, [options, generate])

  const entropy = calcEntropy(options)
  const level = getStrengthLevel(entropy)
  const label = getStrengthLabel(level)
  const color = STRENGTH_COLORS[level]
  const fill = STRENGTH_FILL[level]

  function handleCopy() {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function handleBulkGenerate() {
    const list = Array.from({ length: 5 }, () => generatePassword(options))
    setBulkPasswords(list)
  }

  function handleBulkCopy(idx: number, pw: string) {
    navigator.clipboard.writeText(pw).then(() => {
      setBulkCopied(idx)
      setTimeout(() => setBulkCopied(null), 1500)
    })
  }

  const atLeastOneChecked =
    options.uppercase || options.lowercase || options.numbers || options.symbols

  const displayPassword = visible ? password : password.replace(/./g, '●')

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>

      {/* 設定エリア */}
      <div style={{ display: 'grid', gap: '1rem' }}>

        {/* 長さスライダー */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem',
          }}>
            <label style={{
              fontFamily: 'var(--font-noto-sans), sans-serif',
              fontSize: '13px',
              color: 'var(--ink-mid)',
            }}>
              パスワードの長さ
            </label>
            <span style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--ink)',
              minWidth: '2ch',
              textAlign: 'right',
            }}>
              {options.length}
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={options.length}
            onChange={e => setOptions(o => ({ ...o, length: Number(e.target.value) }))}
            style={{ width: '100%', accentColor: 'var(--teal)', cursor: 'pointer' }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            color: 'var(--ink-faint)',
            marginTop: '2px',
          }}>
            <span>8</span>
            <span>64</span>
          </div>
        </div>

        {/* チェックボックス */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {[
            { key: 'uppercase', label: '大文字 (A-Z)' },
            { key: 'lowercase', label: '小文字 (a-z)' },
            { key: 'numbers',   label: '数字 (0-9)' },
            { key: 'symbols',   label: '記号 (!@#...)' },
          ].map(({ key, label: cbLabel }) => (
            <label
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-noto-sans), sans-serif',
                fontSize: '13px',
                color: 'var(--ink-mid)',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={options[key as keyof PasswordOptions] as boolean}
                onChange={e => setOptions(o => ({ ...o, [key]: e.target.checked }))}
                style={{ accentColor: 'var(--teal)', width: '15px', height: '15px', cursor: 'pointer' }}
              />
              <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px' }}>
                {cbLabel}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 生成結果エリア */}
      <div style={{
        backgroundColor: 'var(--surface-alt)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '1.25rem',
      }}>
        {/* パスワード表示 */}
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 'clamp(14px, 2.5vw, 20px)',
          color: atLeastOneChecked ? 'var(--ink)' : 'var(--ink-faint)',
          letterSpacing: '0.05em',
          wordBreak: 'break-all',
          lineHeight: 1.5,
          minHeight: '2em',
          marginBottom: '1rem',
        }}>
          {atLeastOneChecked ? displayPassword : '— 文字種を1つ以上選択してください —'}
        </div>

        {/* ボタン群 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            onClick={() => setVisible(v => !v)}
            disabled={!atLeastOneChecked}
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '12px',
              padding: '6px 14px',
              borderRadius: '4px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--ink-mid)',
              cursor: atLeastOneChecked ? 'pointer' : 'default',
              opacity: atLeastOneChecked ? 1 : 0.4,
            }}
          >
            {visible ? '非表示' : '表示'}
          </button>

          <button
            onClick={handleCopy}
            disabled={!atLeastOneChecked}
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '12px',
              padding: '6px 14px',
              borderRadius: '4px',
              border: '1px solid var(--border)',
              backgroundColor: copied ? 'var(--teal-mid)' : 'var(--surface)',
              color: copied ? 'var(--teal)' : 'var(--ink-mid)',
              cursor: atLeastOneChecked ? 'pointer' : 'default',
              opacity: atLeastOneChecked ? 1 : 0.4,
              transition: 'background-color 0.15s, color 0.15s',
            }}
          >
            {copied ? '✓ コピー済み' : 'コピー'}
          </button>

          <button
            onClick={generate}
            disabled={!atLeastOneChecked}
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '12px',
              padding: '6px 14px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: atLeastOneChecked ? 'var(--navy)' : 'var(--border)',
              color: atLeastOneChecked ? '#fff' : 'var(--ink-faint)',
              cursor: atLeastOneChecked ? 'pointer' : 'default',
            }}
          >
            再生成
          </button>
        </div>
      </div>

      {/* 強度インジケーター */}
      <div>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <div
              key={n}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                backgroundColor: n <= fill ? color : 'var(--border-light)',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontFamily: 'var(--font-noto-sans), sans-serif',
            fontSize: '13px',
            color: atLeastOneChecked ? color : 'var(--ink-faint)',
            fontWeight: 500,
          }}>
            {atLeastOneChecked ? label : '—'}
          </span>
          {atLeastOneChecked && (
            <span style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11px',
              color: 'var(--ink-light)',
            }}>
              {Math.round(entropy)} bit
            </span>
          )}
        </div>
      </div>

      {/* 複数生成 */}
      <div>
        <button
          onClick={handleBulkGenerate}
          disabled={!atLeastOneChecked}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '12px',
            padding: '7px 16px',
            borderRadius: '4px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: atLeastOneChecked ? 'var(--navy)' : 'var(--ink-faint)',
            cursor: atLeastOneChecked ? 'pointer' : 'default',
            opacity: atLeastOneChecked ? 1 : 0.4,
          }}
        >
          5件生成
        </button>

        {bulkPasswords.length > 0 && (
          <div style={{
            marginTop: '0.75rem',
            display: 'grid',
            gap: '6px',
          }}>
            {bulkPasswords.map((pw, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--surface-alt)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '4px',
                  padding: '8px 12px',
                }}
              >
                <span style={{
                  flex: 1,
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '13px',
                  color: 'var(--ink)',
                  wordBreak: 'break-all',
                }}>
                  {pw}
                </span>
                <button
                  onClick={() => handleBulkCopy(idx, pw)}
                  style={{
                    flexShrink: 0,
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '3px',
                    border: '1px solid var(--border-light)',
                    backgroundColor: bulkCopied === idx ? 'var(--teal-mid)' : 'var(--surface)',
                    color: bulkCopied === idx ? 'var(--teal)' : 'var(--ink-mid)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s, color 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {bulkCopied === idx ? '✓' : 'コピー'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
