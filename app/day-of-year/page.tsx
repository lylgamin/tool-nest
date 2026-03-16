import type { Metadata } from 'next'
import DayOfYearTool from './_components/DayOfYearTool'

export const metadata: Metadata = {
  title: '経過日数・週数計算',
  description: '指定した日付が年間何日目か、残り日数、ISO 8601週番号、シンプル週番号、年間進捗を計算。うるう年にも対応。',
  openGraph: {
    title: '経過日数・週数計算 | tool-nest',
    description: '指定日付の年間経過日数・残り日数・ISO週番号・年間進捗をブラウザで即計算。',
    url: 'https://tool-nest.pages.dev/day-of-year',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '経過日数・週数計算',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '指定した日付が年間何日目か、残り日数、ISO 8601週番号、年間進捗を計算するWebツール。',
  url: 'https://tool-nest.pages.dev/day-of-year',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function getDayOfYear(year: number, month: number, day: number): DayOfYearResult {
  const date = new Date(year, month - 1, day)
  const startOfYear = new Date(year, 0, 1)
  const dayOfYear = Math.round(
    (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
  ) + 1
  const totalDays = isLeapYear(year) ? 366 : 365
  // ISO週番号は第1木曜日を含む週が第1週
  const { isoWeek, isoYear } = getISOWeek(year, month, day)
  return { dayOfYear, remaining: totalDays - dayOfYear, /* ... */ }
}`

export default function DayOfYearPage() {
  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--teal)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          calculate / date
        </div>
        <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 500, color: 'var(--ink)', margin: 0, lineHeight: 1.1 }}>
          経過日数・週数計算
        </h1>
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', marginTop: '0.75rem', lineHeight: 1.6 }}>
          指定した日付が年間何日目か、残り日数、ISO 8601週番号、シンプル週番号、年間進捗を計算します。うるう年にも対応しています。
        </p>
      </div>

      <section style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem', marginBottom: '3rem' }}>
        <DayOfYearTool />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="使い方" count="01" />
        <ol style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', lineHeight: 2, paddingLeft: '1.5rem', margin: 0 }}>
          <li>日付欄に <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>yyyy-mm-dd</code> 形式で日付を入力します</li>
          <li>「今日」ボタンをクリックすると本日の日付が自動入力されます</li>
          <li>経過日数・残り日数・曜日・週番号・年間進捗バーが即座に表示されます</li>
        </ol>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="実装コード" count="02" />
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', marginBottom: '1rem', lineHeight: 1.7 }}>
          年初からのミリ秒差分を日数に変換して経過日数を算出します。ISO週番号はその年の第1木曜日を含む週を第1週とするルールで計算します。
        </p>
        <pre style={{ backgroundColor: '#111820', color: '#a8b8c8', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', lineHeight: 1.65, padding: '1.25rem 1.5rem', borderRadius: '6px', overflowX: 'auto', margin: 0 }}>
          <code>{coreCode}</code>
        </pre>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="よくある使用例・注意点" count="03" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <UsageNote
            title="ISO 8601 週番号とシンプル週番号の違い"
            body="ISO週番号は「その年の第1木曜日を含む週が第1週」というルール。年末年始では前後の年の週番号になることがあります。シンプル週番号は Math.ceil(経過日数 / 7) の単純計算です。"
          />
          <UsageNote
            title="うるう年の影響"
            body="うるう年（4年に一度、ただし100の倍数は除く、400の倍数は含む）は366日あります。2月29日以降の日付は平年より経過日数が1多くなります。"
          />
          <UsageNote
            title="年間進捗バー"
            body="バーは経過日数/年間日数の割合を視覚化します。プロジェクト計画や目標管理の際に、年間のどの位置にいるかを直感的に把握できます。"
          />
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="日本の祝日計算" href="/japan-holidays" />
          <RelatedToolBadge label="営業日計算" href="/business-days" />
          <RelatedToolBadge label="UNIXタイム変換" href="/unix-time" />
        </div>
      </section>

      <section>
        <SectionHeading title="ソースコード" count="05" />
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', lineHeight: 1.7 }}>
          このツールのソースコード（テストコードを含む）はGitHubで公開しています。MITライセンスで自由に利用・改変できます。
        </p>
        <a
          href="https://github.com/lylgamin/tool-nest/tree/main/app/day-of-year"
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
