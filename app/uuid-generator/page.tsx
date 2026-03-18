import type { Metadata } from 'next'
import UuidGeneratorTool from './_components/UuidGeneratorTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'UUID生成ツール',
  description: 'UUIDv4をブラウザ上で安全に生成します。最大20個まで一括生成・コピーが可能。サーバーに送信されないため安全です。',
  openGraph: {
    title: 'UUID生成ツール | tool-nest',
    description: 'UUIDv4をブラウザで安全に一括生成。大文字/小文字切り替え、個別コピー・全コピー対応。',
    url: 'https://tool-nest.pages.dev/uuid-generator',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'UUID生成ツール',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'UUIDv4をブラウザ上で安全に生成するWebツール。最大20個まで一括生成・コピーが可能。',
  url: 'https://tool-nest.pages.dev/uuid-generator',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const faqLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'UUIDとは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'UUID（Universally Unique Identifier）は、128ビットの識別子で、RFC 4122で標準化されています。分散システムでのID生成に広く使われます。',
      },
    },
    {
      '@type': 'Question',
      name: 'UUID v4の衝突確率はどのくらいですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'UUID v4は122ビットのランダム値で生成されます。10億個生成しても衝突確率は約10の-18乗と極めて低く、実用上は無視できます。',
      },
    },
    {
      '@type': 'Question',
      name: 'このツールで生成したUUIDを安全に使えますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'はい。ブラウザ標準のcrypto.randomUUID()を使用しており、暗号論的に安全な乱数で生成されます。入力データはサーバーに送信されません。',
      },
    },
  ],
})

const coreCode = `// crypto.randomUUID() はすべてのモダンブラウザで利用可能
export function generateUuidV4(): string {
  return crypto.randomUUID()
}

export function generateUuids(count: number): string[] {
  const n = Math.max(1, Math.min(100, count))
  return Array.from({ length: n }, () => generateUuidV4())
}`

export default function UuidGeneratorPage() {
  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      {/* JSON-LD: static structured data, no user input */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLdString }} />

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
          id / uuid
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          UUID生成ツール
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          UUIDv4（Universally Unique Identifier）をブラウザ上で安全に生成します。生成はすべてクライアントサイドで完結し、サーバーには送信されません。
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
        <UuidGeneratorTool />
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
          <li>「生成個数」に1〜20の数値を入力してください（デフォルトは5個）</li>
          <li>「生成」ボタンをクリックすると新しいUUIDv4が生成されます</li>
          <li>各行の「コピー」ボタンで個別コピー、「全てコピー」で改行区切りの一括コピーができます</li>
          <li>「大文字」チェックボックスで大文字/小文字を切り替えられます</li>
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
          コアのロジックはブラウザ標準の{' '}
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>
            crypto.randomUUID()
          </code>
          {' '}だけで実装しています。外部ライブラリは不要なので、そのままコピーしてご利用いただけます。
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
            title="データベースの主キー（Primary Key）"
            body="UUIDv4はランダム性が高く衝突の可能性が極めて低いため、分散システムでのDBレコードIDとして広く使われます。ただし連番と比べてインデックスの断片化が起きやすい点に注意してください。"
          />
          <UsageNote
            title="セッションIDやトークン"
            body="推測困難なランダム文字列が必要なセッションID・APIトークンにも利用されます。crypto.randomUUID()はWeb Crypto APIを使用しており、暗号論的に安全な乱数を生成します。"
          />
          <UsageNote
            title="ファイル名の重複回避"
            body="ユーザーがアップロードしたファイルの保存名にUUIDを使うことで、同名ファイルの上書き衝突を防げます。例: avatar-550e8400-e29b-41d4-a716-446655440000.png"
          />
          <UsageNote
            title="v4以外のUUIDについて"
            body="UUIDにはv1（タイムスタンプ+MACアドレスベース）やv5（名前空間+SHA-1ベース）などもあります。このツールはブラウザAPIで生成できるv4のみに対応しています。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="ハッシュ生成" href="/hash" />
          <RelatedToolBadge label="パスワード生成" href="/password-generator" />
          <RelatedToolBadge label="JSONフォーマッター" href="/json-formatter" />
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
          このツールのソースコード（テストコードを含む）はGitHubで公開しています。MITライセンスで自由に利用・改変できます。
        </p>
        <a
          href="https://github.com/lylgamin/tool-nest/tree/main/app/uuid-generator"
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

function RelatedToolBadge({ label, href, disabled }: { label: string; href: string; disabled?: boolean }) {
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
      }}
    >
      {label}
    </a>
  )
}
