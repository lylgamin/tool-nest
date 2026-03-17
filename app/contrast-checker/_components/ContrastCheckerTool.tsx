'use client'

import { useState, useCallback, useEffect } from 'react'
import { parseColor, checkContrast, rgbToHex, type ContrastResult } from '../utils'

export default function ContrastCheckerTool() {
  const [fgInput, setFgInput] = useState('#19161a')
  const [bgInput, setBgInput] = useState('#f3efe8')
  const [result, setResult] = useState<ContrastResult | null>(null)
  const [fgError, setFgError] = useState<string | null>(null)
  const [bgError, setBgError] = useState<string | null>(null)
  const [fgHex, setFgHex] = useState('#19161a')
  const [bgHex, setBgHex] = useState('#f3efe8')

  const calculate = useCallback((fg: string, bg: string) => {
    const fgParsed = parseColor(fg)
    const bgParsed = parseColor(bg)
    if (!fgParsed.ok) { setFgError(fgParsed.error); setResult(null); return }
    if (!bgParsed.ok) { setBgError(bgParsed.error); setResult(null); return }
    setFgError(null)
    setBgError(null)
    const r = checkContrast(fgParsed, bgParsed)
    setResult(r)
    setFgHex(rgbToHex(fgParsed.r, fgParsed.g, fgParsed.b))
    setBgHex(rgbToHex(bgParsed.r, bgParsed.g, bgParsed.b))
  }, [])

  useEffect(() => { calculate(fgInput, bgInput) }, [fgInput, bgInput, calculate])

  const handleFgPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFgInput(e.target.value)
  }
  const handleBgPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBgInput(e.target.value)
  }

  function levelColor(level: string): string {
    if (level === 'AAA') return '#1a7a4a'
    if (level === 'AA') return '#1a7a4a'
    if (level === 'AA Large') return '#b07000'
    return '#b83232'
  }
  function levelBg(level: string): string {
    if (level === 'AAA' || level === 'AA') return 'rgba(26,122,74,0.08)'
    if (level === 'AA Large') return 'rgba(176,112,0,0.08)'
    return 'rgba(184,50,50,0.08)'
  }

  return (
    <div>
      {/* Color inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <ColorInput
          label="テキスト色 / Foreground"
          value={fgInput}
          onChange={setFgInput}
          onPickerChange={handleFgPicker}
          hexValue={fgHex}
          error={fgError}
        />
        <ColorInput
          label="背景色 / Background"
          value={bgInput}
          onChange={setBgInput}
          onPickerChange={handleBgPicker}
          hexValue={bgHex}
          error={bgError}
        />
      </div>

      {result && (
        <>
          {/* Ratio display */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '6px' }}>
            <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--ink-light)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              contrast ratio
            </div>
            <div style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 500, color: 'var(--navy)', lineHeight: 1 }}>
              {result.ratio.toFixed(2)}:1
            </div>
          </div>

          {/* WCAG badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { label: '通常テキスト', sub: 'AA: 4.5:1 / AAA: 7:1', level: result.normalText },
              { label: '大きなテキスト', sub: 'AA: 3:1 / AAA: 4.5:1', level: result.largeText },
              { label: 'UIコンポーネント', sub: 'AA: 3:1', level: result.uiComponent },
            ].map(item => (
              <div key={item.label} style={{ backgroundColor: levelBg(item.level), border: `1px solid ${levelColor(item.level)}40`, borderRadius: '4px', padding: '0.75rem 1rem' }}>
                <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '12px', fontWeight: 500, color: 'var(--ink)', marginBottom: '2px' }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: 'var(--ink-faint)', marginBottom: '6px', letterSpacing: '0.05em' }}>{item.sub}</div>
                <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', fontWeight: 500, color: levelColor(item.level), letterSpacing: '0.06em' }}>
                  {item.level === 'Fail' ? '✗ Fail' : `✓ ${item.level}`}
                </div>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase', padding: '0.5rem 1rem', backgroundColor: 'var(--surface)' }}>
              preview
            </div>
            <div style={{ backgroundColor: bgHex, padding: '1.5rem' }}>
              <div style={{ color: fgHex, fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '18px', fontWeight: 400, marginBottom: '0.5rem' }}>
                通常テキスト（18px）のサンプルです。
              </div>
              <div style={{ color: fgHex, fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', fontWeight: 400, marginBottom: '0.5rem' }}>
                本文テキスト（14px）のサンプルです。読みやすさを確認できます。
              </div>
              <div style={{ color: fgHex, fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px' }}>
                const example = &quot;コードサンプル&quot;;
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ColorInput({
  label, value, onChange, onPickerChange, hexValue, error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onPickerChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  hexValue: string
  error: string | null
}) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase', marginBottom: '6px' }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="color"
          value={hexValue}
          onChange={onPickerChange}
          style={{ width: '40px', height: '40px', padding: '2px', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'var(--surface-alt)' }}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="#ffffff"
          style={{ flex: 1, padding: '8px 12px', backgroundColor: 'var(--surface-alt)', border: `1px solid ${error ? '#b83232' : 'var(--border)'}`, borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', color: 'var(--ink)', outline: 'none' }}
          onFocus={e => { if (!error) e.currentTarget.style.borderColor = 'var(--teal)' }}
          onBlur={e => { if (!error) e.currentTarget.style.borderColor = 'var(--border)' }}
        />
        <div style={{ width: '40px', height: '40px', backgroundColor: hexValue, border: '1px solid var(--border)', borderRadius: '4px', flexShrink: 0 }} />
      </div>
      {error && <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '12px', color: '#b83232', marginTop: '4px' }}>{error}</div>}
    </div>
  )
}
