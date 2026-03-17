import type { Metadata } from 'next'
import TimezoneTool from './_components/TimezoneTool'

export const metadata: Metadata = {
  title: 'タイムゾーン変換',
  description: 'UTC・JST・CST・IST・CET・EST・PST・AESTの8タイムゾーンを相互変換。ブラウザ標準APIのみで動作。日時を入力するだけで全タイムゾーンの対応時刻を一覧表示。',
  openGraph: {
    title: 'タイムゾーン変換 | tool-nest',
    description: 'UTC・JST・CST・IST・CET・EST・PST・AESTの8タイムゾーンを相互変換。外部ライブラリなしで動作。',
    url: 'https://tool-nest.pages.dev/timezone',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'タイムゾーン変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'UTC・JST・CST・IST・CET・EST・PST・AESTの8タイムゾーンを相互変換するWebツール。ブラウザ標準APIのみで動作。',
  url: 'https://tool-nest.pages.dev/timezone',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export function convertAllTimezones(unixMs: number): ConvertedTime[] {
  const date = new Date(unixMs)
  return TIMEZONES.map(tz => ({
    id:        tz.id,
    label:     tz.label,
    offset:    tz.offset,
    formatted: new Intl.DateTimeFormat('ja-JP', {
      timeZone: tz.tz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    }).format(date),
  }))
}`

export default function TimezonePage() {
  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--teal)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          convert / time
        </div>
        <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 500, color: 'var(--ink)', margin: 0, lineHeight: 1.1 }}>
          タイムゾーン変換
        </h1>
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', marginTop: '0.75rem', lineHeight: 1.6 }}>
          日時とタイムゾーンを入力すると、UTC・JST・CST・IST・CET・EST・PST・AESTの8タイムゾーンへの変換結果を一覧表示します。ブラウザ標準の <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>Intl.DateTimeFormat</code> のみで動作します。
        </p>
      </div>

      <section style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem', marginBottom: '3rem' }}>
        <TimezoneTool />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="使い方" count="01" />
        <ol style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', lineHeight: 2, paddingLeft: '1.5rem', margin: 0 }}>
          <li>「日付」欄に <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>yyyy-mm-dd</code> 形式で日付を入力します</li>
          <li>「時刻」欄に <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>HH:MM:SS</code> 形式で時刻を入力します</li>
          <li>「元タイムゾーン」でその日時のタイムゾーンを選択します</li>
          <li>入力に応じて8タイムゾーンの対応時刻が自動更新されます。各行の「copy」ボタンでクリップボードにコピーできます</li>
          <li>「現在時刻」ボタンを押すと、選択中のタイムゾーンでの現在時刻が自動入力されます</li>
        </ol>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="実装コード" count="02" />
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', marginBottom: '1rem', lineHeight: 1.7 }}>
          Unix ミリ秒を基準に <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>Intl.DateTimeFormat</code> の <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>timeZone</code> オプションで各タイムゾーンへ変換します。IANA タイムゾーン名（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>Asia/Tokyo</code> など）を渡すだけで、外部ライブラリなしに変換できます。
        </p>
        <pre style={{ backgroundColor: '#111820', color: '#a8b8c8', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', lineHeight: 1.65, padding: '1.25rem 1.5rem', borderRadius: '6px', overflowX: 'auto', margin: 0 }}>
          <code>{coreCode}</code>
        </pre>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="よくある使用例・注意点" count="03" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <UsageNote
            title="夏時間（DST）について"
            body="米国・欧州などは夏時間を採用しており、年によって UTC からのオフセットが変わります。このツールでは代表的な標準時オフセットを使用しています。正確な夏時間を考慮した変換が必要な場合は、IANA タイムゾーン名を直接使用するサーバーサイド処理をご検討ください。"
          />
          <UsageNote
            title="Intl.DateTimeFormat の活用"
            body="ブラウザ標準 API の Intl.DateTimeFormat にタイムゾーン名（IANA tz データベース形式）を渡すことで、外部ライブラリなしに変換できます。Chrome/Edge 80+、Firefox 78+、Safari 14+ で動作します。"
          />
          <UsageNote
            title="対応タイムゾーン"
            body="UTC, JST（日本）, CST（中国）, IST（インド）, CET（中欧）, EST（米東部）, PST（米西部）, AEST（豪州）の8タイムゾーンに対応しています。入力元のタイムゾーンを選択して変換すると、選択中の行がハイライト表示されます。"
          />
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="Unix時間変換" href="/unix-time" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/timezone"
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
