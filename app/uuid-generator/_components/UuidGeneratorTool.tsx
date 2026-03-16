'use client'

import { useState } from 'react'
import { generateUuids } from '../utils'

const DEFAULT_COUNT = 5

export default function UuidGeneratorTool() {
  const [count, setCount] = useState(DEFAULT_COUNT)
  // SSR では空配列、クライアントでは初期生成（lazy initializer）
  const [uuids, setUuids] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : generateUuids(DEFAULT_COUNT)
  )
  const [uppercase, setUppercase] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const generate = () => setUuids(generateUuids(count))

  const displayUuid = (uuid: string) => uppercase ? uuid.toUpperCase() : uuid.toLowerCase()

  const copyOne = (uuid: string, index: number) => {
    navigator.clipboard.writeText(displayUuid(uuid)).then(() => {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    })
  }

  const copyAll = () => {
    const text = uuids.map(displayUuid).join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 1500)
    })
  }

  return (
    <div>
      {/* コントロール行 */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        marginBottom: '1.25rem',
      }}>
        {/* 生成個数 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <label style={{
            fontFamily: 'var(--font-noto-sans), sans-serif',
            fontSize: '13px',
            color: 'var(--ink-mid)',
            whiteSpace: 'nowrap',
          }}>
            生成個数
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(20, Number(e.target.value))))}
            style={{
              width: '64px',
              padding: '6px 8px',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '14px',
              color: 'var(--ink)',
              backgroundColor: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              textAlign: 'center',
              outline: 'none',
            }}
          />
        </div>

        {/* 大文字切り替え */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--ink-mid)',
          userSelect: 'none',
        }}>
          <input
            type="checkbox"
            checked={uppercase}
            onChange={e => setUppercase(e.target.checked)}
            style={{ accentColor: 'var(--teal)', width: '15px', height: '15px', cursor: 'pointer' }}
          />
          大文字
        </label>

        {/* 生成ボタン */}
        <button
          onClick={generate}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '12px',
            letterSpacing: '0.08em',
            color: '#fff',
            backgroundColor: 'var(--navy)',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 20px',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--teal)' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--navy)' }}
        >
          生成
        </button>

        {/* 全コピーボタン */}
        {uuids.length > 0 && (
          <button
            onClick={copyAll}
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11px',
              letterSpacing: '0.06em',
              color: copiedAll ? 'var(--teal)' : 'var(--ink-mid)',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-light)',
              borderRadius: '4px',
              padding: '7px 14px',
              cursor: 'pointer',
            }}
          >
            {copiedAll ? '✓ コピーしました' : '全てコピー'}
          </button>
        )}
      </div>

      {/* UUID一覧 */}
      {uuids.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {uuids.map((uuid, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border-light)',
                borderRadius: '4px',
                padding: '10px 12px',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '13px',
                color: 'var(--ink)',
                flex: 1,
                wordBreak: 'break-all',
                letterSpacing: '0.03em',
              }}>
                {displayUuid(uuid)}
              </span>
              <button
                onClick={() => copyOne(uuid, i)}
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  color: copiedIndex === i ? 'var(--teal)' : 'var(--ink-light)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-light)',
                  borderRadius: '3px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {copiedIndex === i ? '✓' : 'コピー'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
