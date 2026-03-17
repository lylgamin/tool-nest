'use client'

import { useState, useCallback, useMemo } from 'react'
import { buildOgpTags, validateOgp, type OgpFields } from '../utils'

const DEFAULT_FIELDS: OgpFields = {
  title: '',
  description: '',
  url: 'https://example.com',
  imageUrl: '',
  siteName: '',
  type: 'website',
  twitterCard: 'summary_large_image',
  twitterSite: '',
  twitterCreator: '',
}

export default function OgpPreviewTool() {
  const [fields, setFields] = useState<OgpFields>(DEFAULT_FIELDS)
  const [copied, setCopied] = useState(false)

  const update = useCallback((key: keyof OgpFields, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }))
  }, [])

  const errors = useMemo(() => validateOgp(fields), [fields])
  const tags = useMemo(() => buildOgpTags(fields), [fields])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(tags).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [tags])

  const imageStyle: React.CSSProperties = {
    width: '100%', aspectRatio: '1200/630', backgroundColor: '#e0d8cc',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '4px 4px 0 0', overflow: 'hidden',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormField label="og:title *" error={errors.title}>
          <input type="text" value={fields.title} onChange={e => update('title', e.target.value)} placeholder="ページタイトル（60文字以内推奨）" style={inputStyle(!!errors.title)} onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }} onBlur={e => { e.currentTarget.style.borderColor = errors.title ? '#b83232' : 'var(--border)' }} />
        </FormField>
        <FormField label="og:description" error={errors.description}>
          <textarea value={fields.description} onChange={e => update('description', e.target.value)} placeholder="ページの説明（160文字以内推奨）" rows={3} style={{ ...inputStyle(!!errors.description), resize: 'vertical', lineHeight: 1.6 }} onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }} onBlur={e => { e.currentTarget.style.borderColor = errors.description ? '#b83232' : 'var(--border)' }} />
        </FormField>
        <FormField label="og:url" error={errors.url}>
          <input type="text" value={fields.url} onChange={e => update('url', e.target.value)} placeholder="https://example.com/page" style={inputStyle(!!errors.url)} onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }} onBlur={e => { e.currentTarget.style.borderColor = errors.url ? '#b83232' : 'var(--border)' }} />
        </FormField>
        <FormField label="og:image" error={errors.imageUrl}>
          <input type="text" value={fields.imageUrl} onChange={e => update('imageUrl', e.target.value)} placeholder="https://example.com/og-image.png (1200×630推奨)" style={inputStyle(!!errors.imageUrl)} onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }} onBlur={e => { e.currentTarget.style.borderColor = errors.imageUrl ? '#b83232' : 'var(--border)' }} />
        </FormField>
        <FormField label="og:site_name">
          <input type="text" value={fields.siteName} onChange={e => update('siteName', e.target.value)} placeholder="サイト名" style={inputStyle(false)} onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }} onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }} />
        </FormField>
        <FormField label="twitter:card">
          <select value={fields.twitterCard} onChange={e => update('twitterCard', e.target.value)} style={{ ...inputStyle(false), appearance: 'auto' as React.CSSProperties['appearance'] }}>
            <option value="summary_large_image">summary_large_image（大きな画像）</option>
            <option value="summary">summary（小さな画像）</option>
          </select>
        </FormField>
        <FormField label="twitter:site">
          <input type="text" value={fields.twitterSite} onChange={e => update('twitterSite', e.target.value)} placeholder="@your_account" style={inputStyle(false)} onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }} onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }} />
        </FormField>
      </div>

      {/* Preview + output */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Twitter preview */}
        <div>
          <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Twitter / X プレビュー
          </div>
          <div style={{ border: '1px solid #cfd9de', borderRadius: '12px', overflow: 'hidden', maxWidth: '420px', backgroundColor: '#fff' }}>
            <div style={imageStyle}>
              {fields.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fields.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              ) : (
                <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', color: '#a0a0a0' }}>画像なし（1200×630推奨）</span>
              )}
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid #cfd9de' }}>
              {fields.siteName && <div style={{ fontSize: '13px', color: '#536471', marginBottom: '2px' }}>{fields.siteName}</div>}
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f1419', lineHeight: 1.3 }}>{fields.title || 'ページタイトル'}</div>
              {fields.description && <div style={{ fontSize: '13px', color: '#536471', marginTop: '2px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{fields.description}</div>}
              {fields.url && <div style={{ fontSize: '13px', color: '#536471', marginTop: '4px' }}>{new URL(fields.url.startsWith('http') ? fields.url : 'https://' + fields.url).hostname}</div>}
            </div>
          </div>
        </div>

        {/* Slack preview */}
        <div>
          <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Slack プレビュー
          </div>
          <div style={{ borderLeft: '4px solid #1d9bd1', paddingLeft: '12px', maxWidth: '380px' }}>
            {fields.siteName && <div style={{ fontSize: '12px', fontWeight: 600, color: '#1d1c1d', marginBottom: '2px' }}>{fields.siteName}</div>}
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1264a3', lineHeight: 1.3 }}>{fields.title || 'ページタイトル'}</div>
            {fields.description && <div style={{ fontSize: '13px', color: '#616061', marginTop: '4px', lineHeight: 1.5 }}>{fields.description.slice(0, 100)}{fields.description.length > 100 ? '...' : ''}</div>}
          </div>
        </div>

        {/* Generated tags */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>
              生成されたmetaタグ
            </div>
            <button onClick={handleCopy} style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', letterSpacing: '0.05em', padding: '4px 12px', borderRadius: '3px', border: '1px solid var(--border)', cursor: 'pointer', backgroundColor: 'var(--surface)', color: 'var(--ink-mid)', transition: 'background 0.15s' }}>
              {copied ? 'コピー済み ✓' : 'コピー'}
            </button>
          </div>
          <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#111820', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', color: '#a8b8c8', lineHeight: 1.65, overflowX: 'auto', whiteSpace: 'pre', boxSizing: 'border-box' }}>
            <code>{tags || '// タイトルを入力するとmetaタグが生成されます'}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: '100%', padding: '8px 12px', backgroundColor: 'var(--surface-alt)',
    border: `1px solid ${hasError ? '#b83232' : 'var(--border)'}`, borderRadius: '4px',
    fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink)',
    outline: 'none', boxSizing: 'border-box',
  }
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '12px', fontWeight: 500, color: 'var(--ink-mid)', marginBottom: '4px' }}>
        {label}
      </label>
      {children}
      {error && <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '11px', color: '#b07000', marginTop: '3px' }}>{error}</div>}
    </div>
  )
}
