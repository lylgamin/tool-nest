import type { Metadata } from 'next'
import JwtDecoderClient from './_components/JwtDecoderClient'

export const metadata: Metadata = {
  title: 'JWTデコーダー',
  description: 'JWT（JSON Web Token）のヘッダー・ペイロードをデコードして表示するWebツール。署名検証なし。入力内容はサーバーに送信されません。',
  openGraph: {
    title: 'JWTデコーダー | tool-nest',
    description: 'JWT（JSON Web Token）のヘッダー・ペイロードをデコードして表示。署名検証なし。入力内容はブラウザ内で処理されます。',
    url: 'https://tool-nest.pages.dev/jwt-decoder',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JWTデコーダー',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'JWT（JSON Web Token）のヘッダー・ペイロードをデコードして表示するWebツール。署名検証なし。',
  url: 'https://tool-nest.pages.dev/jwt-decoder',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `// Base64URLデコード（JWT用）
function base64UrlDecode(str) {
  const padded = str + '=='.slice(0, (4 - str.length % 4) % 4);
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64);
}

// JWTをデコード（署名検証なし、クライアントサイドのみ）
export function decodeJwt(token) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');
  const header = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));
  return { header, payload, signature: parts[2] };
}`

export default function JwtDecoderPage() {
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
          security / jwt
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          JWT デコーダー
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          JWT（JSON Web Token）のヘッダーとペイロードをデコードして表示します。署名の検証は行いません。入力内容はすべてブラウザ内で処理されます。
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
        <JwtDecoderClient />
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
          <li>JWTトークンをテキストエリアに貼り付けてください</li>
          <li>「サンプル挿入」ボタンで動作確認用のサンプルJWTを挿入できます</li>
          <li>入力内容がリアルタイムでデコードされ、ヘッダー・ペイロード・署名が表示されます</li>
          <li><code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>exp</code> クレームが含まれる場合、有効期限が日本時間で表示されます</li>
          <li>「結果をコピー」ボタンでデコード結果をJSON形式でクリップボードにコピーできます</li>
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
          ブラウザ標準の <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>atob()</code> のみで実装。外部ライブラリ不要でそのままコピーして利用できます。
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
            title="署名検証は行いません"
            body="このツールはJWTのヘッダーとペイロードをBase64URLデコードして表示するだけです。署名（第3パート）の検証は行わないため、トークンが改ざんされていても検出できません。本番環境では必ずサーバーサイドで署名検証を行ってください。"
          />
          <UsageNote
            title="expクレームはUnix時間（秒）"
            body="JWTのexpクレームはUnix時間（1970年1月1日からの秒数）で表されます。このツールでは自動的に日本時間（Asia/Tokyo）に変換して表示します。ミリ秒ではなく秒であることに注意してください。"
          />
          <UsageNote
            title="JWTに機密情報を含めないこと"
            body="JWTのペイロードはBase64URLエンコードされているだけで暗号化されていません。このツールのように誰でも簡単にデコードできます。パスワードやクレジットカード番号などの機密情報はJWTに含めないでください。"
          />
          <UsageNote
            title="HS256 vs RS256 アルゴリズムの違い"
            body="HS256（HMAC-SHA256）は共通鍵方式で、署名と検証に同じ秘密鍵を使います。シンプルですが鍵の共有が必要です。RS256（RSA-SHA256）は公開鍵方式で、秘密鍵で署名し公開鍵で検証します。マイクロサービスや外部連携では公開鍵を配布できるRS256が安全です。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="Base64変換" href="/base64" />
          <RelatedToolBadge label="ハッシュ生成" href="/hash" />
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
          このツールのソースコード（テストコードを含む）はGitHubで公開しています。MITライセンスで自由に利用・改変できます。
        </p>
        <a
          href="https://github.com/lylgamin/tool-nest/tree/main/app/jwt-decoder"
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
