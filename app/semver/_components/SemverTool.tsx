'use client'

import { useState } from 'react'
import { compareSemVer, bumpVersion, satisfiesRange, parseSemVer } from '../utils'

type Mode = 'compare' | 'bump' | 'range'

export default function SemverTool() {
  const [mode, setMode] = useState<Mode>('compare')

  return (
    <div>
      {/* モード切り替えタブ */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <ModeTab label="バージョン比較" active={mode === 'compare'} onClick={() => setMode('compare')} />
        <ModeTab label="バージョンバンプ" active={mode === 'bump'} onClick={() => setMode('bump')} />
        <ModeTab label="レンジチェック" active={mode === 'range'} onClick={() => setMode('range')} />
      </div>

      {mode === 'compare' && <CompareMode />}
      {mode === 'bump' && <BumpMode />}
      {mode === 'range' && <RangeMode />}
    </div>
  )
}

function ModeTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '11px',
        letterSpacing: '0.06em',
        padding: '6px 14px',
        borderRadius: '4px',
        border: active ? 'none' : '1px solid var(--border)',
        cursor: 'pointer',
        backgroundColor: active ? 'var(--navy)' : 'var(--surface)',
        color: active ? '#fff' : 'var(--ink-mid)',
        transition: 'background 0.15s',
      }}
    >
      {label}
    </button>
  )
}

function VersionInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const parsed = parseSemVer(value)
  const isInvalid = value.trim() !== '' && !parsed

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '10px',
        letterSpacing: '0.1em',
        color: 'var(--ink-light)',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? '例: 1.2.3'}
        style={{
          width: '100%',
          padding: '10px 12px',
          backgroundColor: 'var(--surface-alt)',
          border: `1px solid ${isInvalid ? '#c85050' : 'var(--border)'}`,
          borderRadius: '4px',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '14px',
          color: 'var(--ink)',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        onFocus={e => { if (!isInvalid) e.currentTarget.style.borderColor = 'var(--teal)' }}
        onBlur={e => { e.currentTarget.style.borderColor = isInvalid ? '#c85050' : 'var(--border)' }}
      />
      {isInvalid && (
        <span style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '11px',
          color: '#c85050',
        }}>
          無効なバージョン形式です（例: 1.2.3, v2.0.0-alpha）
        </span>
      )}
    </div>
  )
}

function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: '#111820',
      borderRadius: '4px',
      padding: '1rem 1.25rem',
      fontFamily: 'var(--font-jetbrains), monospace',
      fontSize: '14px',
      color: '#a8b8c8',
      marginTop: '1.25rem',
    }}>
      {children}
    </div>
  )
}

function CompareMode() {
  const [verA, setVerA] = useState('')
  const [verB, setVerB] = useState('')

  const parsedA = parseSemVer(verA)
  const parsedB = parseSemVer(verB)
  const canCompare = !!parsedA && !!parsedB

  let resultLabel = ''
  let resultColor = '#63a4d8'
  let resultSymbol = ''

  if (canCompare) {
    const cmp = compareSemVer(verA, verB)
    if (cmp === 0) {
      resultLabel = '2つのバージョンは等しい'
      resultColor = '#63a4d8'
      resultSymbol = '='
    } else if (cmp > 0) {
      resultLabel = `${verA.trim()} は ${verB.trim()} より新しい`
      resultColor = '#2ec880'
      resultSymbol = '>'
    } else {
      resultLabel = `${verA.trim()} は ${verB.trim()} より古い`
      resultColor = '#f0a050'
      resultSymbol = '<'
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
        <VersionInput label="バージョン A" value={verA} onChange={setVerA} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '2px' }}>
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '18px',
            color: 'var(--ink-faint)',
          }}>vs</span>
        </div>
        <VersionInput label="バージョン B" value={verB} onChange={setVerB} />
      </div>

      {canCompare && (
        <ResultBox>
          <span style={{ color: resultColor, fontSize: '20px', marginRight: '0.75rem' }}>{resultSymbol}</span>
          <span>{resultLabel}</span>
        </ResultBox>
      )}

      {!canCompare && (verA.trim() !== '' || verB.trim() !== '') && parsedA === null && parsedB === null && (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--ink-faint)',
          textAlign: 'center',
          padding: '1rem',
          border: '1px dashed var(--border-light)',
          borderRadius: '4px',
        }}>
          両方に有効なバージョンを入力してください
        </div>
      )}

      {!canCompare && verA.trim() === '' && verB.trim() === '' && (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--ink-faint)',
          textAlign: 'center',
          padding: '1.5rem',
          border: '1px dashed var(--border-light)',
          borderRadius: '4px',
        }}>
          バージョン A と B を入力すると比較結果が表示されます
        </div>
      )}
    </div>
  )
}

function BumpMode() {
  const [version, setVersion] = useState('')
  const [bumpType, setBumpType] = useState<'major' | 'minor' | 'patch'>('patch')

  const parsed = parseSemVer(version)
  const result = parsed ? bumpVersion(version, bumpType) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <VersionInput label="現在のバージョン" value={version} onChange={setVersion} placeholder="例: 1.2.3" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
        }}>
          バンプタイプ
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['major', 'minor', 'patch'] as const).map(t => (
            <BumpTypeButton
              key={t}
              type={t}
              active={bumpType === t}
              description={t === 'major' ? '後方互換性なし' : t === 'minor' ? '後方互換機能追加' : 'バグ修正'}
              onClick={() => setBumpType(t)}
            />
          ))}
        </div>
      </div>

      {result !== null ? (
        <ResultBox>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#a8b8c8' }}>{version.trim()}</span>
            <span style={{ color: 'var(--ink-faint)' }}>→</span>
            <span style={{ color: '#2ec880', fontSize: '18px', fontWeight: 600 }}>{result}</span>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '11px', color: '#63a4d8' }}>
            {bumpType === 'major' && '× major をインクリメント / minor・patch をゼロにリセット'}
            {bumpType === 'minor' && '× minor をインクリメント / patch をゼロにリセット'}
            {bumpType === 'patch' && '× patch をインクリメント'}
          </div>
        </ResultBox>
      ) : (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--ink-faint)',
          textAlign: 'center',
          padding: '1.5rem',
          border: '1px dashed var(--border-light)',
          borderRadius: '4px',
        }}>
          バージョンを入力するとバンプ結果が表示されます
        </div>
      )}
    </div>
  )
}

function BumpTypeButton({
  type,
  active,
  description,
  onClick,
}: {
  type: string
  active: boolean
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '8px 16px',
        borderRadius: '4px',
        border: active ? '1px solid var(--teal)' : '1px solid var(--border)',
        cursor: 'pointer',
        backgroundColor: active ? 'rgba(31,107,114,0.08)' : 'var(--surface)',
        transition: 'all 0.15s',
        minWidth: '100px',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '13px',
        color: active ? 'var(--teal)' : 'var(--ink-mid)',
        fontWeight: active ? 600 : 400,
      }}>
        {type}
      </span>
      <span style={{
        fontFamily: 'var(--font-noto-sans), sans-serif',
        fontSize: '10px',
        color: 'var(--ink-faint)',
        marginTop: '2px',
      }}>
        {description}
      </span>
    </button>
  )
}

function RangeMode() {
  const [version, setVersion] = useState('')
  const [range, setRange] = useState('')

  const parsed = parseSemVer(version)
  const rangeIsEmpty = range.trim() === ''
  const canCheck = !!parsed && !rangeIsEmpty

  const result = canCheck ? satisfiesRange(version, range) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <VersionInput label="バージョン" value={version} onChange={setVersion} placeholder="例: 1.5.0" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
        }}>
          レンジ
        </label>
        <input
          type="text"
          value={range}
          onChange={e => setRange(e.target.value)}
          placeholder="例: ^1.0.0, ~2.3.0, >=1.0.0, <2.0.0"
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '14px',
            color: 'var(--ink)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        />
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          flexWrap: 'wrap',
          marginTop: '2px',
        }}>
          {['^1.0.0', '~1.2.0', '>=1.0.0', '>1.5.0', '<=2.0.0', '<2.0.0', '=1.0.0'].map(example => (
            <button
              key={example}
              onClick={() => setRange(example)}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '3px',
                border: '1px solid var(--border-light)',
                cursor: 'pointer',
                backgroundColor: 'var(--surface)',
                color: 'var(--ink-light)',
              }}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {result !== null ? (
        <ResultBox>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '20px',
              color: result ? '#2ec880' : '#c85050',
            }}>
              {result ? '✓' : '✗'}
            </span>
            <span style={{ color: '#63a4d8' }}>{version.trim()}</span>
            <span style={{ color: 'var(--ink-faint)', fontSize: '12px' }}>satisfies</span>
            <span style={{ color: '#a8b8c8' }}>{range.trim()}</span>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: result ? '#2ec880' : '#c85050' }}>
              {result ? 'true' : 'false'}
            </span>
          </div>
        </ResultBox>
      ) : (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--ink-faint)',
          textAlign: 'center',
          padding: '1.5rem',
          border: '1px dashed var(--border-light)',
          borderRadius: '4px',
        }}>
          バージョンとレンジを入力するとチェック結果が表示されます
        </div>
      )}
    </div>
  )
}
