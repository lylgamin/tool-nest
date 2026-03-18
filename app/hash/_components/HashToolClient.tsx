'use client'

import { useState, useEffect } from 'react'
import { computeHash, formatHash } from '../utils'
import type { HashAlgorithm } from '../utils'
import { useCopy } from '../../_components/useCopy'

const ALGORITHMS: HashAlgorithm[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

const ALGO_META: Record<HashAlgorithm, { bits: number; chars: number }> = {
  'SHA-1':   { bits: 160, chars: 40 },
  'SHA-256': { bits: 256, chars: 64 },
  'SHA-384': { bits: 384, chars: 96 },
  'SHA-512': { bits: 512, chars: 128 },
}

export default function HashToolClient() {
  const [input, setInput] = useState('')
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256')
  const [output, setOutput] = useState('')
  const { copied, copy } = useCopy()

  useEffect(() => {
    const promise = input ? computeHash(input, algorithm) : Promise.resolve('')
    promise.then(setOutput)
  }, [input, algorithm])

  const handleCopy = () => {
    if (!output) return
    copy(output)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  const meta = ALGO_META[algorithm]

  return (
    <div>
      {/* アルゴリズム選択 */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          アルゴリズム
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {ALGORITHMS.map(algo => {
            const active = algorithm === algo
            return (
              <button
                key={algo}
                onClick={() => setAlgorithm(algo)}
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '12px',
                  letterSpacing: '0.06em',
                  padding: '6px 14px',
                  border: active ? '1px solid var(--teal)' : '1px solid var(--border)',
                  borderRadius: '3px',
                  background: active ? 'var(--teal-mid)' : 'var(--surface-alt)',
                  color: active ? 'var(--teal)' : 'var(--ink-mid)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {algo}
              </button>
            )
          })}
        </div>
        {/* ビット数バッジ */}
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: 'var(--teal)',
            backgroundColor: 'var(--teal-mid)',
            border: '1px solid rgba(31,107,114,0.25)',
            borderRadius: '3px',
            padding: '2px 8px',
          }}>
            {meta.bits} bit
          </span>
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: 'var(--ink-light)',
            border: '1px solid var(--border-light)',
            borderRadius: '3px',
            padding: '2px 8px',
          }}>
            {meta.chars} chars
          </span>
        </div>
      </div>

      {/* 入力エリア */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '6px',
        }}>
          入力テキスト
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="ハッシュ化したいテキストを入力..."
          rows={5}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontFamily: 'var(--font-noto-sans), sans-serif',
            fontSize: '14px',
            color: 'var(--ink)',
            resize: 'vertical',
            outline: 'none',
            lineHeight: 1.7,
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        />
      </div>

      {/* 出力エリア（ターミナルスタイル） */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: 'var(--ink-light)',
            textTransform: 'uppercase',
          }}>
            ハッシュ値（16進数）
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleCopy}
              disabled={!output}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: copied ? 'var(--teal)' : 'var(--ink-light)',
                background: 'none',
                border: '1px solid var(--border-light)',
                borderRadius: '3px',
                padding: '4px 10px',
                cursor: output ? 'pointer' : 'default',
                opacity: output ? 1 : 0.4,
                transition: 'color 0.15s',
              }}
            >
              {copied ? 'コピー済み ✓' : 'コピー'}
            </button>
            <button
              onClick={handleClear}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: 'var(--ink-light)',
                background: 'none',
                border: '1px solid var(--border-light)',
                borderRadius: '3px',
                padding: '4px 10px',
                cursor: 'pointer',
              }}
            >
              クリア
            </button>
          </div>
        </div>

        {/* ターミナル出力ブロック */}
        <div style={{
          backgroundColor: '#111820',
          borderRadius: '6px',
          padding: '1.25rem 1.5rem',
          minHeight: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          {output ? (
            <>
              <div style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                letterSpacing: '0.1em',
                color: '#63a4d8',
              }}>
                {algorithm} →
              </div>
              <div style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '13px',
                color: '#2ec880',
                wordBreak: 'break-all',
                lineHeight: 1.6,
              }}>
                {output}
              </div>
              <div style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10px',
                color: '#a8b8c8',
                marginTop: '4px',
                letterSpacing: '0.06em',
              }}>
                {formatHash(output)}
              </div>
            </>
          ) : (
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '12px',
              color: '#3a4a5a',
              alignSelf: 'center',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}>
              テキストを入力するとハッシュ値が表示されます
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
