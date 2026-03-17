import type { Metadata } from 'next'
import CronParserClient from './_components/CronParserClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'cron式パーサー — cron式を日本語で解説',
  description: 'cron式（cronジョブの時間設定）を入力すると日本語で意味を解説し、次回実行時刻を表示。*/5 * * * * など各種パターンに対応。',
  openGraph: {
    title: 'cron式パーサー | tool-nest',
    description: 'cron式を入力すると日本語で意味を解説し、次回実行時刻を表示。',
    url: 'https://tool-nest.pages.dev/cron-parser',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'cron式パーサー',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'cron式（cronジョブの時間設定）を入力すると日本語で意味を解説し、次回実行時刻を表示。',
  url: 'https://tool-nest.pages.dev/cron-parser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export type CronFields = {
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

export type ParseResult =
  | { ok: true; fields: CronFields; description: string }
  | { ok: false; error: string }

// フィールド値に対して指定した数値がマッチするか判定
function matchesField(value: string, num: number): boolean {
  if (value === '*') return true
  if (value.includes(','))
    return value.split(',').some(part => matchesField(part.trim(), num))
  if (/^\\*\\/(\\d+)$/.test(value)) {
    const n = parseInt(value.slice(2), 10)
    return n > 0 && num % n === 0
  }
  const rangeStep = value.match(/^(\\d+)-(\\d+)\\/(\\d+)$/)
  if (rangeStep) {
    const [, a, b, n] = rangeStep.map(Number)
    return num >= a && num <= b && n > 0 && (num - a) % n === 0
  }
  const range = value.match(/^(\\d+)-(\\d+)$/)
  if (range) return num >= Number(range[1]) && num <= Number(range[2])
  if (/^\\d+$/.test(value)) return parseInt(value, 10) === num
  return false
}

// cron式をパース
export function parseCron(expr: string): ParseResult {
  const parts = expr.trim().split(/\\s+/)
  if (parts.length !== 5)
    return { ok: false, error: '5フィールド（分 時 日 月 曜日）が必要です' }
  const valid = /^[*0-9,\\-/]+$/
  if (!parts.every(p => valid.test(p)))
    return { ok: false, error: '無効な文字が含まれています' }
  const fields: CronFields = {
    minute: parts[0], hour: parts[1],
    dayOfMonth: parts[2], month: parts[3], dayOfWeek: parts[4],
  }
  return { ok: true, fields, description: describeCron(fields) }
}

// 次のN回の実行時刻を返す
export function getNextExecutions(fields: CronFields, count: number, from?: Date): Date[] {
  const cur = from ? new Date(from) : new Date()
  cur.setSeconds(0, 0)
  cur.setMinutes(cur.getMinutes() + 1)
  const results: Date[] = []
  for (let i = 0; i < 500_000 && results.length < count; i++) {
    if (
      matchesField(fields.minute, cur.getMinutes()) &&
      matchesField(fields.hour, cur.getHours()) &&
      matchesField(fields.dayOfMonth, cur.getDate()) &&
      matchesField(fields.month, cur.getMonth() + 1) &&
      matchesField(fields.dayOfWeek, cur.getDay())
    ) results.push(new Date(cur))
    cur.setMinutes(cur.getMinutes() + 1)
  }
  return results
}`

export default function CronParserPage() {
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
          calc / schedule
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          cron 式パーサー
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          cron式を入力すると日本語で意味を解説し、次回実行時刻を表示します。<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>*/5 * * * *</code> などの各種パターンに対応しています。
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
        <CronParserClient />
      </section>

      <AdUnit />

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
          <li>プリセットボタンをクリックするか、cron式を直接入力してください</li>
          <li>5つのフィールド（分・時・日・月・曜日）に分解して表示します</li>
          <li>「意味」欄に日本語での説明が表示されます</li>
          <li>「次回実行時刻」に現在時刻以降の5件が表示されます</li>
        </ol>
      </section>

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
          外部ライブラリ不要でそのままコピーして利用できます。<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>matchesField</code> 関数が各フィールドのマッチ判定ロジックです。
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
            title="サーバーサイドcronとcrontab構文"
            body="LinuxのcrontabではUNIX cron形式（分 時 日 月 曜日）の5フィールドが基本です。曜日は0=日曜から6=土曜（一部では7も日曜として扱います）。crontabファイルは「crontab -e」で編集でき、ユーザーごとに設定できます。"
          />
          <UsageNote
            title="タイムゾーンの注意点"
            body="cronはサーバーのローカルタイムゾーンで動作します。「毎朝9時」と設定してもサーバーがUTCなら日本時間では18時になります。本ツールの次回実行時刻表示はブラウザのローカルタイムゾーン基準です。本番環境ではサーバーのタイムゾーン設定を必ず確認してください。"
          />
          <UsageNote
            title="クラウドスケジューラーでの利用"
            body="AWS EventBridge（CloudWatch Events）、GCP Cloud Scheduler、GitHub Actionsのscheduleトリガーなどはcron形式に対応しています。ただしAWS EventBridgeは6フィールド（秒を含む）や曜日と日付の同時指定に制限があるなど、実装によって差異があります。"
          />
          <UsageNote
            title="*/n（ステップ）の動作"
            body="*/5 は0, 5, 10, 15...と0からステップします。a-b/n は範囲内でステップします（例: 1-6/2 は 1, 3, 5）。時フィールドで */6 を使うと0, 6, 12, 18時に実行されます。日フィールドの */2 は奇数月に29日以上がある場合に連続実行間隔がずれることがあります。"
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/cron-parser"
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
