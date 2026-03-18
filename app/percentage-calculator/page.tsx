import type { Metadata } from 'next'
import PercentageCalculatorClient from './_components/PercentageCalculatorClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: '割合・パーセント計算',
  description: '割合計算・増減率計算・逆算など4パターンに対応した無料の電卓ツール。消費増税・割引率・達成率など業務でよく使う計算を手軽に。',
  openGraph: {
    title: '割合・パーセント計算 | tool-nest',
    description: '割合計算・増減率計算・逆算など4パターンに対応した無料の電卓ツール。消費増税・割引率・達成率など業務でよく使う計算を手軽に。',
    url: 'https://tool-nest.pages.dev/percentage-calculator',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '割合・パーセント計算',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  description: '割合計算・増減率計算・逆算など4パターンに対応した無料の電卓ツール。消費増税・割引率・達成率など業務でよく使う計算を手軽に。',
  url: 'https://tool-nest.pages.dev/percentage-calculator',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `/** A: value は total の何 % か */
export function calcWhatPercent(value: number, total: number): number | null {
  if (!isFinite(value) || !isFinite(total)) return null
  if (total === 0) return null
  const result = (value / total) * 100
  return isFinite(result) ? result : null
}

/** B: total の n% はいくつか */
export function calcPercentOf(percent: number, total: number): number | null {
  if (!isFinite(percent) || !isFinite(total)) return null
  const result = (percent / 100) * total
  return isFinite(result) ? result : null
}

/** C: from から to への増減率（%） */
export function calcPercentChange(from: number, to: number): number | null {
  if (!isFinite(from) || !isFinite(to)) return null
  if (from === 0) return null
  const result = ((to - from) / Math.abs(from)) * 100
  return isFinite(result) ? result : null
}

/** D: value が n% のとき、全体はいくつか（逆算） */
export function calcTotal(value: number, percent: number): number | null {
  if (!isFinite(value) || !isFinite(percent)) return null
  if (percent === 0) return null
  const result = (value / percent) * 100
  return isFinite(result) ? result : null
}`

export default function PercentageCalculatorPage() {
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
          calc / percentage
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          割合・パーセント計算
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          割合計算・増減率・逆算など4パターンに対応した電卓ツール。
          消費増税・割引率・達成率など業務でよく使うパーセント計算を手軽に行えます。
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
        <PercentageCalculatorClient />
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
          <li>上部タブから計算パターンを選択してください（何%か・n%はいくつか・増減率・全体を逆算）</li>
          <li>各フィールドに数値を入力すると即座に結果が表示されます</li>
          <li>結果の横の「コピー」ボタンで数値をクリップボードにコピーできます</li>
          <li>増減率タブでは減少時は赤色、増加時は緑色で表示されます</li>
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
          外部ライブラリ不要のTypeScriptのみで実装。各計算パターンを純粋関数として定義し、
          ゼロ除算・NaN・Infinityを考慮してエラー時は <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px' }}>null</code> を返します。そのままコピーして利用できます。
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
            title="消費増税の計算（税込み価格）"
            body="税抜き価格に10%を加算する場合は「B: n%はいくつか」で税額を求め、元の価格に加算します。例えば1,000円の商品の消費税は「1000 の 10% = 100円」。税込みは1,100円になります。"
          />
          <UsageNote
            title="達成率・進捗率の確認"
            body="目標100件のうち75件達成した場合の達成率は「A: 何%か」で「75 ÷ 100 × 100 = 75%」となります。KPIの進捗確認、売上目標達成率など業務でよく使うパターンです。"
          />
          <UsageNote
            title="前月比・前年比の増減率"
            body="「C: 増減率」タブを使うと前月や前年との比較が一発で計算できます。例えば先月100万円・今月120万円の売上なら「100 → 120 = +20%」。マイナスの場合は赤色で表示されます。"
          />
          <UsageNote
            title="割引後の元値を逆算"
            body="「D: 全体を逆算」は「この金額は何%割引後の価格か？」という場合に便利です。例えば税込み表示価格から税抜き価格を求めたい場合、110円が110%なら全体（税抜き）は100円と計算できます。"
          />
          <UsageNote
            title="浮動小数点誤差について"
            body="ブラウザのJavaScriptはIEEE 754 倍精度浮動小数点を使用するため、0.1 + 0.2 = 0.30000000000000004 のような誤差が発生することがあります。このツールでは toPrecision(10) で丸めて表示しているため実用上問題ない精度で計算できます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="Byte単位変換" href="/byte-converter" />
          <RelatedToolBadge label="進数変換" href="/number-base" />
          <RelatedToolBadge label="日時差分計算" href="/date-diff" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/percentage-calculator"
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
