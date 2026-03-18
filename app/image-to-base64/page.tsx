import type { Metadata } from 'next'
import ImageToBase64Tool from './_components/ImageToBase64Tool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: '画像 → Base64変換 — ドラッグ＆ドロップで即変換',
  description: '画像ファイルをBase64エンコードし、Data URI形式またはBase64文字列として取得できるWebツール。PNG・JPEG・WebP・SVGなど主要形式対応。ブラウザ内完結でサーバー送信なし。',
  openGraph: {
    title: '画像 → Base64変換 | tool-nest',
    description: '画像をドラッグ＆ドロップしてBase64に変換。Data URI形式もBase64のみも取得可能。ブラウザ内完結。',
    url: 'https://tool-nest.pages.dev/image-to-base64',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '画像 → Base64変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '画像ファイルをBase64エンコードし、Data URI形式またはBase64文字列として取得できるWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/image-to-base64',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreLogicCode = `/** Data URI形式にフォーマットする */
export function formatDataUri(mimeType: string, base64Data: string): string {
  return \`data:\${mimeType};base64,\${base64Data}\`
}

/** Base64文字列から元のサイズを推定する（KB単位） */
export function estimateSizeKb(base64: string): number {
  // Base64は元データの約4/3倍のサイズ
  return Math.round((base64.length * 3) / 4 / 1024 * 10) / 10
}

/** Data URIからMIMEタイプとBase64を分離する */
export function extractBase64FromDataUri(
  dataUri: string
): { mimeType: string; base64: string } | null {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) return null
  return { mimeType: match[1], base64: match[2] }
}

// FileReader APIで画像をData URIに変換する
function readImageAsDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('読み込み失敗'))
    reader.readAsDataURL(file)
  })
}`

export default function ImageToBase64Page() {
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
          encode / image
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          画像 → Base64変換
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          画像ファイルをBase64エンコードし、Data URI形式またはBase64文字列として取得できます。
          PNG・JPEG・WebP・GIF・SVG・BMPに対応。入力データはサーバーに送信されません。
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
        <ImageToBase64Tool />
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
          <li>ドロップゾーンに画像ファイルをドラッグ＆ドロップするか、クリックしてファイルを選択します</li>
          <li>ファイル情報（ファイル名・サイズ・MIMEタイプ・Base64後の推定サイズ）とプレビューが表示されます</li>
          <li>出力形式を選択します：Data URI形式（HTMLのsrc属性に直接貼り付け可能）またはBase64のみ</li>
          <li>「コピー」ボタンで出力結果をクリップボードにコピーします</li>
          <li>「クリア」ボタンでリセットして別の画像を変換できます</li>
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
          ブラウザ標準の <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px' }}>FileReader</code> APIを使って画像をBase64に変換しています。
          外部ライブラリは一切不要で、そのままコピーしてご利用いただけます。
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
            title="HTMLのimgタグに直接埋め込む"
            body="Data URI形式をコピーして img src 属性に直接貼り付けると、外部ファイルなしで画像を埋め込めます。メールHTMLやSVGへのインライン画像埋め込みにも使えます。"
          />
          <UsageNote
            title="CSSの背景画像に使う"
            body="background-image: url('data:image/png;base64,...') の形式でCSSに埋め込めます。小さなアイコンやパターン画像をHTTPリクエストなしで使いたい場合に便利です。"
          />
          <UsageNote
            title="APIへの画像送信"
            body="画像をBase64に変換してJSON本文に含めることで、マルチパートフォームデータを使わずにREST APIへ画像データを送信できます。特にAIサービス（Vision API等）との連携でよく使われるパターンです。"
          />
          <UsageNote
            title="ファイルサイズに注意"
            body="Base64エンコードすると元の画像より約33%サイズが増加します（3バイト→4文字の変換のため）。大きな画像をData URIとしてHTMLやCSSに埋め込むと、ページの初期ロードが遅くなる場合があります。100KB以上の画像は通常の外部ファイルとして配信することを推奨します。"
          />
          <UsageNote
            title="プライバシーについて"
            body="選択した画像はブラウザ内のみで処理されます。サーバーには一切送信されないため、機密性の高い画像も安全に変換できます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/base64" label="Base64エンコード/デコード" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/image-to-base64"
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
        cursor: 'pointer',
      }}
    >
      {label}
    </a>
  )
}
