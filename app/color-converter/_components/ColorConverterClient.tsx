'use client'

import { useState } from 'react'
import {
  parseHex, rgbToHex, hslToRgb, hsvToRgb, fromRgb,
  type RgbColor, type HslColor, type HsvColor, type ColorResult,
} from '../utils'
import { useStringCopy } from '../../_components/useCopy'

const INITIAL: ColorResult = fromRgb({ r: 99, g: 102, b: 241 }) // indigo-500

/* ── 共通スタイル ── */
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: '10px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--ink-light)',
}
const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: '14px',
  color: 'var(--ink)',
  backgroundColor: 'var(--surface-alt)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  padding: '7px 10px',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
}
const copyBtnStyle = (copied: boolean): React.CSSProperties => ({
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: '11px',
  letterSpacing: '0.06em',
  padding: '6px 12px',
  border: '1px solid var(--border-light)',
  borderRadius: '3px',
  background: 'none',
  color: copied ? 'var(--teal)' : 'var(--ink-light)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'color 0.15s',
})

/* ── 数値入力 (clamp 付き) ── */
function NumInput({
  value, min, max, onChange,
}: {
  value: number; min: number; max: number
  onChange: (n: number) => void
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const display = draft ?? String(value)
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={display}
      onChange={e => setDraft(e.target.value)}
      onBlur={() => {
        const n = parseInt(draft ?? '', 10)
        setDraft(null)
        if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n)))
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
      }}
      style={{ ...inputStyle, textAlign: 'center' }}
      onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
    />
  )
}

/* ── コピーボタン ── */
function CopyBtn({ text, id, copied, onCopy }: {
  text: string; id: string; copied: string | null
  onCopy: (id: string, text: string) => void
}) {
  return (
    <button
      onClick={() => onCopy(id, text)}
      style={copyBtnStyle(copied === id)}
    >
      {copied === id ? '✓ コピー済み' : 'コピー'}
    </button>
  )
}

export default function ColorConverterClient() {
  const [color, setColor] = useState<ColorResult>(INITIAL)
  const { copiedKey: copied, copy } = useStringCopy()
  const [hexDraft, setHexDraft] = useState<string | null>(null)

  const apply = (rgb: RgbColor) => setColor(fromRgb(rgb))

  const handleCopy = (id: string, text: string) => {
    copy(id, text)
  }

  const { hex, rgb, hsl, hsv } = color

  /* コピー用文字列 */
  const hexStr  = hex.toUpperCase()
  const rgbStr  = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  const hslStr  = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
  const hsvStr  = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`

  return (
    <div>
      {/* ── カラープレビュー & ピッカー ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}>
        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '8px',
            backgroundColor: hex,
            border: '1px solid var(--border)',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }} />
          <input
            type="color"
            value={hex}
            onChange={e => {
              const rgb = parseHex(e.target.value)
              if (rgb) apply(rgb)
            }}
            style={{ width: 0, height: 0, opacity: 0, position: 'absolute', pointerEvents: 'none' }}
          />
          <div>
            <div style={{ ...labelStyle, marginBottom: '4px' }}>カラーピッカー</div>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '20px',
              color: 'var(--ink)',
              letterSpacing: '0.04em',
            }}>
              {hexStr}
            </div>
            <div style={{ ...labelStyle, marginTop: '2px' }}>クリックして色を選択</div>
          </div>
        </label>
      </div>

      {/* ── HEX ── */}
      <Section label="HEX" copyText={hexStr} copyId="hex" copied={copied} onCopy={handleCopy}>
        <input
          type="text"
          value={hexDraft ?? hexStr}
          onChange={e => setHexDraft(e.target.value)}
          onBlur={() => {
            const rgb = parseHex(hexDraft ?? hexStr)
            if (rgb) apply(rgb)
            setHexDraft(null)
          }}
          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
          placeholder="#RRGGBB"
          style={{ ...inputStyle, width: '180px' }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
        />
      </Section>

      {/* ── RGB ── */}
      <Section label="RGB" copyText={rgbStr} copyId="rgb" copied={copied} onCopy={handleCopy}>
        <TripleInput
          fields={[
            { label: 'R', value: rgb.r, min: 0, max: 255 },
            { label: 'G', value: rgb.g, min: 0, max: 255 },
            { label: 'B', value: rgb.b, min: 0, max: 255 },
          ]}
          onChange={(i, v) => {
            const next: RgbColor = { ...rgb }
            const keys: (keyof RgbColor)[] = ['r', 'g', 'b']
            next[keys[i]] = v
            apply(next)
          }}
        />
      </Section>

      {/* ── HSL ── */}
      <Section label="HSL" copyText={hslStr} copyId="hsl" copied={copied} onCopy={handleCopy}>
        <TripleInput
          fields={[
            { label: 'H', value: hsl.h, min: 0, max: 360 },
            { label: 'S', value: hsl.s, min: 0, max: 100 },
            { label: 'L', value: hsl.l, min: 0, max: 100 },
          ]}
          onChange={(i, v) => {
            const next: HslColor = { ...hsl }
            const keys: (keyof HslColor)[] = ['h', 's', 'l']
            next[keys[i]] = v
            apply(hslToRgb(next))
          }}
        />
      </Section>

      {/* ── HSV ── */}
      <Section label="HSV" copyText={hsvStr} copyId="hsv" copied={copied} onCopy={handleCopy}>
        <TripleInput
          fields={[
            { label: 'H', value: hsv.h, min: 0, max: 360 },
            { label: 'S', value: hsv.s, min: 0, max: 100 },
            { label: 'V', value: hsv.v, min: 0, max: 100 },
          ]}
          onChange={(i, v) => {
            const next: HsvColor = { ...hsv }
            const keys: (keyof HsvColor)[] = ['h', 's', 'v']
            next[keys[i]] = v
            apply(hsvToRgb(next))
          }}
        />
      </Section>
    </div>
  )
}

/* ── セクションラッパー ── */
function Section({
  label, copyText, copyId, copied, onCopy, children,
}: {
  label: string
  copyText: string
  copyId: string
  copied: string | null
  onCopy: (id: string, text: string) => void
  children: React.ReactNode
}) {
  return (
    <div style={{
      backgroundColor: 'var(--surface-alt)',
      border: '1px solid var(--border-light)',
      borderRadius: '6px',
      padding: '1rem 1.25rem',
      marginBottom: '0.75rem',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.6rem',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <span style={labelStyle}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '13px',
            color: 'var(--ink-mid)',
          }}>
            {copyText}
          </span>
          <CopyBtn text={copyText} id={copyId} copied={copied} onCopy={onCopy} />
        </div>
      </div>
      {children}
    </div>
  )
}

/* ── 3フィールド入力行 ── */
function TripleInput({
  fields,
  onChange,
}: {
  fields: { label: string; value: number; min: number; max: number }[]
  onChange: (index: number, value: number) => void
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
      {fields.map(({ label, value, min, max }, i) => (
        <div key={label}>
          <div style={{ ...labelStyle, marginBottom: '4px', textAlign: 'center' }}>{label}</div>
          <NumInput value={value} min={min} max={max} onChange={v => onChange(i, v)} />
        </div>
      ))}
    </div>
  )
}
