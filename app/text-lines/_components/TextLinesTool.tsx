'use client'

import { useState, useCallback } from 'react'
import {
  deduplicateLines,
  sortLines,
  reverseLines,
  addLineNumbers,
  removeEmptyLines,
  trimLines,
} from '../utils'
import { useCopy } from '../../_components/useCopy'

type Operation =
  | 'deduplicate'
  | 'sort-asc'
  | 'sort-desc'
  | 'reverse'
  | 'number'
  | 'remove-empty'
  | 'trim'

export default function TextLinesTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(true)
  const { copied, copy } = useCopy()
  const [lastOp, setLastOp] = useState<Operation | null>(null)

  const applyOperation = useCallback(
    (op: Operation) => {
      let result = ''
      switch (op) {
        case 'deduplicate':
          result = deduplicateLines(input, caseSensitive)
          break
        case 'sort-asc':
          result = sortLines(input, 'asc', caseSensitive)
          break
        case 'sort-desc':
          result = sortLines(input, 'desc', caseSensitive)
          break
        case 'reverse':
          result = reverseLines(input)
          break
        case 'number':
          result = addLineNumbers(input, 1)
          break
        case 'remove-empty':
          result = removeEmptyLines(input)
          break
        case 'trim':
          result = trimLines(input)
          break
      }
      setOutput(result)
      setLastOp(op)
    },
    [input, caseSensitive]
  )

  const handleCopy = useCallback(() => {
    if (!output) return
    copy(output)
  }, [output, copy])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setLastOp(null)
  }, [])

  const inputLineCount = input ? input.split('\n').length : 0
  const outputLineCount = output ? output.split('\n').length : 0

  const opLabels: Record<Operation, string> = {
    'deduplicate': '重複削除',
    'sort-asc': '昇順ソート',
    'sort-desc': '降順ソート',
    'reverse': '逆順',
    'number': '番号付け',
    'remove-empty': '空行削除',
    'trim': 'トリム',
  }

  const caseSensitiveOps: Operation[] = ['deduplicate', 'sort-asc', 'sort-desc']

  return (
    <div>
      {/* オプション */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
        flexWrap: 'wrap',
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          userSelect: 'none',
        }}>
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={e => setCaseSensitive(e.target.checked)}
            style={{ cursor: 'pointer', accentColor: 'var(--teal)' }}
          />
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '11px',
            letterSpacing: '0.06em',
            color: 'var(--ink-mid)',
          }}>
            大文字小文字を区別する
          </span>
        </label>
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          color: 'var(--ink-faint)',
          letterSpacing: '0.06em',
        }}>
          ※ 重複削除・ソートに適用
        </span>
      </div>

      {/* 操作ボタン群 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(Object.keys(opLabels) as Operation[]).map(op => {
          const isActive = lastOp === op
          const isCaseSensitiveOp = caseSensitiveOps.includes(op)
          return (
            <button
              key={op}
              onClick={() => applyOperation(op)}
              title={isCaseSensitiveOp ? '大文字小文字の区別設定が適用されます' : undefined}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '12px',
                letterSpacing: '0.06em',
                padding: '6px 14px',
                borderRadius: '4px',
                border: isActive ? '1px solid var(--teal)' : '1px solid var(--border)',
                cursor: 'pointer',
                backgroundColor: isActive ? 'rgba(31,107,114,0.1)' : 'var(--surface)',
                color: isActive ? 'var(--teal)' : 'var(--ink-mid)',
                transition: 'background 0.15s, border-color 0.15s, color 0.15s',
              }}
            >
              {opLabels[op]}
            </button>
          )
        })}
        <button
          onClick={handleClear}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '12px',
            letterSpacing: '0.06em',
            padding: '6px 14px',
            borderRadius: '4px',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            backgroundColor: 'var(--surface)',
            color: 'var(--ink-light)',
            transition: 'background 0.15s',
            marginLeft: 'auto',
          }}
        >
          クリア
        </button>
      </div>

      {/* 入出力エリア */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
      }}>
        {/* 入力 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: 'var(--ink-light)',
              textTransform: 'uppercase',
            }}>
              入力テキスト / input
            </label>
            {inputLineCount > 0 && (
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10px',
                color: 'var(--ink-faint)',
                letterSpacing: '0.06em',
              }}>
                {inputLineCount} 行
              </span>
            )}
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={'テキストを入力してください\n各行に対して操作が適用されます\n\n例:\napple\nbanana\napple\ncherry'}
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

        {/* 出力 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: 'var(--ink-light)',
              textTransform: 'uppercase',
            }}>
              出力テキスト / output
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {outputLineCount > 0 && (
                <span style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '10px',
                  color: 'var(--ink-faint)',
                  letterSpacing: '0.06em',
                }}>
                  {outputLineCount} 行
                </span>
              )}
              {output && (
                <button
                  onClick={handleCopy}
                  style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '10px',
                    letterSpacing: '0.06em',
                    padding: '3px 10px',
                    borderRadius: '3px',
                    border: '1px solid var(--border-light)',
                    cursor: 'pointer',
                    backgroundColor: copied ? 'rgba(31,107,114,0.1)' : 'var(--surface)',
                    color: copied ? 'var(--teal)' : 'var(--ink-mid)',
                    transition: 'all 0.15s',
                  }}
                >
                  {copied ? 'コピー完了' : 'コピー'}
                </button>
              )}
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={'操作ボタンを押すと結果がここに表示されます'}
            rows={14}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: output ? 'var(--surface-alt)' : '#111820',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '13px',
              color: output ? 'var(--ink)' : '#4a5a6a',
              resize: 'vertical',
              outline: 'none',
              lineHeight: 1.65,
              boxSizing: 'border-box',
              cursor: 'default',
            }}
          />
        </div>
      </div>
    </div>
  )
}
