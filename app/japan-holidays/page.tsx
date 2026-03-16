import type { Metadata } from 'next'
import JapanHolidaysTool from './_components/JapanHolidaysTool'

export const metadata: Metadata = {
  title: '日本の祝日計算',
  description: '指定した年の日本の祝日一覧を計算します。ハッピーマンデー・振替休日・国民の祝日に対応。営業日計算ツールへのコピー形式で出力できます。',
  openGraph: {
    title: '日本の祝日計算 | tool-nest',
    description: '指定年の日本の祝日一覧を計算。ハッピーマンデー・振替休日対応。',
    url: 'https://tool-nest.pages.dev/japan-holidays',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '日本の祝日計算',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '指定した年の日本の祝日一覧を計算するWebツール。ハッピーマンデー・振替休日・国民の祝日に対応。',
  url: 'https://tool-nest.pages.dev/japan-holidays',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export function getHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = []

  // 固定祝日
  holidays.push({ date: \`\${year}-01-01\`, name: '元日' })
  // ... 他の固定祝日

  // ハッピーマンデー（第n月曜）
  holidays.push({ date: nthMonday(year, 1, 2), name: '成人の日' })
  holidays.push({ date: nthMonday(year, 7, 3), name: '海の日' })
  holidays.push({ date: nthMonday(year, 9, 3), name: '敬老の日' })
  holidays.push({ date: nthMonday(year, 10, 2), name: 'スポーツの日' })

  holidays.sort((a, b) => a.date.localeCompare(b.date))

  // 国民の祝日（前後両日が祝日の平日）
  // ...

  // 振替休日（祝日が日曜→翌月曜）
  // ...

  return holidays.sort((a, b) => a.date.localeCompare(b.date))
}`

export default function JapanHolidaysPage() {
  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--teal)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          calc / date
        </div>
        <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 500, color: 'var(--ink)', margin: 0, lineHeight: 1.1 }}>
          日本の祝日計算
        </h1>
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', marginTop: '0.75rem', lineHeight: 1.6 }}>
          指定した年の日本の祝日一覧を計算します。ハッピーマンデー・振替休日・国民の祝日に対応しています。
        </p>
      </div>

      <section style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem', marginBottom: '3rem' }}>
        <JapanHolidaysTool />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="使い方" count="01" />
        <ol style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', lineHeight: 2, paddingLeft: '1.5rem', margin: 0 }}>
          <li>年を入力して「計算」ボタンを押すと、その年の祝日一覧が表示されます</li>
          <li>「日付リストをコピー」ボタンで yyyy-mm-dd 形式の日付リストをクリップボードにコピーできます</li>
          <li>コピーした内容を「営業日計算」ツールの祝日欄に貼り付けることで、正確な営業日計算ができます</li>
        </ol>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="実装コード" count="02" />
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', marginBottom: '1rem', lineHeight: 1.7 }}>
          外部APIなし、ブラウザ標準の <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>Date</code> オブジェクトのみで実装しています。
        </p>
        <pre style={{ backgroundColor: '#111820', color: '#a8b8c8', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', lineHeight: 1.65, padding: '1.25rem 1.5rem', borderRadius: '6px', overflowX: 'auto', margin: 0 }}>
          <code>{coreCode}</code>
        </pre>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="よくある使用例・注意点" count="03" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <UsageNote title="ハッピーマンデー制度" body="成人の日（1月第2月曜）・海の日（7月第3月曜）・敬老の日（9月第3月曜）・スポーツの日（10月第2月曜）は固定日付ではなく、第n月曜に設定されています。" />
          <UsageNote title="春分の日・秋分の日について" body="正確な春分・秋分は天文計算が必要です。このツールでは一般的に使われる3月21日・9月23日を固定値として使用しています。年によって1日ずれる場合があります。" />
          <UsageNote title="振替休日のルール" body="祝日が日曜日にあたる場合、翌月曜日が振替休日になります。翌月曜日も祝日の場合は、さらに翌日に繰り越されます。" />
          <UsageNote title="国民の祝日" body="前日と翌日がどちらも祝日で、その日が平日の場合「国民の祝日」になります。例：5月3日（憲法記念日）と5月5日（こどもの日）に挟まれた5月4日がみどりの日になる前の年など。" />
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="営業日計算" href="/business-days" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/japan-holidays"
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
