import type { Metadata } from 'next'
import DateDiffClient from './_components/DateDiffClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: '日時差分計算 — 2つの日時の差を計算',
  description: '2つの日時の差を日・時間・分・秒・年月日で計算するWebツール。デプロイ間隔や期間計算に便利。入力内容はサーバーに送信されません。',
  openGraph: {
    title: '日時差分計算 | tool-nest',
    description: '2つの日時の差を日・時間・分・秒・年月日で計算。デプロイ間隔や期間計算に便利。',
    url: 'https://tool-nest.pages.dev/date-diff',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '日時差分計算',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '2つの日時の差を日・時間・分・秒・年月日で計算するWebツール。',
  url: 'https://tool-nest.pages.dev/date-diff',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export type DiffResult = {
  totalMs: number
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  approxYears: number
  approxMonths: number
  approxDaysRemainder: number
  isPast: boolean
}

export function calcDiff(date1: string, date2: string): DiffResult | null {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null

  const totalMs = Math.abs(d2.getTime() - d1.getTime())
  const totalSeconds = Math.floor(totalMs / 1000)
  const totalMinutes = Math.floor(totalMs / 60000)
  const totalHours = Math.floor(totalMs / 3600000)
  const totalDays = Math.floor(totalMs / 86400000)

  const days = totalDays
  const hours = Math.floor((totalMs % 86400000) / 3600000)
  const minutes = Math.floor((totalMs % 3600000) / 60000)
  const seconds = Math.floor((totalMs % 60000) / 1000)

  const approxYears = Math.floor(totalDays / 365)
  const approxMonths = Math.floor((totalDays % 365) / 30)
  const approxDaysRemainder = totalDays % 30

  return {
    totalMs, days, hours, minutes, seconds,
    totalDays, totalHours, totalMinutes, totalSeconds,
    approxYears, approxMonths, approxDaysRemainder,
    isPast: d1.getTime() > d2.getTime(),
  }
}

export function formatDuration(result: DiffResult): string {
  const parts: string[] = []
  if (result.approxYears > 0) parts.push(\`\${result.approxYears}年\`)
  if (result.approxMonths > 0) parts.push(\`\${result.approxMonths}ヶ月\`)
  if (result.approxDaysRemainder > 0 || parts.length === 0)
    parts.push(\`\${result.approxDaysRemainder}日\`)
  const timeParts: string[] = []
  if (result.hours > 0) timeParts.push(\`\${result.hours}時間\`)
  if (result.minutes > 0) timeParts.push(\`\${result.minutes}分\`)
  if (timeParts.length > 0) parts.push(timeParts.join(''))
  return parts.join('')
}`

export default function DateDiffPage() {
  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      {/* JSON-LD: static structured data, no user input */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />

      {/* ページヘッダー */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.14em',
          color: 'var(--teal)',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
        }}>
          calc / date
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          日時差分計算
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          2つの日時の差を日・時間・分・秒・年月日で計算します。デプロイ間隔や期間計算に便利です。入力内容はサーバーに送信されません。
        </p>
      </div>

      {/* ツール本体 */}
      <section style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '1.5rem',
        marginBottom: '3rem',
      }}>
        <DateDiffClient />
      </section>

      {/* 使い方 */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="使い方" count="01" />
        <ol style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          lineHeight: 2,
          paddingLeft: '1.5rem',
          margin: 0,
        }}>
          <li>「開始日時」と「終了日時」に日時を入力してください</li>
          <li>「今すぐ設定」ボタンで現在時刻を素早くセットできます</li>
          <li>入力と同時にリアルタイムで差分が計算されます</li>
          <li>結果は日・時間・分・秒の詳細表示と、総日数・総時間数などのまとめカードで確認できます</li>
          <li>終了日時が開始日時より前の場合も差分は絶対値で計算されます</li>
        </ol>
      </section>

      <AdUnit />

      {/* 実装コード */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="実装コード" count="02" />
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginBottom: '1rem',
          lineHeight: 1.7,
        }}>
          ブラウザ標準の <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>Date</code> オブジェクトのみで実装。外部ライブラリ不要でそのままコピーして利用できます。
        </p>
        <pre style={{
          backgroundColor: '#111820',
          color: '#a8b8c8',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '13px',
          lineHeight: 1.65,
          padding: '1.25rem 1.5rem',
          borderRadius: '6px',
          overflowX: 'auto',
          margin: 0,
        }}>
          <code>{coreCode}</code>
        </pre>
      </section>

      {/* よくある使用例・注意点 */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="よくある使用例・注意点" count="03" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <UsageNote
            title="プロジェクト期間の計算"
            body="プロジェクトの開始日と終了日を入力することで、正確な開発期間を日・時間単位で把握できます。スプリント期間（14日）やリリース間隔の確認にも便利です。デプロイタイムスタンプを2つ貼り付けるだけで差分が出ます。"
          />
          <UsageNote
            title="年齢・経過年数の計算"
            body="生年月日と現在日時を入力すると「約X年Xヶ月X日」として概算の年齢が表示されます。ただし年月の概算は365日/12ヶ月を基準にしているため、うるう年や月ごとの日数差は考慮されていません。厳密な年齢計算が必要な場合は別途暦計算ロジックを実装してください。"
          />
          <UsageNote
            title="うるう年・月またぎへの注意"
            body="このツールの「年月日概算」はあくまで参考値です。365日を1年、30日を1ヶ月として単純割り算しています。うるう年（366日）や月によって日数が異なる（28〜31日）ため、年月単位での厳密な差分が必要な場合は差異が生じます。正確な差分が必要な場合は「総日数」や「総時間数」を使ってください。"
          />
          <UsageNote
            title="タイムゾーンについて"
            body="datetime-local 入力はブラウザのローカルタイムゾーンで値を扱います。そのため計算結果はあなたのブラウザのタイムゾーン設定に依存します。UTCや別タイムゾーンのタイムスタンプを比較する場合は、同一タイムゾーンに変換してから入力してください。タイムゾーン変換には「タイムゾーン変換」ツールを活用できます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="UNIXタイム変換" href="/unix-time" />
          <RelatedToolBadge label="タイムゾーン変換" href="/timezone" />
          <RelatedToolBadge label="営業日計算" href="/business-days" />
        </div>
      </section>

      {/* GitHubリンク */}
      <section>
        <SectionHeading title="ソースコード" count="05" />
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          lineHeight: 1.7,
        }}>
          このツールのソースコード（テストコードを含む）はGitHubで公開しています。
          MITライセンスで自由に利用・改変できます。
        </p>
        <a
          href="https://github.com/lylgamin/tool-nest/tree/main/app/date-diff"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '12px',
            color: 'var(--navy)',
            textDecoration: 'none',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '8px 14px',
            marginTop: '0.75rem',
            backgroundColor: 'var(--surface)',
          }}
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
        <h2 style={{
          fontFamily: 'var(--font-noto-serif), serif',
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--ink)',
          margin: 0,
        }}>
          {title}
        </h2>
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          color: 'var(--ink-faint)',
          letterSpacing: '0.1em',
        }}>
          {count}
        </span>
      </div>
      <div style={{ height: '1px', backgroundColor: 'var(--border-light)', marginTop: '0.75rem' }} />
    </div>
  )
}

function UsageNote({ title, body }: { title: string; body: string }) {
  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border-light)',
      borderRadius: '4px',
      padding: '1rem 1.25rem',
    }}>
      <div style={{
        fontFamily: 'var(--font-noto-sans), sans-serif',
        fontSize: '14px',
        fontWeight: 500,
        color: 'var(--ink)',
        marginBottom: '4px',
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: 'var(--font-noto-sans), sans-serif',
        fontSize: '13px',
        color: 'var(--ink-mid)',
        lineHeight: 1.7,
      }}>
        {body}
      </div>
    </div>
  )
}

function RelatedToolBadge({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '11px',
        letterSpacing: '0.05em',
        color: 'var(--navy)',
        border: '1px solid var(--border-light)',
        borderRadius: '3px',
        padding: '5px 10px',
        textDecoration: 'none',
        display: 'inline-block',
      }}
    >
      {label}
    </a>
  )
}
