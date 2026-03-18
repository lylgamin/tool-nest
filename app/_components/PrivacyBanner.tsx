'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'tool_nest_banner_v1'

export default function PrivacyBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {}
  }, [])

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 49,
        borderBottom: '1px solid var(--teal)',
        backgroundColor: 'var(--teal-mid)',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        height: 36,
      }}
    >
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color: 'var(--teal)',
        letterSpacing: '0.04em',
      }}>
        🔒 すべての処理はブラウザ内で完結。入力データはサーバーに送信されません。
        <Link
          href="/privacy"
          style={{ color: 'var(--teal)', marginLeft: 8, textDecoration: 'underline', textUnderlineOffset: 2 }}
        >
          プライバシーポリシー
        </Link>
      </span>
      <button
        onClick={dismiss}
        aria-label="バナーを閉じる"
        style={{
          position: 'absolute',
          right: 12,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--teal)',
          fontSize: 16,
          lineHeight: 1,
          padding: '4px 6px',
        }}
      >
        ×
      </button>
    </div>
  )
}
