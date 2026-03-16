import type { Metadata } from 'next'
import WarekiTool from './_components/WarekiTool'

export const metadata: Metadata = {
  title: '西暦・和暦変換',
  description: '西暦（グレゴリオ暦）と和暦（令和・平成・昭和・大正・明治）を相互変換。元号の境界日を正確に処理。漢字・英字1文字どちらの形式でも出力可能。',
  openGraph: {
    title: '西暦・和暦変換 | tool-nest',
    description: '西暦と和暦（令和・平成・昭和・大正・明治）を相互変換。元号境界を正確に処理。',
    url: 'https://tool-nest.pages.dev/wareki',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '西暦・和暦変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '西暦と和暦（令和・平成・昭和・大正・明治）を相互変換するWebツール。元号の境界日を正確に処理。',
  url: 'https://tool-nest.pages.dev/wareki',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `const ERAS = [
  { kanji: '令和', alpha: 'R', start: [2019, 5,  1],  baseYear: 2019 },
  { kanji: '平成', alpha: 'H', start: [1989, 1,  8],  baseYear: 1989 },
  { kanji: '昭和', alpha: 'S', start: [1926, 12, 25], baseYear: 1926 },
  { kanji: '大正', alpha: 'T', start: [1912, 7,  30], baseYear: 1912 },
  { kanji: '明治', alpha: 'M', start: [1868, 1,  25], baseYear: 1868 },
] as const

export function toWareki(
  year: number, month: number, day: number, style: 'kanji' | 'alpha'
): WarekiResult | null {
  for (const era of ERAS) {
    const [sy, sm, sd] = era.start
    if (compareDates(year, month, day, sy, sm, sd) >= 0) {
      const eraYear = year - era.baseYear + 1
      // ...
      return { era, year: eraYear, yearLabel, full }
    }
  }
  return null  // 明治元年より前
}`

export default function WarekiPage() {
  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--teal)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          convert / date
        </div>
        <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 500, color: 'var(--ink)', margin: 0, lineHeight: 1.1 }}>
          西暦・和暦変換
        </h1>
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', marginTop: '0.75rem', lineHeight: 1.6 }}>
          西暦（グレゴリオ暦）と和暦（令和・平成・昭和・大正・明治）を相互変換します。元号の境界日を正確に処理します。
        </p>
      </div>

      <section style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem', marginBottom: '3rem' }}>
        <WarekiTool />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="使い方" count="01" />
        <ol style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', lineHeight: 2, paddingLeft: '1.5rem', margin: 0 }}>
          <li>「西暦 → 和暦」タブで年月日を入力すると、対応する和暦が表示されます</li>
          <li>出力形式は「漢字（令和6年）」と「英字（R6）」から選択できます</li>
          <li>「和暦 → 西暦」タブでは元号・年・月・日を入力して西暦に変換できます</li>
        </ol>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="実装コード" count="02" />
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', marginBottom: '1rem', lineHeight: 1.7 }}>
          元号テーブルを新しい順に並べ、数値比較で境界判定します。<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>new Date()</code> を使わずタイムゾーン問題を回避しています。
        </p>
        <pre style={{ backgroundColor: '#111820', color: '#a8b8c8', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', lineHeight: 1.65, padding: '1.25rem 1.5rem', borderRadius: '6px', overflowX: 'auto', margin: 0 }}>
          <code>{coreCode}</code>
        </pre>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="よくある使用例・注意点" count="03" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <UsageNote title="元号の境界について" body="明治・大正・昭和・平成・令和はそれぞれ特定の日付から始まります。例えば昭和は1926年12月25日から、平成は1989年1月8日からです。このツールはその境界日を正確に処理します。" />
          <UsageNote title="元年（1年目）の表示" body="漢字形式では1年目を「元年」と表示します（例：令和元年）。英字形式では「R1」のように数字1で表示します。" />
          <UsageNote title="対応範囲" body="明治元年（1868年1月25日）以降の日付に対応しています。それより前の日付を入力するとエラーが表示されます。" />
          <UsageNote title="春分・秋分との組み合わせ" body="祝日計算（春分の日・秋分の日）との組み合わせが必要な場合は、「日本の祝日計算」ツールも合わせてご利用ください。" />
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="日本の祝日計算" href="/japan-holidays" />
          <RelatedToolBadge label="営業日計算" href="/business-days" />
          <RelatedToolBadge label="文字数カウンター" href="/character-count" />
        </div>
      </section>

      <section>
        <SectionHeading title="ソースコード" count="05" />
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', lineHeight: 1.7 }}>
          このツールのソースコード（テストコードを含む）はGitHubで公開しています。MITライセンスで自由に利用・改変できます。
        </p>
        <a
          href="https://github.com/lylgamin/tool-nest/tree/main/app/wareki"
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
