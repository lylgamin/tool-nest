import type { Metadata } from 'next'
import CspGeneratorTool from './_components/CspGeneratorTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'CSPヘッダー生成ツール — Content-Security-Policy を GUI で作成',
  description: 'Content-Security-Policy ヘッダーをGUIで簡単に生成。各ディレクティブのON/OFF切り替え・プリセット値入力・既存CSPのインポートに対応。ブラウザのみで動作。',
  openGraph: {
    title: 'CSPヘッダー生成ツール | tool-nest',
    description: 'Content-Security-Policy ヘッダーをGUIで生成。ディレクティブをトグルして値を設定するだけ。',
    url: 'https://tool-nest.pages.dev/csp-generator',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CSPヘッダー生成ツール',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'Content-Security-Policy ヘッダーをGUIで生成するWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/csp-generator',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreLogicCode = `export function buildCspHeader(config: Record<string, string[]>): string {
  return Object.entries(config)
    .filter(([, values]) => values.length > 0)
    .map(([directive, values]) => \`\${directive} \${values.join(' ')}\`)
    .join('; ')
}

export function parseCspHeader(header: string): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  const directives = header.split(';').map(d => d.trim()).filter(Boolean)
  for (const directive of directives) {
    const parts = directive.split(/\\s+/)
    const name = parts[0].toLowerCase()
    const values = parts.slice(1)
    result[name] = values
  }
  return result
}`

export default function CspGeneratorPage() {
  return (
    <main style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
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
          generate / security
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          CSPヘッダー生成ツール
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          Content-Security-Policy ヘッダーを GUI で簡単に生成します。
          各ディレクティブをON/OFFで切り替え、値を設定するだけでCSP文字列が完成します。
          入力データはサーバーに送信されません。
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
        <CspGeneratorTool />
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
          <li>各ディレクティブ左端のトグルで有効・無効を切り替えます</li>
          <li>テキスト入力欄にスペース区切りで許可するオリジンや値を入力します</li>
          <li>よく使う値はプリセットボタンをクリックすると自動追加されます</li>
          <li>生成されたCSPヘッダー文字列を「クリップボードにコピー」で取得します</li>
          <li>既存のCSPヘッダーを「インポート」欄に貼り付けると設定を取り込めます</li>
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
          コアロジックはCSP文字列のビルドとパースのみ。セミコロン区切りで各ディレクティブを結合・分解します。
          外部ライブラリ不要でそのままコピーしてご利用いただけます。
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
          <code>{coreLogicCode}</code>
        </pre>
      </section>

      {/* よくある使用例・注意点 */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="よくある使用例・注意点" count="03" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <UsageNote
            title="最小構成から始める"
            body="まず <code style='font-family:var(--font-jetbrains),monospace;font-size:12px;background:rgba(31,107,114,0.1);padding:1px 5px;border-radius:3px'>default-src 'self'</code> だけを有効にし、エラーを見ながら必要なディレクティブを追加していくのが安全です。最初から広い許可を与えると CSP の効果が薄れます。"
          />
          <UsageNote
            title="'unsafe-inline' と 'unsafe-eval' の注意"
            body="<code style='font-family:var(--font-jetbrains),monospace;font-size:12px;background:rgba(31,107,114,0.1);padding:1px 5px;border-radius:3px'>'unsafe-inline'</code> はインラインスクリプト・スタイルを許可し、XSS対策を弱めます。代わりに <code style='font-family:var(--font-jetbrains),monospace;font-size:12px;background:rgba(31,107,114,0.1);padding:1px 5px;border-radius:3px'>nonce-xxx</code> や <code style='font-family:var(--font-jetbrains),monospace;font-size:12px;background:rgba(31,107,114,0.1);padding:1px 5px;border-radius:3px'>sha256-xxx</code> ハッシュを使いましょう。"
          />
          <UsageNote
            title="Nginx / Apache での設定例"
            body="Nginxでは <code style='font-family:var(--font-jetbrains),monospace;font-size:12px;background:rgba(31,107,114,0.1);padding:1px 5px;border-radius:3px'>add_header Content-Security-Policy &quot;生成した値&quot; always;</code> を server ブロックに追加します。Apache は <code style='font-family:var(--font-jetbrains),monospace;font-size:12px;background:rgba(31,107,114,0.1);padding:1px 5px;border-radius:3px'>Header always set Content-Security-Policy &quot;値&quot;</code> を使います。"
          />
          <UsageNote
            title="report-uri / report-to での違反収集"
            body="本番適用前に <code style='font-family:var(--font-jetbrains),monospace;font-size:12px;background:rgba(31,107,114,0.1);padding:1px 5px;border-radius:3px'>Content-Security-Policy-Report-Only</code> ヘッダーでテストするのが推奨です。違反レポートを収集してから本番の CSP を固めましょう。"
          />
          <UsageNote
            title="プライバシーについて"
            body="入力した値はブラウザ内のみで処理されます。サーバーには一切送信されないため、内部ドメイン名を含む CSP 設定も安全に作成できます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/html-escape" label="HTMLエスケープ" />
          <RelatedToolBadge href="/hash" label="ハッシュ生成" />
          <RelatedToolBadge href="/url-encode" label="URLエンコード/デコード" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/csp-generator"
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
      <div
        style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--ink-mid)',
          lineHeight: 1.7,
        }}
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  )
}

function RelatedToolBadge({
  label,
  href,
  disabled,
}: {
  label: string
  href: string
  disabled?: boolean
}) {
  if (disabled) {
    return (
      <span style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '11px',
        letterSpacing: '0.05em',
        color: 'var(--ink-faint)',
        border: '1px solid var(--border-light)',
        borderRadius: '3px',
        padding: '5px 10px',
        cursor: 'default',
      }}>
        {label} — 準備中
      </span>
    )
  }
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
        cursor: 'pointer',
      }}
    >
      {label}
    </a>
  )
}
