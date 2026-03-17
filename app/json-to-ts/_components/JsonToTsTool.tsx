'use client'

import { useState, useCallback } from 'react'
import { generateTypes } from '../utils'

type Style = 'interface' | 'type'

export default function JsonToTsTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [rootName, setRootName] = useState('Root')
  const [style, setStyle] = useState<Style>('interface')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = useCallback(() => {
    const name = rootName.trim() || 'Root'
    const r = generateTypes(input, name, style)
    if (r.ok) { setOutput(r.output); setError(null) }
    else { setOutput(''); setError(r.error) }
  }, [input, rootName, style])

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
      {/* Options bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
        {/* Root name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            型名
          </label>
          <input
            type="text"
            value={rootName}
            onChange={e => setRootName(e.target.value)}
            placeholder="Root"
            style={{ padding: '4px 10px', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '3px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', color: 'var(--ink)', outline: 'none', width: '120px' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>
        {/* Style toggle */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['interface', 'type'] as Style[]).map(s => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '11px',
                letterSpacing: '0.05em',
                padding: '4px 10px',
                borderRadius: '3px',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                backgroundColor: style === s ? 'var(--navy)' : 'var(--surface)',
                color: style === s ? '#fff' : 'var(--ink-mid)',
                transition: 'background 0.15s',
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <ActionButton label="生成" onClick={handleGenerate} primary />
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
          <label style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>入力 / JSON</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={'{\n  "id": 1,\n  "name": "Alice",\n  "active": true,\n  "tags": ["admin", "user"]\n}'}
            rows={18}
            style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', color: 'var(--ink)', resize: 'vertical', outline: 'none', lineHeight: 1.65, boxSizing: 'border-box' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>出力 / TypeScript</label>
          <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#111820', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', color: output ? '#a8b8c8' : '#4a5a6a', lineHeight: 1.65, overflowX: 'auto', overflowY: 'auto', minHeight: '18lh', whiteSpace: 'pre', boxSizing: 'border-box' }}>
            <code>{output || '// 生成ボタンを押すとTypeScript型定義がここに表示されます'}</code>
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
