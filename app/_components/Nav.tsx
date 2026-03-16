import Link from 'next/link'

export default function Nav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(243,239,232,0.85)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
          {/* ロゴ */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              border: '2px solid var(--navy)',
              boxShadow: '2px 2px 0 var(--navy)',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--navy)',
              letterSpacing: '-0.02em',
            }}>
              TN
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--ink)',
                letterSpacing: '0.04em',
              }}>
                tool-nest
              </span>
              <span style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '9px',
                color: 'var(--ink-light)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                developer utilities
              </span>
            </span>
          </Link>

          {/* ナビリンク */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-noto-sans), sans-serif',
                fontSize: '13px',
                color: 'var(--ink-mid)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              ツール一覧
            </Link>
            <Link
              href="/#categories"
              style={{
                fontFamily: 'var(--font-noto-sans), sans-serif',
                fontSize: '13px',
                color: 'var(--ink-mid)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              カテゴリ
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
