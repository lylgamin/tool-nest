'use client'

import { useState, useCallback } from 'react'
import { csvToJson, jsonToCsv, parseCsv } from '../utils'
import { useCopy } from '../../_components/useCopy'

type Direction = 'csv-to-json' | 'json-to-csv'

export default function CsvJsonTool() {
  const [direction, setDirection] = useState<Direction>('csv-to-json')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { copied, copy } = useCopy()
  const [preview, setPreview] = useState<string[][] | null>(null)

  const handleConvert = useCallback(() => {
    if (direction === 'csv-to-json') {
      const r = csvToJson(input)
      if (r.ok) {
        setOutput(r.output)
        setError(null)
        // build preview
        const p = parseCsv(input)
        if (p.ok) setPreview(p.output.slice(0, 11)) // header + up to 10 rows
        else setPreview(null)
      } else {
        setOutput('')
        setError(r.error)
        setPreview(null)
      }
    } else {
      const r = jsonToCsv(input)
      if (r.ok) {
        setOutput(r.output)
        setError(null)
        setPreview(null)
      } else {
        setOutput('')
        setError(r.error)
        setPreview(null)
      }
    }
  }, [direction, input])

  const handleClear = useCallback(() => {
    setInput(''); setOutput(''); setError(null); setPreview(null)
  }, [])

  const handleCopy = useCallback(() => {
    if (!output) return
    copy(output)
  }, [output, copy])

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '4px', marginRight: '0.5rem' }}>
          {([
            { value: 'csv-to-json', label: 'CSV → JSON' },
            { value: 'json-to-csv', label: 'JSON → CSV' },
          ] as { value: Direction; label: string }[]).map(opt => (
            <button
              key={opt.value}
              onClick={() => { setDirection(opt.value); setOutput(''); setError(null); setPreview(null) }}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                letterSpacing: '0.05em',
                padding: '4px 12px',
                borderRadius: '3px',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                backgroundColor: direction === opt.value ? 'var(--navy)' : 'var(--surface)',
                color: direction === opt.value ? '#fff' : 'var(--ink-mid)',
                transition: 'background 0.15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <ActionButton label="変換" onClick={handleConvert} primary />
        <ActionButton label="クリア" onClick={handleClear} />
        <ActionButton label={copied ? 'コピー済み' : 'コピー'} onClick={handleCopy} disabled={!output} />
      </div>

      {error && (
        <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: '#b83232', backgroundColor: 'rgba(184,50,50,0.06)', border: '1px solid rgba(184,50,50,0.2)', borderRadius: '4px', padding: '0.75rem 1rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>
            {direction === 'csv-to-json' ? '入力 / CSV' : '入力 / JSON'}
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={direction === 'csv-to-json' ? 'id,name,age\n1,Alice,30\n2,Bob,25' : '[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]'}
            rows={18}
            style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', color: 'var(--ink)', resize: 'vertical', outline: 'none', lineHeight: 1.65, boxSizing: 'border-box' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>
            {direction === 'csv-to-json' ? '出力 / JSON' : '出力 / CSV'}
          </label>
          <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#111820', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', color: output ? '#a8b8c8' : '#4a5a6a', lineHeight: 1.65, overflowX: 'auto', overflowY: 'auto', minHeight: '18lh', whiteSpace: 'pre', boxSizing: 'border-box' }}>
            <code>{output || '// 変換ボタンを押すと結果がここに表示されます'}</code>
          </pre>
        </div>
      </div>

      {/* Table preview for CSV→JSON */}
      {preview && preview.length > 1 && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            テーブルプレビュー（最大10行）
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px' }}>
              <thead>
                <tr>
                  {preview[0].map((h, i) => (
                    <th key={i} style={{ textAlign: 'left', padding: '6px 12px', backgroundColor: 'var(--navy)', color: '#e0e8f0', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', letterSpacing: '0.05em', fontWeight: 400, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(1).map((row, ri) => (
                  <tr key={ri} style={{ backgroundColor: ri % 2 === 0 ? 'var(--surface)' : 'var(--surface-alt)' }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: '6px 12px', color: 'var(--ink-mid)', border: '1px solid var(--border-light)', whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionButton({ label, onClick, primary, disabled }: { label: string; onClick: () => void; primary?: boolean; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', letterSpacing: '0.06em', padding: '6px 16px', borderRadius: '4px', border: primary ? 'none' : '1px solid var(--border)', cursor: disabled ? 'default' : 'pointer', backgroundColor: primary ? 'var(--navy)' : 'var(--surface)', color: primary ? '#fff' : disabled ? 'var(--ink-faint)' : 'var(--ink-mid)', opacity: disabled ? 0.6 : 1, transition: 'background 0.15s' }}>
      {label}
    </button>
  )
}
