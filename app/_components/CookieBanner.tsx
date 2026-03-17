'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Cookieの使用について"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
        padding: '0.875rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <p
        style={{
          margin: 0,
          flex: 1,
          minWidth: '240px',
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '12px',
          color: 'var(--ink-mid)',
          lineHeight: 1.6,
        }}
      >
        当サイトはGoogle AdSenseによる広告配信のためCookieを使用します。詳細は
        <Link
          href="/privacy"
          style={{
            color: 'var(--teal)',
            textDecoration: 'underline',
            marginLeft: '0.2em',
          }}
        >
          プライバシーポリシー
        </Link>
        をご確認ください。
      </p>

      <div style={{ display: 'flex', gap: '0.625rem', flexShrink: 0 }}>
        <Link
          href="/privacy"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.08em',
            color: 'var(--ink-light)',
            textDecoration: 'none',
            border: '1px solid var(--border)',
            borderRadius: '3px',
            padding: '5px 12px',
            backgroundColor: 'transparent',
          }}
        >
          詳細
        </Link>
        <button
          onClick={accept}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            letterSpacing: '0.08em',
            color: '#fff',
            backgroundColor: 'var(--navy)',
            border: '1px solid var(--navy)',
            borderRadius: '3px',
            padding: '5px 16px',
            cursor: 'pointer',
          }}
        >
          同意する
        </button>
      </div>
    </div>
  )
}
