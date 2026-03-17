'use client'

import { useState, useCallback } from 'react'
import { convertCurl, type OutputFormat } from '../utils'

const SAMPLES = [
  { label: 'GET', cmd: 'curl https://api.example.com/users' },
  { label: 'POST JSON', cmd: `curl -X POST https://api.example.com/users \\\n  -H "Content-Type: application/json" \\\n  -d '{"name": "Alice", "email": "alice@example.com"}'` },
  { label: 'Auth', cmd: `curl https://api.example.com/me \\\n  -H "Authorization: Bearer your-token-here"` },
]

export default function CurlToFetchTool() {
  const [input, setInput] = useState('')
  const [format, setFormat] = useState<OutputFormat>('fetch')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleConvert = useCallback(() => {
    const r = convertCurl(input, format)
    if (r.ok) { setOutput(r.output); setError(null) }
    else { setOutput(''); setError(r.error) }
  }, [input, format])

  const handleClear = useCallback(() => {
    setInput(''); setOutput(''); setError(null); setCopied(false)
  }, [])

  const handleCopy = useCallback(() => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [output])

  return (
    <div>
      {/* Format selector + buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '4px', marginRight: '0.5rem' }}>
          {(['fetch', 'axios', 'python'] as OutputFormat[]).map(f => (
            <button
              key={f}
              onClick={() => { setFormat(f); setOutput(''); setError(null) }}
              style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', letterSpacing: '0.05em', padding: '4px 12px', borderRadius: '3px', border: '1px solid var(--border)', cursor: 'pointer', backgroundColor: format === f ? 'var(--navy)' : 'var(--surface)', color: format === f ? '#fff' : 'var(--ink-mid)', transition: 'background 0.15s' }}
            >
              {f === 'fetch' ? 'Fetch API' : f === 'axios' ? 'Axios' : 'Python requests'}
            </button>
          ))}
        </div>
        <ActionButton label="変換" onClick={handleConvert} primary />
        <ActionButton label="クリア" onClick={handleClear} />
        <ActionButton label={copied ? 'コピー済み' : 'コピー'} onClick={handleCopy} disabled={!output} />
      </div>

      {/* Sample buttons */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: 'var(--ink-faint)', letterSpacing: '0.08em', alignSelf: 'center' }}>サンプル:</span>
        {SAMPLES.map(s => (
          <button key={s.label} onClick={() => setInput(s.cmd)} style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.06em', padding: '3px 9px', borderRadius: '3px', border: '1px solid var(--border-light)', cursor: 'pointer', backgroundColor: 'var(--surface)', color: 'var(--ink-light)', transition: 'background 0.15s' }}>
            {s.label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: '#b83232', backgroundColor: 'rgba(184,50,50,0.06)', border: '1px solid rgba(184,50,50,0.2)', borderRadius: '4px', padding: '0.75rem 1rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>入力 / curl</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={'curl -X POST https://api.example.com/users \\\n  -H "Content-Type: application/json" \\\n  -d \'{"name": "Alice"}\''}
            rows={12}
            style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', color: 'var(--ink)', resize: 'vertical', outline: 'none', lineHeight: 1.65, boxSizing: 'border-box' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>
            出力 / {format === 'fetch' ? 'Fetch API' : format === 'axios' ? 'Axios' : 'Python requests'}
          </label>
          <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#111820', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', color: output ? '#a8b8c8' : '#4a5a6a', lineHeight: 1.65, overflowX: 'auto', overflowY: 'auto', minHeight: '12lh', whiteSpace: 'pre', boxSizing: 'border-box' }}>
            <code>{output || '// 変換ボタンを押すと結果がここに表示されます'}</code>
          </pre>
        </div>
      </div>
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
