import type { Metadata } from 'next'
import BusinessDaysTool from './_components/BusinessDaysTool'

export const metadata: Metadata = {
  title: '営業日計算',
  description: '開始日〜終了日の営業日数を計算します。祝日リストの貼り付け・土曜除外オプションに対応。日本の祝日計算ツールと連携してご利用いただけます。',
  openGraph: {
    title: '営業日計算 | tool-nest',
    description: '期間の営業日数を計算。祝日リスト貼り付け・土曜除外オプション対応。',
    url: 'https://tool-nest.pages.dev/business-days',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '営業日計算',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '開始日〜終了日の営業日数を計算するWebツール。祝日リスト貼り付け・土曜除外オプション対応。',
  url: 'https://tool-nest.pages.dev/business-days',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export function calcBusinessDays(opts: BusinessDaysOptions): BusinessDaysResult {
  const { startDate, endDate, excludeSaturday, holidays } = opts
  if (startDate > endDate) return { businessDays: 0, ... }

  const holidaySet = new Set(holidays)
  let businessDays = 0, excludedSundays = 0, ...

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay()
    if (dow === 0) { excludedSundays++; continue }
    if (dow === 6 && excludeSaturday) { excludedSaturdays++; continue }
    if (holidaySet.has(dateStr) && dow !== 0 && !(dow === 6 && excludeSaturday)) {
      excludedHolidays++; continue
    }
    businessDays++
  }
  return { businessDays, totalDays, excludedSundays, excludedSaturdays, excludedHolidays }
}`

export default function BusinessDaysPage() {
  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--teal)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          calc / date
        </div>
        <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 500, color: 'var(--ink)', margin: 0, lineHeight: 1.1 }}>
          営業日計算
        </h1>
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', marginTop: '0.75rem', lineHeight: 1.6 }}>
          開始日〜終了日の営業日数を計算します。祝日リストの貼り付けと土曜除外オプションに対応しています。
        </p>
      </div>

      <section style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem', marginBottom: '3rem' }}>
        <BusinessDaysTool />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="使い方" count="01" />
        <ol style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', lineHeight: 2, paddingLeft: '1.5rem', margin: 0 }}>
          <li>開始日・終了日を入力します（当日を含む）</li>
          <li>必要に応じて「土曜日を除外する」をチェックします</li>
          <li>「日本の祝日計算」ツールで取得した日付リストを祝日欄に貼り付けます</li>
          <li>入力と同時に営業日数・除外数が自動で計算されます</li>
        </ol>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="実装コード" count="02" />
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', marginBottom: '1rem', lineHeight: 1.7 }}>
          1日ずつ走査するシンプルな実装です。祝日は <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>Set&lt;string&gt;</code> で管理しO(1)で検索します。
        </p>
        <pre style={{ backgroundColor: '#111820', color: '#a8b8c8', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', lineHeight: 1.65, padding: '1.25rem 1.5rem', borderRadius: '6px', overflowX: 'auto', margin: 0 }}>
          <code>{coreCode}</code>
        </pre>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="よくある使用例・注意点" count="03" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <UsageNote title="祝日は自動取得しない理由" body="APIに依存せずオフラインでも動くよう、祝日は手動入力方式にしています。「日本の祝日計算」ツールで取得した日付リストをそのまま貼り付けると簡単です。" />
          <UsageNote title="土曜日の扱い" body="デフォルトでは土曜日も除外します（週休2日制想定）。土曜出勤がある場合はチェックを外してください。" />
          <UsageNote title="同日入力時の挙動" body="開始日と終了日が同じ日付の場合、その1日を計算します（平日なら1営業日、日曜なら0）。" />
          <UsageNote title="祝日と土日の重複" body="土日と重なる祝日は「除外: 祝日」にはカウントされません。日曜祝日は「除外: 日曜」、土曜祝日（除外ON時）は「除外: 土曜」にカウントされます。" />
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="日本の祝日計算" href="/japan-holidays" />
          <RelatedToolBadge label="日時差分計算" href="/date-diff" />
          <RelatedToolBadge label="cron式パーサー" href="/cron-parser" />
          <RelatedToolBadge label="西暦・和暦変換" href="/wareki" />
          <RelatedToolBadge label="文字数カウンター" href="/character-count" />
        </div>
      </section>

      <section>
        <SectionHeading title="ソースコード" count="05" />
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', lineHeight: 1.7 }}>
          このツールのソースコード（テストコードを含む）はGitHubで公開しています。MITライセンスで自由に利用・改変できます。
        </p>
        <a
          href="https://github.com/lylgamin/tool-nest/tree/main/app/business-days"
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
        <h2 style={{ fontFamily: 'var(--font-noto-serif), serif', fontSize: '18px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>{title}</h2>
        <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>{count}</span>
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
