'use client'

import { useState } from 'react'
import { countStats, type CountStats } from '../utils'

const EMPTY_STATS: CountStats = { chars: 0, charsNoSpace: 0, bytes: 0, lines: 0, words: 0 }

const STAT_LABELS: { key: keyof CountStats; label: string; sub: string }[] = [
  { key: 'chars',        label: '文字数',         sub: 'characters' },
  { key: 'charsNoSpace', label: '空白を除く',      sub: 'no spaces'  },
  { key: 'bytes',        label: 'バイト数',        sub: 'bytes'      },
  { key: 'words',        label: '単語数',          sub: 'words'      },
  { key: 'lines',        label: '行数',            sub: 'lines'      },
]

export default function CharacterCountTool() {
  const [text, setText] = useState('')
  const stats = text.length > 0 ? countStats(text) : EMPTY_STATS

  return (
    <div>
      {/* テキストエリア */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="ここにテキストを入力またはペーストしてください..."
        rows={10}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: 'var(--surface-alt)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '15px',
          color: 'var(--ink)',
          resize: 'vertical',
          outline: 'none',
          lineHeight: 1.7,
          boxSizing: 'border-box',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
        onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
      />

      {/* クリアボタン */}
      {text.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button
            onClick={() => setText('')}
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
      )}

      {/* 統計グリッド */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '1rem',
        marginTop: '1.5rem',
      }}>
        {STAT_LABELS.map(({ key, label, sub }) => (
          <StatCard key={key} label={label} sub={sub} value={stats[key]} />
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, sub, value }: { label: string; sub: string; value: number }) {
  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border-light)',
      borderRadius: '4px',
      padding: '1rem',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '28px',
        fontWeight: 400,
        color: 'var(--navy)',
        lineHeight: 1,
      }}>
        {value.toLocaleString()}
      </div>
      <div style={{
        fontFamily: 'var(--font-noto-sans), sans-serif',
        fontSize: '13px',
        color: 'var(--ink-mid)',
        marginTop: '6px',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '9px',
        color: 'var(--ink-faint)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginTop: '2px',
      }}>
        {sub}
      </div>
    </div>
  )
}
