import type { Metadata } from 'next'
import UnixTimeTool from './_components/UnixTimeTool'

export const metadata: Metadata = {
  title: 'UNIXタイムスタンプ変換',
  description: 'UNIXタイムスタンプ（秒・ミリ秒）をUTC・JST・ISO 8601形式の日時に変換。日時からUNIXタイムスタンプへの逆変換にも対応。タイムゾーン指定可能。',
  openGraph: {
    title: 'UNIXタイムスタンプ変換 | tool-nest',
    description: 'UNIXタイムスタンプと日時を相互変換。UTC・JST・ISO 8601対応。タイムゾーン指定可能。',
    url: 'https://tool-nest.pages.dev/unix-time',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'UNIXタイムスタンプ変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'UNIXタイムスタンプ（秒・ミリ秒）をUTC・JST・ISO 8601形式の日時に変換するWebツール。日時からUNIXタイムスタンプへの逆変換にも対応。',
  url: 'https://tool-nest.pages.dev/unix-time',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export function fromUnix(unix: number): TimestampResult {
  const date = new Date(unix * 1000)
  return {
    unix,
    unixMs: unix * 1000,
    iso:    date.toISOString(),
    jst:    formatDateTime(date, 9 * 60 * 60 * 1000),
    utc:    formatDateTime(date, 0),
  }
}

// 日時 → Unixタイムスタンプ
export function toUnix(dateStr: string, timeStr: string, offsetHours: number): number {
  const [year, month, day]     = dateStr.split('-').map(Number)
  const [hour, minute, second] = timeStr.split(':').map(Number)
  const offsetMs = offsetHours * 60 * 60 * 1000
  return Math.floor((Date.UTC(year, month - 1, day, hour, minute, second) - offsetMs) / 1000)
}`

export default function UnixTimePage() {
  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--teal)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          convert / time
        </div>
        <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 500, color: 'var(--ink)', margin: 0, lineHeight: 1.1 }}>
          UNIXタイムスタンプ変換
        </h1>
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', marginTop: '0.75rem', lineHeight: 1.6 }}>
          UNIXタイムスタンプ（秒・ミリ秒）をUTC・JST・ISO 8601形式の日時に変換します。日時からタイムスタンプへの逆変換にも対応しています。
        </p>
      </div>

      <section style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem', marginBottom: '3rem' }}>
        <UnixTimeTool />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="使い方" count="01" />
        <ol style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', lineHeight: 2, paddingLeft: '1.5rem', margin: 0 }}>
          <li>「タイムスタンプ → 日時」タブでUnixタイムスタンプ（秒）を入力すると、UTC・JST・ISO 8601形式の日時が表示されます</li>
          <li>「現在時刻」ボタンを押すと現在のUnixタイムスタンプを自動入力できます</li>
          <li>「日時 → タイムスタンプ」タブでは日付・時刻・タイムゾーンを入力してUnixタイムスタンプに変換できます</li>
        </ol>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="実装コード" count="02" />
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', marginBottom: '1rem', lineHeight: 1.7 }}>
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>new Date(unix * 1000)</code> でUnixタイムスタンプをDateオブジェクトに変換し、オフセット計算でタイムゾーンごとの日時文字列を生成します。外部ライブラリ不要で標準APIのみで実装しています。
        </p>
        <pre style={{ backgroundColor: '#111820', color: '#a8b8c8', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', lineHeight: 1.65, padding: '1.25rem 1.5rem', borderRadius: '6px', overflowX: 'auto', margin: 0 }}>
          <code>{coreCode}</code>
        </pre>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="よくある使用例・注意点" count="03" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <UsageNote title="Unixタイムスタンプとは" body="1970年1月1日0時0分0秒（UTC）からの経過秒数。32ビット整数の場合2038年問題があります。" />
          <UsageNote title="タイムゾーンの注意" body="同じUnixタイムスタンプでもJST（UTC+9）ではUTCより9時間進んだ日時として表示されます。" />
          <UsageNote title="ミリ秒との違い" body="JavaScriptの Date.now() はミリ秒を返します。秒に変換するには1000で割ります。" />
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="タイムゾーン変換" href="/timezone" />
          <RelatedToolBadge label="日時差分計算" href="/date-diff" />
          <RelatedToolBadge label="cron式パーサー" href="/cron-parser" />
          <RelatedToolBadge label="西暦・和暦変換" href="/wareki" />
          <RelatedToolBadge label="年間通算日計算" href="/day-of-year" />
        </div>
      </section>

      <section>
        <SectionHeading title="ソースコード" count="05" />
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', lineHeight: 1.7 }}>
          このツールのソースコード（テストコードを含む）はGitHubで公開しています。MITライセンスで自由に利用・改変できます。
        </p>
        <a
          href="https://github.com/lylgamin/tool-nest/tree/main/app/unix-time"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', color: 'var(--navy)', textDecoration: 'none', border: '1px solid var(--border)', borderRadius: '4px', padding: '8px 14px', marginTop: '0.75rem', backgroundColor: 'var(--surface)' }}
        >
          GitHub でコードを見る →
        </a>
      </section>
    </main>
  )
}

function SectionHeading({ title, count }: { title: string; count: string }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-noto-serif), serif', fontSize: '18px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
          {title}
        </h2>
        <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>
          {count}
        </span>
      </div>
      <div style={{ height: '1px', backgroundColor: 'var(--border-light)', marginTop: '0.75rem' }} />
    </div>
  )
}

function UsageNote({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '1rem 1.25rem' }}>
      <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--ink)', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)', lineHeight: 1.7 }}>{body}</div>
    </div>
  )
}

function RelatedToolBadge({ label, href }: { label: string; href?: string }) {
  if (href) {
    return (
      <a href={href} style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', letterSpacing: '0.05em', color: 'var(--navy)', border: '1px solid var(--border-light)', borderRadius: '3px', padding: '5px 10px', textDecoration: 'none' }}>
        {label}
      </a>
    )
  }
  return (
    <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', letterSpacing: '0.05em', color: 'var(--ink-faint)', border: '1px solid var(--border-light)', borderRadius: '3px', padding: '5px 10px' }}>
      {label} — 準備中
    </span>
  )
}
