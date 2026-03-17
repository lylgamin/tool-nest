import Link from 'next/link'

const BROWSER_SUPPORT = [
  { name: 'Chrome',  version: '80+' },
  { name: 'Edge',    version: '80+' },
  { name: 'Firefox', version: '78+' },
  { name: 'Safari',  version: '14+' },
]

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-light)',
      marginTop: 'auto',
      padding: '2rem 1.5rem',
      backgroundColor: 'var(--surface)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          {/* 対応ブラウザ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '9px',
              letterSpacing: '0.12em',
              color: 'var(--ink-faint)',
              textTransform: 'uppercase',
            }}>
              対応ブラウザ
            </span>
            {BROWSER_SUPPORT.map(({ name, version }) => (
              <span key={name} style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '10px',
                color: 'var(--ink-light)',
                border: '1px solid var(--border-light)',
                borderRadius: '3px',
                padding: '2px 7px',
              }}>
                {name} {version}
              </span>
            ))}
          </div>

          {/* コピーライト + ポリシーリンク */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            color: 'var(--ink-faint)',
            letterSpacing: '0.06em',
          }}>
            <Link
              href="/privacy"
              style={{
                color: 'var(--ink-light)',
                textDecoration: 'none',
              }}
            >
              プライバシーポリシー
            </Link>
            <span>© {new Date().getFullYear()} tool-nest</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
