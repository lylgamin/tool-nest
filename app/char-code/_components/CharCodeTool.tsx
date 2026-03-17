'use client'

import { useState } from 'react'
import { analyzeString, parseCodePoint, codePointToChar, type CharInfo } from '../utils'

export default function CharCodeTool() {
  const [input, setInput] = useState('')
  const [cpInput, setCpInput] = useState('')

  const chars: CharInfo[] = analyzeString(input)

  const parsedCp = parseCodePoint(cpInput)
  const parsedChar = parsedCp !== null ? codePointToChar(parsedCp) : null

  const monoStyle: React.CSSProperties = {
    fontFamily: 'var(--font-jetbrains), monospace',
  }

  return (
    <div>
      {/* 入力エリア */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          ...monoStyle,
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '6px',
        }}>
          文字を入力（最大20文字）
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="解析したい文字を入力... 例: Hello あいう 😀"
          rows={3}
          maxLength={40}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            backgroundColor: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            ...monoStyle,
            fontSize: '16px',
            color: 'var(--ink)',
            resize: 'vertical',
            outline: 'none',
            lineHeight: 1.7,
            boxSizing: 'border-box',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
        />
        <div style={{
          ...monoStyle,
          fontSize: '11px',
          color: 'var(--ink-faint)',
          marginTop: '4px',
          textAlign: 'right',
        }}>
          {[...input].length} / 20 文字
        </div>
      </div>

      {/* 結果テーブル */}
      {chars.length > 0 && (
        <div style={{
          overflowX: 'auto',
          marginBottom: '2rem',
          borderRadius: '4px',
          border: '1px solid var(--border)',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            ...monoStyle,
            fontSize: '13px',
            minWidth: '680px',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#111820' }}>
                {['文字', 'コードポイント', 'U+XXXX', 'UTF-8', 'UTF-16LE', 'HTML実体', 'カテゴリ'].map(h => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      color: '#63a4d8',
                      fontWeight: 500,
                      letterSpacing: '0.06em',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chars.map((info, i) => (
                <tr
                  key={i}
                  style={{
                    backgroundColor: i % 2 === 0 ? '#111820' : '#141e2a',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {/* 文字 */}
                  <td style={{
                    padding: '10px 14px',
                    fontSize: '20px',
                    color: '#2ec880',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                  }}>
                    {info.char}
                  </td>
                  {/* コードポイント 10進 */}
                  <td style={{ padding: '10px 14px', color: '#a8b8c8' }}>
                    {info.codePoint}
                  </td>
                  {/* U+XXXX */}
                  <td style={{ padding: '10px 14px', color: '#f0c070' }}>
                    {info.codePointHex}
                  </td>
                  {/* UTF-8 */}
                  <td style={{ padding: '10px 14px', color: '#a8b8c8', whiteSpace: 'nowrap' }}>
                    {info.utf8Bytes}
                  </td>
                  {/* UTF-16LE */}
                  <td style={{ padding: '10px 14px', color: '#a8b8c8', whiteSpace: 'nowrap' }}>
                    {info.utf16le}
                  </td>
                  {/* HTML実体 */}
                  <td style={{ padding: '10px 14px', color: '#c8a8e8', whiteSpace: 'nowrap' }}>
                    {info.htmlEntity !== info.char ? info.htmlEntity : (
                      <span style={{ color: '#5a6878' }}>—</span>
                    )}
                  </td>
                  {/* カテゴリ */}
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      color: '#63a4d8',
                      border: '1px solid rgba(99,164,216,0.25)',
                      borderRadius: '3px',
                      padding: '2px 7px',
                    }}>
                      {info.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* コードポイントから文字変換 */}
      <div style={{
        borderTop: '1px solid var(--border-light)',
        paddingTop: '1.5rem',
      }}>
        <div style={{
          ...monoStyle,
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          コードポイントから文字に変換
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
            <input
              type="text"
              value={cpInput}
              onChange={e => setCpInput(e.target.value)}
              placeholder="U+3042 / 12354 / 0x3042"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                ...monoStyle,
                fontSize: '14px',
                color: 'var(--ink)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
            />
          </div>
          <div style={{
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 0',
          }}>
            <span style={{ color: 'var(--ink-faint)', fontSize: '18px' }}>→</span>
          </div>
          <div style={{
            flex: '1 1 180px',
            backgroundColor: '#111820',
            borderRadius: '4px',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            minHeight: '48px',
          }}>
            {cpInput.trim() === '' ? (
              <span style={{ ...monoStyle, fontSize: '12px', color: '#5a6878' }}>
                コードポイントを入力してください
              </span>
            ) : parsedChar !== null ? (
              <>
                <span style={{
                  fontSize: '28px',
                  color: '#2ec880',
                  lineHeight: 1,
                  ...monoStyle,
                }}>
                  {parsedChar}
                </span>
                <div>
                  <div style={{ ...monoStyle, fontSize: '11px', color: '#f0c070' }}>
                    {parsedCp !== null ? `U+${parsedCp.toString(16).toUpperCase().padStart(4, '0')}` : ''}
                  </div>
                  <div style={{ ...monoStyle, fontSize: '11px', color: '#a8b8c8' }}>
                    {parsedCp !== null ? `${parsedCp} (10進)` : ''}
                  </div>
                </div>
              </>
            ) : (
              <span style={{ ...monoStyle, fontSize: '12px', color: '#e87070' }}>
                無効なコードポイントです
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
