'use client'

import { useState, useCallback, useMemo } from 'react'
import { COMMIT_TYPES, buildCommitMessage, validateSubject, type CommitFields } from '../utils'

export default function GitCommitBuilderTool() {
  const [fields, setFields] = useState<CommitFields>({
    type: 'feat', scope: '', breaking: false, subject: '', body: '', footer: '',
  })
  const [copied, setCopied] = useState(false)

  const update = useCallback((key: keyof CommitFields, value: string | boolean) => {
    setFields(prev => ({ ...prev, [key]: value }))
  }, [])

  const message = useMemo(() => buildCommitMessage(fields), [fields])
  const subjectError = useMemo(() => validateSubject(fields.subject), [fields.subject])

  const handleCopy = useCallback(() => {
    if (!message) return
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [message])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Type */}
        <div>
          <FieldLabel>コミットタイプ *</FieldLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '4px', marginTop: '6px' }}>
            {COMMIT_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => update('type', t.value)}
                title={t.description}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 10px', borderRadius: '3px',
                  border: `1px solid ${fields.type === t.value ? 'var(--teal)' : 'var(--border-light)'}`,
                  backgroundColor: fields.type === t.value ? 'var(--teal-mid)' : 'var(--surface)',
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px',
                  color: 'var(--ink-mid)', transition: 'all 0.15s',
                }}
              >
                <span>{t.emoji}</span>
                <span style={{ fontWeight: fields.type === t.value ? 600 : 400, color: fields.type === t.value ? 'var(--teal)' : 'var(--ink-mid)' }}>{t.value}</span>
              </button>
            ))}
          </div>
          {fields.type && (
            <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '12px', color: 'var(--ink-light)', marginTop: '6px' }}>
              {COMMIT_TYPES.find(t => t.value === fields.type)?.description}
            </div>
          )}
        </div>

        {/* Scope */}
        <div>
          <FieldLabel>スコープ（任意）</FieldLabel>
          <input
            type="text"
            value={fields.scope}
            onChange={e => update('scope', e.target.value)}
            placeholder="auth, api, ui など"
            style={{ width: '100%', marginTop: '6px', padding: '8px 12px', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>

        {/* Subject */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FieldLabel>タイトル *</FieldLabel>
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: fields.subject.length > 72 ? '#b83232' : 'var(--ink-faint)' }}>
              {fields.subject.length}/72
            </span>
          </div>
          <input
            type="text"
            value={fields.subject}
            onChange={e => update('subject', e.target.value)}
            placeholder="変更内容を簡潔に（英語・命令形推奨）"
            style={{ width: '100%', marginTop: '6px', padding: '8px 12px', backgroundColor: 'var(--surface-alt)', border: `1px solid ${subjectError && fields.subject ? '#b83232' : 'var(--border)'}`, borderRadius: '4px', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => { if (!subjectError || !fields.subject) e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = subjectError && fields.subject ? '#b83232' : 'var(--border)' }}
          />
          {subjectError && fields.subject && (
            <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '12px', color: '#b83232', marginTop: '4px' }}>{subjectError}</div>
          )}
        </div>

        {/* Breaking Change */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={fields.breaking}
            onChange={e => update('breaking', e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--navy)', cursor: 'pointer' }}
          />
          <span style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)' }}>
            BREAKING CHANGE（後方互換性なし）
          </span>
        </label>

        {/* Body */}
        <div>
          <FieldLabel>本文（任意）</FieldLabel>
          <textarea
            value={fields.body}
            onChange={e => update('body', e.target.value)}
            placeholder="変更の詳細、背景、理由など"
            rows={3}
            style={{ width: '100%', marginTop: '6px', padding: '8px 12px', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink)', resize: 'vertical', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>

        {/* Footer */}
        <div>
          <FieldLabel>フッター（任意）</FieldLabel>
          <textarea
            value={fields.footer}
            onChange={e => update('footer', e.target.value)}
            placeholder={fields.breaking ? 'BREAKING CHANGE: 既存の挙動が変わる内容を記載' : 'Closes #123, Refs #456 など'}
            rows={2}
            style={{ width: '100%', marginTop: '6px', padding: '8px 12px', backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink)', resize: 'vertical', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--teal)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
        </div>
      </div>

      {/* Output */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase' }}>
            生成されたコミットメッセージ
          </label>
          <button
            onClick={handleCopy}
            disabled={!message}
            style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', letterSpacing: '0.05em', padding: '4px 12px', borderRadius: '3px', border: '1px solid var(--border)', cursor: message ? 'pointer' : 'default', backgroundColor: 'var(--surface)', color: message ? 'var(--ink-mid)' : 'var(--ink-faint)', opacity: message ? 1 : 0.5, transition: 'background 0.15s' }}
          >
            {copied ? 'コピー済み ✓' : 'コピー'}
          </button>
        </div>
        <pre style={{ margin: 0, padding: '1.25rem', backgroundColor: '#111820', borderRadius: '4px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', color: message ? '#a8b8c8' : '#4a5a6a', lineHeight: 1.65, overflowX: 'auto', minHeight: '120px', whiteSpace: 'pre', boxSizing: 'border-box' }}>
          <code>{message || '// タイプとタイトルを入力するとメッセージが生成されます'}</code>
        </pre>

        {/* Preview breakdown */}
        {message && (
          <div style={{ backgroundColor: 'var(--surface-alt)', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '0.75rem 1rem' }}>
            <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--ink-light)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>構造</div>
            {[
              { key: 'type', label: 'タイプ', val: fields.type },
              ...(fields.scope ? [{ key: 'scope', label: 'スコープ', val: fields.scope }] : []),
              { key: 'subject', label: 'タイトル', val: fields.subject },
              ...(fields.body ? [{ key: 'body', label: '本文', val: fields.body.slice(0, 40) + (fields.body.length > 40 ? '...' : '') }] : []),
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', gap: '8px', marginBottom: '2px' }}>
                <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: 'var(--teal)', minWidth: '60px' }}>{item.label}</span>
                <span style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '12px', color: 'var(--ink-mid)' }}>{item.val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '12px', fontWeight: 500, color: 'var(--ink-mid)' }}>
      {children}
    </div>
  )
}
