import type { Metadata } from 'next'
import KebabCaseClient from './_components/KebabCaseClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'ケバブケース / スネークケース変換',
  description: 'camelCase・PascalCase・スペース区切りなどの文字列をkebab-case・snake_caseに変換するWebツール。入力内容はサーバーに送信されません。',
  openGraph: {
    title: 'ケバブケース / スネークケース変換 | tool-nest',
    description: 'camelCase・PascalCaseをkebab-case・snake_caseに変換。ブラウザ上で即時変換。',
    url: 'https://tool-nest.pages.dev/kebab-case',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ケバブケース / スネークケース変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'camelCase・PascalCase・スペース区切りなどをkebab-case・snake_caseに変換するツール。',
  url: 'https://tool-nest.pages.dev/kebab-case',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `// 入力を単語トークン配列に分解（複数記法に対応）
function tokenize(input: string): string[] {
  return input
    .replace(/([a-z\\d])([A-Z])/g, '$1 $2')    // camelCase 分割
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // HTMLParser → HTML Parser
    .split(/[\\s\\-_.]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase())
}

export function toKebabCase(input: string): string {
  return tokenize(input).join('-')
}

export function toSnakeCase(input: string): string {
  return tokenize(input).join('_')
}`

export default function KebabCasePage() {
  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
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
          text / case
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          ケバブケース / スネークケース 変換
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>camelCase</code>・
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>PascalCase</code>・
          スペース区切りなど、あらゆる表記から
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>kebab-case</code> /
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>snake_case</code> に変換します。
        </p>
      </div>

      {/* ツール本体 */}
      <section style={{ marginBottom: '3rem' }}>
        <KebabCaseClient />
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
          <li>「kebab-case」または「snake_case」タブを選択してください</li>
          <li>テキストエリアに変換したい文字列を入力すると、リアルタイムで結果が表示されます</li>
          <li>
            入力は <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>_</code>・
            <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>-</code>・
            スペース・ドット・大文字の境界で自動的に分割されます
          </li>
          <li>すべて小文字に統一してから区切り文字で結合します</li>
          <li>「コピー」ボタンで変換結果をクリップボードにコピーできます</li>
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
          コアの <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>tokenize()</code> 関数で単語に分解してから
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>join()</code> で結合するだけ。
          外部ライブラリ不要でそのままコピーして利用できます。
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
            title="CSS クラス名・HTML 属性には kebab-case"
            body="CSS のプロパティ名（background-color, font-size）や HTML の data 属性（data-user-id）は kebab-case が標準です。JavaScript の camelCase な変数名を CSS クラス名に変換するときに使えます。"
          />
          <UsageNote
            title="Python・Ruby・DB カラム名には snake_case"
            body="Python の変数・関数名（get_user_name）、Ruby の変数名、SQL のカラム名（user_id, created_at）は snake_case が慣例です。TypeScript のキャメルケース識別子を変換するときに便利です。"
          />
          <UsageNote
            title="URL スラッグ・ファイル名には kebab-case"
            body="Web の URL パス（/my-page-title）やブログ記事のスラッグ、CSS ファイル名（button-primary.css）には kebab-case が広く使われます。SEO の観点でも単語を - で区切ることが推奨されます。"
          />
          <UsageNote
            title="環境変数・定数には SCREAMING_SNAKE_CASE"
            body="このツールは小文字の snake_case に変換します。環境変数のような大文字定数（MAX_RETRY_COUNT）が必要な場合は、出力結果を手動で大文字に変換してください。"
          />
          <UsageNote
            title="略語（Acronym）の扱い"
            body="HTMLParser のような連続大文字は html + parser と分割されます。変換結果は html-parser（kebab）/ html_parser（snake）になります。略語部分の大文字を維持することは現在の実装では対応していません。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="キャメル・パスカルケース変換" href="/camel-case" />
          <RelatedToolBadge label="全角・半角変換" href="/zenkaku-hankaku" />
          <RelatedToolBadge label="文字数カウンター" href="/character-count" />
          <RelatedToolBadge label="URLエンコード" href="/url-encode" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/kebab-case"
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
