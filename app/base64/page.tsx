import type { Metadata } from 'next'
import Base64Tool from './_components/Base64Tool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'Base64エンコード/デコード',
  description: 'テキストをBase64にエンコード・デコードするWebツール。日本語（UTF-8）対応。URL-safeオプション付き。入力内容はサーバーに送信されません。',
  openGraph: {
    title: 'Base64エンコード/デコード | tool-nest',
    description: 'テキストをBase64にエンコード・デコード。日本語UTF-8対応、URL-safeオプション付き。',
    url: 'https://tool-nest.pages.dev/base64',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Base64エンコード/デコード',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'テキストをBase64にエンコード・デコードするWebツール。日本語（UTF-8）対応。URL-safeモード付き。',
  url: 'https://tool-nest.pages.dev/base64',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `// エンコード: TextEncoder → Uint8Array → binary string → btoa
export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input)
  const binary = String.fromCharCode(...bytes)
  return btoa(binary)
}

// デコード: atob → binary string → Uint8Array → TextDecoder
export type DecodeResult =
  | { ok: true; output: string }
  | { ok: false; error: string }

export function decodeBase64(input: string): DecodeResult {
  try {
    const binary = atob(input)
    const bytes = new Uint8Array([...binary].map(c => c.charCodeAt(0)))
    const output = new TextDecoder().decode(bytes)
    return { ok: true, output }
  } catch {
    return { ok: false, error: '無効なBase64文字列です。' }
  }
}

// URL-safe: + → -、/ → _、パディング除去
export function encodeBase64UrlSafe(input: string): string {
  return encodeBase64(input)
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_')
    .replace(/=+$/, '')
}`

export default function Base64Page() {
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
          encoding / binary
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          Base64 エンコード / デコード
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          テキストをBase64形式にエンコード・デコードします。日本語（UTF-8）に対応し、URL-safeモードも選択できます。
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
        <Base64Tool />
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
          <li>「エンコード」または「デコード」タブを選択してください</li>
          <li>テキストエリアに入力すると、リアルタイムで変換結果が表示されます</li>
          <li>エンコード時は「URL-safe」オプションで <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>+→-、/→_</code> の変換とパディング除去が行われます</li>
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
          ブラウザ標準の <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>TextEncoder</code> /
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}> TextDecoder</code> と
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}> btoa</code> /
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}> atob</code> のみで実装。外部ライブラリ不要でそのままコピーして利用できます。
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
            title="JWT（JSON Web Token）の構造確認"
            body="JWTはヘッダー・ペイロード・署名の3パートをBase64 URL-safe形式で表現しています。「.」で分割した各パートをデコードタブに貼り付けると内容を確認できます。署名の検証はできませんが、ペイロードの確認に便利です。"
          />
          <UsageNote
            title="APIキーや設定値のエンコード"
            body="HTTP Basic認証では「username:password」をBase64エンコードしてAuthorizationヘッダーに付与します。エンコードは暗号化ではないため、機密情報をBase64エンコードしても安全性は向上しません。"
          />
          <UsageNote
            title="バイナリデータのテキスト転送"
            body="メール（MIME）や画像のData URL（data:image/png;base64,...）など、バイナリデータをテキストベースのプロトコルで転送する際にBase64が使われます。エンコードすると元のデータより約33%サイズが増加します。"
          />
          <UsageNote
            title="日本語を含む文字列のエンコード"
            body="ブラウザ標準の btoa() はASCIIのみ対応のため、日本語をそのまま渡すとエラーになります。このツールではTextEncoderでUTF-8バイト列に変換してからbtoaを呼ぶことで日本語にも対応しています。"
          />
          <UsageNote
            title="URL-safeとの使い分け"
            body="標準Base64の「+」「/」はURLのクエリパラメータ内で特殊な意味を持ちます。URLやCookie値にBase64を埋め込む場合は「+→-、/→_」に変換したURL-safe形式を使用してください。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="URLエンコード" href="/url-encode" disabled />
          <RelatedToolBadge label="JSONフォーマッター" href="/json-formatter" />
          <RelatedToolBadge label="文字数カウンター" href="/character-count" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/base64"
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
        display: 'inline-block',
      }}
    >
      {label}
    </a>
  )
}
