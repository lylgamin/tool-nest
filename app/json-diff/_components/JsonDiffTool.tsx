'use client'

import { useState, useCallback } from 'react'
import { diffJson, type DiffEntry } from '../utils'

export default function JsonDiffTool() {
  const [leftText, setLeftText] = useState('')
  const [rightText, setRightText] = useState('')
  const [diffResult, setDiffResult] = useState<DiffEntry[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDiff = useCallback(() => {
    const result = diffJson(leftText, rightText)
    if (result.ok) {
      setDiffResult(result.output)
      setError(null)
    } else {
      setDiffResult(null)
      setError(result.error)
    }
  }, [leftText, rightText])

  const handleClear = useCallback(() => {
    setLeftText('')
    setRightText('')
    setDiffResult(null)
    setError(null)
  }, [])

  const addedCount = diffResult?.filter(e => e.type === 'added').length ?? 0
  const removedCount = diffResult?.filter(e => e.type === 'removed').length ?? 0
  const changedCount = diffResult?.filter(e => e.type === 'changed').length ?? 0

  return (
    <div>
      {/* JSON入力エリア */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'var(--ink-light)',
            textTransform: 'uppercase',
          }}>
            左のJSON / before
          </label>
          <textarea
            value={leftText}
            onChange={e => setLeftText(e.target.value)}
            placeholder={'比較元のJSONをここに入力してください\n例: {"name":"Alice","age":30}'}
            rows={14}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '13px',
              color: 'var(--ink)',
              resize: 'vertical',
              outline: 'none',
              lineHeight: 1.65,
              boxSizing: 'border-box',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'var(--ink-light)',
            textTransform: 'uppercase',
          }}>
            右のJSON / after
          </label>
          <textarea
            value={rightText}
            onChange={e => setRightText(e.target.value)}
            placeholder={'比較先のJSONをここに入力してください\n例: {"name":"Alice","age":31,"email":"alice@example.com"}'}
            rows={14}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '13px',
              color: 'var(--ink)',
              resize: 'vertical',
              outline: 'none',
              lineHeight: 1.65,
              boxSizing: 'border-box',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>
      </div>

      {/* アクションボタン */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <ActionButton label="差分を計算" onClick={handleDiff} primary />
        <ActionButton label="クリア" onClick={handleClear} />
      </div>

      {/* エラー表示 */}
      {error && (
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '13px',
          color: '#c85050',
          backgroundColor: 'rgba(200,80,80,0.08)',
          border: '1px solid rgba(200,80,80,0.25)',
          borderRadius: '4px',
          padding: '1rem 1.25rem',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      {/* 差分結果 */}
      {diffResult !== null && !error && (
        <div>
          {/* サマリーバッジ */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: 'var(--ink-light)',
              textTransform: 'uppercase',
            }}>
              差分結果
            </span>
            {addedCount > 0 && (
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10px',
                letterSpacing: '0.08em',
                color: '#2ec880',
                border: '1px solid rgba(46,200,128,0.3)',
                borderRadius: '3px',
                padding: '2px 8px',
              }}>
                +{addedCount} 追加
              </span>
            )}
            {removedCount > 0 && (
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10px',
                letterSpacing: '0.08em',
                color: '#c85050',
                border: '1px solid rgba(200,80,80,0.3)',
                borderRadius: '3px',
                padding: '2px 8px',
              }}>
                -{removedCount} 削除
              </span>
            )}
            {changedCount > 0 && (
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10px',
                letterSpacing: '0.08em',
                color: '#c8a050',
                border: '1px solid rgba(200,160,80,0.3)',
                borderRadius: '3px',
                padding: '2px 8px',
              }}>
                ~{changedCount} 変更
              </span>
            )}
          </div>

          {diffResult.length === 0 ? (
            <div style={{
              fontFamily: 'var(--font-noto-sans), sans-serif',
              fontSize: '14px',
              color: 'var(--ink-mid)',
              backgroundColor: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '1.25rem 1.5rem',
              textAlign: 'center',
            }}>
              2つのJSONに差分はありません
            </div>
          ) : (
            <div style={{
              backgroundColor: '#111820',
              borderRadius: '4px',
              overflow: 'hidden',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '13px',
              lineHeight: 1.65,
            }}>
              {/* ヘッダー行 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 16px 1fr',
                backgroundColor: '#0d141c',
                borderBottom: '1px solid #1e2d3d',
                padding: '6px 12px',
              }}>
                <span style={{ color: '#4a5a6a', fontSize: '10px', letterSpacing: '0.08em' }}>LEFT (before)</span>
                <span />
                <span style={{ color: '#4a5a6a', fontSize: '10px', letterSpacing: '0.08em' }}>RIGHT (after)</span>
              </div>
              {diffResult.map((entry, idx) => (
                <DiffRow key={idx} entry={entry} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 初期状態のメッセージ */}
      {diffResult === null && !error && (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-faint)',
          textAlign: 'center',
          padding: '2rem',
          border: '1px dashed var(--border-light)',
          borderRadius: '4px',
        }}>
          左右のテキストエリアにJSONを入力し、「差分を計算」ボタンを押してください
        </div>
      )}
    </div>
  )
}

function formatValue(val: unknown): string {
  if (val === undefined) return ''
  if (val === null) return 'null'
  if (typeof val === 'string') return `"${val}"`
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

function DiffRow({ entry }: { entry: DiffEntry }) {
  const { type, path, left, right } = entry

  const rowBg =
    type === 'added' ? 'rgba(46,200,128,0.07)' :
    type === 'removed' ? 'rgba(200,80,80,0.07)' :
    type === 'changed' ? 'rgba(200,160,80,0.07)' :
    'transparent'

  const borderColor =
    type === 'added' ? '#2ec880' :
    type === 'removed' ? '#c85050' :
    type === 'changed' ? '#c8a050' :
    'transparent'

  const pathColor =
    type === 'added' ? '#2ec880' :
    type === 'removed' ? '#c85050' :
    type === 'changed' ? '#c8a050' :
    '#63a4d8'

  const leftValue = type === 'added' ? '' : formatValue(left)
  const rightValue = type === 'removed' ? '' : formatValue(right)

  const leftColor =
    type === 'removed' ? '#f0b8b8' :
    type === 'changed' ? '#f0d8a8' :
    '#a8b8c8'

  const rightColor =
    type === 'added' ? '#b8f0d8' :
    type === 'changed' ? '#b8f0d8' :
    '#a8b8c8'

  const typeLabel =
    type === 'added' ? '+' :
    type === 'removed' ? '-' :
    type === 'changed' ? '~' :
    ' '

  const typeLabelColor =
    type === 'added' ? '#2ec880' :
    type === 'removed' ? '#c85050' :
    type === 'changed' ? '#c8a050' :
    '#4a5a6a'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      backgroundColor: rowBg,
      borderLeft: `3px solid ${borderColor}`,
      minHeight: '1.65em',
      padding: '2px 0',
    }}>
      {/* タイプラベル */}
      <span style={{
        display: 'inline-block',
        width: '1.5rem',
        textAlign: 'center',
        color: typeLabelColor,
        flexShrink: 0,
        lineHeight: 1.65,
        userSelect: 'none',
      }}>
        {typeLabel}
      </span>

      {/* パス */}
      <span style={{
        display: 'inline-block',
        color: pathColor,
        minWidth: '8rem',
        maxWidth: '14rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        padding: '0 0.75rem 0 0',
        lineHeight: 1.65,
        fontSize: '12px',
      }}
        title={path || '(root)'}
      >
        {path || '(root)'}
      </span>

      {/* 左値 */}
      <span style={{
        flex: 1,
        color: leftColor,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        padding: '0 0.5rem',
        lineHeight: 1.65,
        borderRight: '1px solid #1e2d3d',
        minWidth: 0,
        opacity: type === 'added' ? 0.25 : 1,
      }}>
        {leftValue}
      </span>

      {/* 右値 */}
      <span style={{
        flex: 1,
        color: rightColor,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        padding: '0 0.75rem 0 0.5rem',
        lineHeight: 1.65,
        minWidth: 0,
        opacity: type === 'removed' ? 0.25 : 1,
      }}>
        {rightValue}
      </span>
    </div>
  )
}

function ActionButton({
  label,
  onClick,
  primary,
  disabled,
}: {
  label: string
  onClick: () => void
  primary?: boolean
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '12px',
        letterSpacing: '0.06em',
        padding: '6px 16px',
        borderRadius: '4px',
        border: primary ? 'none' : '1px solid var(--border)',
        cursor: disabled ? 'default' : 'pointer',
        backgroundColor: primary ? 'var(--navy)' : 'var(--surface)',
        color: primary ? '#fff' : disabled ? 'var(--ink-faint)' : 'var(--ink-mid)',
        opacity: disabled ? 0.6 : 1,
        transition: 'background 0.15s',
      }}
    >
      {label}
    </button>
  )
}
