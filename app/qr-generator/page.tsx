import type { Metadata } from 'next'
import QrGeneratorTool from './_components/QrGeneratorTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'QRコード生成',
  description: 'テキスト・URLからQRコードを生成するWebツール。SVG・PNG形式でダウンロード可能。入力データはサーバーに送信されません。',
  openGraph: {
    title: 'QRコード生成 | tool-nest',
    description: 'テキスト・URLからQRコードを即時生成。SVG・PNG形式でダウンロード可能。ブラウザ内で完結。',
    url: 'https://tool-nest.pages.dev/qr-generator',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'QRコード生成',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'テキスト・URLからQRコードを生成するWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/qr-generator',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `import QRCode from 'qrcode'
// ※ qrcode パッケージは外部ライブラリ禁止ルールの例外
//   自前実装が非現実的なQRコード生成に限り許容

export type QrResult = { ok: true; svg: string } | { ok: false; error: string }

export async function generateQrSvg(
  text: string,
  size: number = 300
): Promise<QrResult> {
  if (!text.trim()) return { ok: false, error: '入力が空です' }
  try {
    const svg = await QRCode.toString(text, {
      type: 'svg',
      width: size,
      margin: 2,
      color: { dark: '#19161a', light: '#faf8f4' },
    })
    return { ok: true, svg }
  } catch (e) {
    return { ok: false, error: \`QRコードの生成に失敗しました: \${String(e)}\` }
  }
}

export function validateQrInput(text: string): string | null {
  if (!text.trim()) return '入力が空です'
  if (text.length > 2953)
    return \`入力が長すぎます（最大2953バイト、現在: \${new TextEncoder().encode(text).length}バイト）\`
  return null
}`

export default function QrGeneratorPage() {
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
          encode / generate
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          QRコード生成
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          テキスト・URLからQRコードを生成します。SVG・PNG形式でダウンロード可能。入力データはサーバーに送信されません。
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
        <QrGeneratorTool />
      </section>

      <AdUnit />

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
          <li>テキストエリアにQRコード化したいテキストまたはURLを入力してください</li>
          <li>出力サイズ（200px・300px・400px）を選択します</li>
          <li>「生成」ボタン（またはCtrl+Enter）でQRコードを生成します</li>
          <li>表示されたQRコードをSVGまたはPNG形式でダウンロードできます</li>
          <li>スマートフォンのカメラでそのままスキャンして動作確認できます</li>
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
          QRコード生成には{' '}
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>qrcode</code>
          {' '}パッケージを使用しています。このツールは「外部ライブラリ禁止」ルールの例外で、QRコードのアルゴリズム（リード・ソロモン符号等）は自前実装が非現実的なため許容しています。
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
            title="QRコードの容量制限"
            body="QRコードに格納できるデータ量には上限があります。英数字のみの場合は最大4296文字、バイナリ（UTF-8等）では最大2953バイトです。日本語1文字は3バイトなので、約984文字が上限の目安になります。"
          />
          <UsageNote
            title="URLはなるべく短くする"
            body="長いURLをQRコードにすると、コードが複雑になりスキャン精度が下がります。URLが長い場合は bit.ly や t.co などのURL短縮サービスを使うか、リダイレクト用の短いURLを用意することを推奨します。"
          />
          <UsageNote
            title="誤り訂正レベルについて"
            body="QRコードには誤り訂正機能があり、コードの一部が汚れたり欠けても読み取れます。このツールはデフォルト（レベルM：15%まで復元可能）を使用します。ロゴを重ねたい場合はレベルH（30%）の使用を検討してください。"
          />
          <UsageNote
            title="SVG vs PNG の使い分け"
            body="SVGは拡大しても劣化しないベクター形式で、印刷物やWebでの表示に最適です。PNGはラスター形式で、メッセージアプリへの貼り付けや画像として保存したい場合に向いています。ダウンロード時は用途に合わせて選択してください。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/url-encode" label="URLエンコード" />
          <RelatedToolBadge href="/base64" label="Base64変換" />
          <RelatedToolBadge href="/hash" label="ハッシュ生成" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/qr-generator"
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
