import type { Metadata } from 'next'
import TaxCalculatorClient from './_components/TaxCalculatorClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: '消費税計算 — 税抜/税込・軽減税率8%対応',
  description: '税抜き価格から税込み価格、税込み価格から税抜き価格を計算。消費税10%・軽減税率8%・端数処理（切り捨て/切り上げ/四捨五入）に対応。',
  openGraph: {
    title: '消費税計算 — 税抜/税込・軽減税率8%対応 | tool-nest',
    description: '税抜き価格から税込み価格、税込み価格から税抜き価格を計算。消費税10%・軽減税率8%・端数処理（切り捨て/切り上げ/四捨五入）に対応。',
    url: 'https://tool-nest.pages.dev/tax-calculator',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '消費税計算',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  description: '税抜き価格から税込み価格、税込み価格から税抜き価格を計算。消費税10%・軽減税率8%・端数処理（切り捨て/切り上げ/四捨五入）に対応。',
  url: 'https://tool-nest.pages.dev/tax-calculator',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export type RoundingMode = 'floor' | 'ceil' | 'round'
export type TaxRate = 0.08 | 0.10

function applyRounding(value: number, mode: RoundingMode): number {
  switch (mode) {
    case 'floor': return Math.floor(value)
    case 'ceil':  return Math.ceil(value)
    case 'round': return Math.round(value)
  }
}

// 税抜き → 税込み
export function calcTaxIncluded(
  priceExcl: number,
  rate: TaxRate,
  rounding: RoundingMode,
): { taxAmount: number; priceIncluded: number } {
  const rawTax = priceExcl * rate
  const taxAmount = applyRounding(rawTax, rounding)
  const priceIncluded = priceExcl + taxAmount
  return { taxAmount, priceIncluded }
}

// 税込み → 税抜き
export function calcTaxExcluded(
  priceIncl: number,
  rate: TaxRate,
  rounding: RoundingMode,
): { taxAmount: number; priceExcluded: number } {
  // 浮動小数点誤差を抑えるため整数演算に変換
  // 例: 1100 / 1.10 → (1100 * 100) / 110 = 1000
  const multiplier = rate === 0.10 ? 110 : 108
  const rawExcl = (priceIncl * 100) / multiplier
  const priceExcluded = applyRounding(rawExcl, rounding)
  const taxAmount = priceIncl - priceExcluded
  return { taxAmount, priceExcluded }
}`

export default function TaxCalculatorPage() {
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
          calc / tax
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          消費税計算
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          税抜き価格から税込み価格、税込み価格から税抜き価格を即座に計算します。
          消費税10%・軽減税率8%に対応。端数処理は切り捨て・切り上げ・四捨五入から選択できます。
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
        <TaxCalculatorClient />
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
          <li>「税抜→税込」または「税込→税抜」のタブを選択してください</li>
          <li>税率を「10%（標準）」または「8%（軽減）」から選択してください</li>
          <li>端数処理を「切り捨て」「切り上げ」「四捨五入」から選択してください</li>
          <li>金額を入力するとリアルタイムで消費税額と計算結果が表示されます</li>
          <li>結果横のコピーボタンで数値をクリップボードにコピーできます</li>
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
          外部ライブラリ不要のTypeScriptのみで実装。端数処理を関数に分離することで、各計算関数は純粋関数として保たれます。そのままコピーして利用できます。
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
            title="軽減税率8%の対象品目"
            body="軽減税率（8%）が適用されるのは「飲食料品（酒類・外食を除く）」と「週2回以上発行される新聞（定期購読のもの）」です。コンビニでの食品・飲料の購入は8%ですが、イートインスペースで飲食する場合は標準税率10%になります（軽減税率との選択適用）。"
          />
          <UsageNote
            title="端数処理の選び方"
            body="消費税計算における端数処理のルールは法律で定められておらず、事業者が自由に選択できます。一般的には切り捨て（floor）が多く使われます。国税庁の規定では「1円未満の端数が生じた場合に切り捨て・切り上げ・四捨五入のいずれも認める」とされています。レシートの表示と合わせて選択してください。"
          />
          <UsageNote
            title="税込み価格から税抜き価格を求める計算式"
            body="税込み価格 ÷ (1 + 税率) = 税抜き価格です。例えば税込1,100円（税率10%）の場合、1,100 ÷ 1.1 = 1,000円となります。割り算が生じるため端数が出やすく、端数処理の選択が重要です。"
          />
          <UsageNote
            title="請求書・領収書での消費税の記載"
            body="2023年10月から開始したインボイス制度（適格請求書等保存方式）では、請求書に適用税率と消費税額を明記する必要があります。軽減税率対象の商品とそれ以外が混在する場合は、税率ごとに合計額と消費税額を分けて記載してください。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="Byte単位変換" href="/byte-converter" />
          <RelatedToolBadge label="進数変換" href="/number-base" />
          <RelatedToolBadge label="文字数カウンター" href="/character-count" />
          <RelatedToolBadge label="日時差分計算" href="/date-diff" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/tax-calculator"
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
