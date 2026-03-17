import type { Metadata } from 'next'
import CamelCaseClient from './_components/CamelCaseClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'キャメルケース / パスカルケース変換',
  description: 'snake_case・kebab-case・スペース区切りなどの文字列をcamelCase・PascalCase（UpperCamelCase）に変換するWebツール。入力内容はサーバーに送信されません。',
  openGraph: {
    title: 'キャメルケース / パスカルケース変換 | tool-nest',
    description: 'snake_case・kebab-caseをcamelCase・PascalCaseに変換。ブラウザ上で即時変換。',
    url: 'https://tool-nest.pages.dev/camel-case',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'キャメルケース / パスカルケース変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'snake_case・kebab-case・スペース区切りなどをcamelCase・PascalCaseに変換するツール。',
  url: 'https://tool-nest.pages.dev/camel-case',
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

export function toCamelCase(input: string): string {
  const tokens = tokenize(input)
  if (tokens.length === 0) return ''
  return (
    tokens[0] +
    tokens.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
  )
}

export function toPascalCase(input: string): string {
  return tokenize(input).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}`

export default function CamelCasePage() {
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
          キャメルケース / パスカルケース 変換
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>snake_case</code>・
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>kebab-case</code>・
          スペース区切りなど、あらゆる表記から
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>camelCase</code> /
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>PascalCase</code> に変換します。
        </p>
      </div>

      {/* ツール本体 */}
      <section style={{ marginBottom: '3rem' }}>
        <CamelCaseClient />
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
          <li>「camelCase」または「PascalCase」タブを選択してください</li>
          <li>テキストエリアに変換したい文字列を入力すると、リアルタイムで結果が表示されます</li>
          <li>
            入力は <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>_</code>・
            <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>-</code>・
            スペース・ドット・大文字の境界で自動的に分割されます
          </li>
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
          コアは <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>tokenize()</code> 関数。
          正規表現で camelCase / PascalCase の境界を検出してから区切り文字で分割し、単語の配列を作ります。
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
            title="JavaScript / TypeScript の変数・関数名"
            body="JavaScript / TypeScript では変数名・関数名に camelCase が慣例です（例: getUserName, fetchApiData）。snake_case のDBカラム名やAPI レスポンスキーを変換するときに使えます。"
          />
          <UsageNote
            title="クラス名・型名には PascalCase"
            body="TypeScript のクラス・インターフェース・型エイリアスは PascalCase が標準（例: UserProfile, ApiResponse）。React コンポーネント名も PascalCase が必須です。"
          />
          <UsageNote
            title="略語（Acronym）の扱い"
            body="HTMLParser のような連続大文字は HTML + Parser と分割されます。変換結果は htmlParser（camel）/ HtmlParser（pascal）になります。略語を大文字のまま保持する場合は手動調整が必要です。"
          />
          <UsageNote
            title="数字を含む識別子"
            body="数字は小文字と同様に扱われます。例えば「base64 encode」は base64Encode（camel）/ Base64Encode（pascal）になります。"
          />
          <UsageNote
            title="複数行入力は1行ずつ変換"
            body="改行を含む入力は1行全体を1つの識別子として処理します。複数の識別子を変換したい場合は1行ずつ貼り付けてください。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="ケバブ・スネークケース変換" href="/kebab-case" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/camel-case"
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
