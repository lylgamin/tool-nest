'use client'

import { useState, useCallback } from 'react'
import { diffLines, type DiffLine } from '../utils'

export default function TextDiffTool() {
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')
  const [diffResult, setDiffResult] = useState<DiffLine[] | null>(null)

  const handleDiff = useCallback(() => {
    const result = diffLines(oldText, newText)
    setDiffResult(result)
  }, [oldText, newText])

  const handleClear = useCallback(() => {
    setOldText('')
    setNewText('')
    setDiffResult(null)
  }, [])

  const addedCount = diffResult?.filter(l => l.kind === 'added').length ?? 0
  const removedCount = diffResult?.filter(l => l.kind === 'removed').length ?? 0

  return (
    <div>
      {/* テキスト入力エリア */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'var(--ink-light)',
            textTransform: 'uppercase',
          }}>
            旧テキスト / before
          </label>
          <textarea
            value={oldText}
            onChange={e => setOldText(e.target.value)}
            placeholder={'比較元のテキストをここに入力してください\n例: 変更前のコードやドキュメント'}
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
            新テキスト / after
          </label>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder={'比較先のテキストをここに入力してください\n例: 変更後のコードやドキュメント'}
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

      {/* 差分結果 */}
      {diffResult !== null && (
        <div>
          {/* サマリーバッジ */}
          {diffResult.length > 0 && (
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
            </div>
          )}

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
              2つのテキストに差分はありません
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
              {diffResult.map((line, idx) => (
                <DiffRow key={idx} line={line} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 初期状態のメッセージ */}
      {diffResult === null && (
        <div style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-faint)',
          textAlign: 'center',
          padding: '2rem',
          border: '1px dashed var(--border-light)',
          borderRadius: '4px',
        }}>
          2つのテキストエリアに比較したいテキストを入力し、「差分を計算」ボタンを押してください
        </div>
      )}
    </div>
  )
}

function DiffRow({ line }: { line: DiffLine }) {
  const isAdded = line.kind === 'added'
  const isRemoved = line.kind === 'removed'

  const rowBg = isAdded
    ? 'rgba(46,200,128,0.12)'
    : isRemoved
    ? 'rgba(200,80,80,0.12)'
    : 'transparent'

  const borderColor = isAdded
    ? '#2ec880'
    : isRemoved
    ? '#c85050'
    : 'transparent'

  const prefixChar = isAdded ? '+' : isRemoved ? '-' : ' '
  const prefixColor = isAdded ? '#2ec880' : isRemoved ? '#c85050' : '#4a5a6a'
  const textColor = isAdded ? '#b8f0d8' : isRemoved ? '#f0b8b8' : '#a8b8c8'

  const oldLineNum = line.lineOld !== null ? String(line.lineOld).padStart(4, ' ') : '    '
  const newLineNum = line.lineNew !== null ? String(line.lineNew).padStart(4, ' ') : '    '

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      backgroundColor: rowBg,
      borderLeft: `3px solid ${borderColor}`,
      minHeight: '1.65em',
    }}>
      {/* 行番号（旧） */}
      <span style={{
        display: 'inline-block',
        minWidth: '3rem',
        padding: '0 0.5rem',
        color: '#4a5a6a',
        userSelect: 'none',
        textAlign: 'right',
        flexShrink: 0,
        fontSize: '11px',
        whiteSpace: 'pre',
        lineHeight: 1.65,
      }}>
        {oldLineNum}
      </span>
      {/* 行番号（新） */}
      <span style={{
        display: 'inline-block',
        minWidth: '3rem',
        padding: '0 0.5rem',
        color: '#4a5a6a',
        userSelect: 'none',
        textAlign: 'right',
        flexShrink: 0,
        fontSize: '11px',
        borderRight: '1px solid #1e2d3d',
        whiteSpace: 'pre',
        lineHeight: 1.65,
      }}>
        {newLineNum}
      </span>
      {/* +/- プレフィックス */}
      <span style={{
        display: 'inline-block',
        padding: '0 0.5rem',
        color: prefixColor,
        userSelect: 'none',
        flexShrink: 0,
        lineHeight: 1.65,
      }}>
        {prefixChar}
      </span>
      {/* 行の内容 */}
      <span style={{
        color: textColor,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        padding: '0 0.75rem 0 0',
        lineHeight: 1.65,
        flex: 1,
      }}>
        {line.content}
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
