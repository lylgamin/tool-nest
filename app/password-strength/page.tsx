import type { Metadata } from 'next'
import PasswordStrengthTool from './_components/PasswordStrengthTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'パスワード強度チェック — エントロピーで強度を評価',
  description: 'パスワードのエントロピー（ビット数）と強度を即座に評価。文字集合サイズ・解読時間の目安・改善提案をリアルタイム表示。入力内容はサーバーに送信されません。',
  openGraph: {
    title: 'パスワード強度チェック | tool-nest',
    description: 'エントロピー（ビット数）でパスワードの強度を評価。文字集合・解読時間・改善提案をリアルタイム表示。',
    url: 'https://tool-nest.pages.dev/password-strength',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'パスワード強度チェック',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'パスワードのエントロピーと強度をブラウザ内で評価するWebツール。入力内容はサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/password-strength',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export type StrengthLevel = 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong'

// 文字集合サイズを計算
function calcCharsetSize(
  hasLower: boolean,
  hasUpper: boolean,
  hasDigit: boolean,
  hasSymbol: boolean,
  hasJapanese: boolean,
): number {
  let size = 0
  if (hasLower)    size += 26
  if (hasUpper)    size += 26
  if (hasDigit)    size += 10
  if (hasSymbol)   size += 32
  if (hasJapanese) size += 4000
  return size
}

// エントロピー = log2(文字集合サイズ) × 文字数
export function analyzePassword(password: string) {
  let hasLower = false, hasUpper = false
  let hasDigit = false, hasSymbol = false, hasJapanese = false

  for (const ch of password) {
    if (/[a-z]/.test(ch))      hasLower    = true
    else if (/[A-Z]/.test(ch)) hasUpper    = true
    else if (/[0-9]/.test(ch)) hasDigit    = true
    else if (isJapanese(ch))   hasJapanese = true
    else                       hasSymbol   = true
  }

  const charsetSize = calcCharsetSize(
    hasLower, hasUpper, hasDigit, hasSymbol, hasJapanese
  )
  const entropy = charsetSize > 0
    ? Math.log2(charsetSize) * password.length
    : 0

  return { entropy, charsetSize, /* ... */ }
}`

export default function PasswordStrengthPage() {
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
          security / password
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          パスワード強度チェック
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          パスワードのエントロピー（ビット数）と強度をリアルタイムで評価します。
          文字集合サイズ・解読時間の目安・改善提案を即座に表示。
          入力内容はすべてブラウザ内で処理され、サーバーには送信されません。
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
        <PasswordStrengthTool />
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
          <li>入力フィールドにチェックしたいパスワードを入力します</li>
          <li>強度バーとラベル（非常に弱い〜非常に強い）がリアルタイムで更新されます</li>
          <li>エントロピー・文字集合サイズ・解読時間の目安が即座に表示されます</li>
          <li>チェックリストで不足している要素を確認し、改善提案を参考に強化してください</li>
          <li>「表示/非表示」ボタンで入力文字を確認できます。「コピー」で入力内容をコピーできます</li>
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
          エントロピーは{' '}
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>
            log2(文字集合サイズ) × 文字数
          </code>
          {' '}で計算します。外部ライブラリは一切不要で、標準のJavaScript APIのみで実装しています。
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
            title="エントロピーとは"
            body="エントロピーはパスワードの予測困難さをビット数で表した指標です。エントロピー = log2(文字集合サイズ) × 文字数 で計算されます。例えば小文字のみ8文字なら log2(26) × 8 ≈ 37.6 bit、大文字+小文字+数字+記号の12文字なら log2(94) × 12 ≈ 78.8 bit となります。1秒間に100億回試行できるコンピュータでも、80bit以上のパスワードを解読するには数百年以上かかります。"
          />
          <UsageNote
            title="NIST基準について"
            body="米国国立標準技術研究所（NIST SP 800-63B）は「複雑さより長さを重視する」方針を示しています。記号を無理に含めるよりも、十分な長さ（最低8文字、推奨12文字以上）のパスワードが有効です。また、よく使われるパスワード（password123、qwerty など）は文字種が多くても実質的なエントロピーが低いため避けるべきです。このツールは文字種と長さのみを基準に評価しますが、辞書攻撃への耐性は別途考慮してください。"
          />
          <UsageNote
            title="強いパスワードの条件"
            body="強いパスワードの目安：(1) 12文字以上、(2) 大文字・小文字・数字・記号を含む、(3) 辞書に載っている単語をそのまま使わない、(4) サービスごとに異なるパスワードを使う。エントロピーが60bit以上（強い）であれば、一般的なオンラインサービスには十分な強度です。機密性の高い用途には80bit以上（非常に強い）を推奨します。"
          />
          <UsageNote
            title="日本語パスワードのエントロピー"
            body="ひらがな・カタカナ・漢字を含む場合、文字集合サイズに約4000が加算されます。日本語は1文字あたりのエントロピーが log2(4000) ≈ 11.97 bit と高く、「あいうえお」（5文字）だけで約59.9 bit に達します。ただし、多くのWebサービスは日本語パスワードに対応していないため、実用上は英数記号の組み合わせを推奨します。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="パスワード生成" href="/password-generator" />
          <RelatedToolBadge label="ハッシュ生成" href="/hash" />
          <RelatedToolBadge label="UUID生成" href="/uuid-generator" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/password-strength"
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
