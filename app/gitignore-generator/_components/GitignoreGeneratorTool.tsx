'use client'

import { useState, useCallback, useMemo } from 'react'
import { TEMPLATES, generateGitignore } from '../utils'
import { useCopy } from '../../_components/useCopy'

export default function GitignoreGeneratorTool() {
  const [selected, setSelected] = useState<string[]>(['node'])
  const [includeCommon, setIncludeCommon] = useState(true)
  const { copied, copy } = useCopy()

  const output = useMemo(() => generateGitignore(selected, includeCommon), [selected, includeCommon])

  const toggle = useCallback((id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }, [])

  const handleCopy = useCallback(() => {
    if (!output) return
    copy(output)
  }, [output, copy])

  const handleDownload = useCallback(() => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '.gitignore'
    a.click()
    URL.revokeObjectURL(url)
  }, [output])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {/* Selection panel */}
      <div>
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          テンプレートを選択
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {TEMPLATES.map(t => {
            const isSelected = selected.includes(t.id)
            return (
              <label
                key={t.id}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: isSelected ? 'var(--teal-mid)' : 'var(--surface)', border: `1px solid ${isSelected ? 'var(--teal)' : 'var(--border-light)'}`, borderRadius: '4px', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(t.id)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--teal)', cursor: 'pointer', flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', fontWeight: isSelected ? 600 : 400, color: isSelected ? 'var(--teal)' : 'var(--ink)' }}>
                    {t.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '11px', color: 'var(--ink-light)', marginTop: '1px' }}>
                    {t.description}
                  </div>
                </div>
              </label>
            )
          })}
          {/* Common entries toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: includeCommon ? 'rgba(27,45,79,0.07)' : 'var(--surface)', border: `1px solid ${includeCommon ? 'var(--navy)' : 'var(--border-light)'}`, borderRadius: '4px', cursor: 'pointer', transition: 'all 0.15s', marginTop: '4px' }}>
            <input
              type="checkbox"
              checked={includeCommon}
              onChange={e => setIncludeCommon(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--navy)', cursor: 'pointer', flexShrink: 0 }}
            />
            <div>
              <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', fontWeight: includeCommon ? 600 : 400, color: includeCommon ? 'var(--navy)' : 'var(--ink)' }}>
                共通エントリを含める
              </div>
              <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '11px', color: 'var(--ink-light)', marginTop: '1px' }}>
                OS（.DS_Store / Thumbs.db）・エディター（.vscode / .idea）・.env
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Output */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>
            .gitignore
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handleDownload}
              disabled={!output}
              style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', letterSpacing: '0.05em', padding: '4px 12px', borderRadius: '3px', border: 'none', cursor: output ? 'pointer' : 'default', backgroundColor: 'var(--navy)', color: '#fff', opacity: output ? 1 : 0.5, transition: 'background 0.15s' }}
            >
              ダウンロード
            </button>
            <button
              onClick={handleCopy}
              disabled={!output}
              style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', letterSpacing: '0.05em', padding: '4px 12px', borderRadius: '3px', border: '1px solid var(--border)', cursor: output ? 'pointer' : 'default', backgroundColor: 'var(--surface)', color: output ? 'var(--ink-mid)' : 'var(--ink-faint)', opacity: output ? 1 : 0.5 }}
            >
              {copied ? 'コピー済み ✓' : 'コピー'}
            </button>
          </div>
        </div>
        <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#111820', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', color: output ? '#a8b8c8' : '#4a5a6a', lineHeight: 1.65, overflowX: 'auto', overflowY: 'auto', maxHeight: '500px', whiteSpace: 'pre', boxSizing: 'border-box', minHeight: '200px' }}>
          <code>{output || '// 左でテンプレートを選択すると .gitignore が生成されます'}</code>
        </pre>
        {output && (
          <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: 'var(--ink-faint)', letterSpacing: '0.05em' }}>
            {output.split('\n').length} 行 · {selected.length} テンプレート{includeCommon ? ' + 共通' : ''}
          </div>
        )}
      </div>
    </div>
  )
}
