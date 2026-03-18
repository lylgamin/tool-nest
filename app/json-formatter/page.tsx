import type { Metadata } from 'next'
import JsonFormatterTool from './_components/JsonFormatterTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'JSONフォーマッター',
  description: 'JSONを整形・圧縮・バリデーションできるWebツール。入力内容はサーバーに送信されず、ブラウザ内で完結します。インデント幅（2スペース・4スペース・タブ）を選択可能。',
  openGraph: {
    title: 'JSONフォーマッター | tool-nest',
    description: 'JSONの整形・圧縮・バリデーションをブラウザ内で完結。インデント幅選択対応。',
    url: 'https://tool-nest.pages.dev/json-formatter',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JSONフォーマッター',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'JSONを整形・圧縮・バリデーションするWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/json-formatter',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const faqLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'JSONフォーマッターとは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'JSONフォーマッターは、圧縮されたJSONデータを読みやすい形式に整形するツールです。インデント・改行を追加し、ネスト構造を視覚的に確認できます。構文エラーも検出します。',
      },
    },
    {
      '@type': 'Question',
      name: 'JSONを整形するとデータは変わりますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'いいえ。フォーマット処理は空白文字・改行・インデントを追加するだけで、データの値や構造は一切変わりません。入力したJSONと完全に等価なデータです。',
      },
    },
    {
      '@type': 'Question',
      name: 'このツールに入力したデータはサーバーに送られますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'いいえ。すべての処理はブラウザ内のJavaScriptで完結しており、入力したJSONデータはサーバーに送信されません。機密情報を含むJSONも安心して使用できます。',
      },
    },
  ],
})

const coreCode = `export type FormatResult =
  | { ok: true; output: string }
  | { ok: false; error: string }

export function formatJson(
  input: string,
  indent: number = 2
): FormatResult {
  try {
    const parsed = JSON.parse(input)
    return { ok: true, output: JSON.stringify(parsed, null, indent) }
  } catch (e) {
    const msg = e instanceof SyntaxError ? e.message : String(e)
    return { ok: false, error: \`JSONの解析に失敗しました: \${msg}\` }
  }
}

export function minifyJson(input: string): FormatResult {
  try {
    const parsed = JSON.parse(input)
    return { ok: true, output: JSON.stringify(parsed) }
  } catch (e) {
    const msg = e instanceof SyntaxError ? e.message : String(e)
    return { ok: false, error: \`JSONの解析に失敗しました: \${msg}\` }
  }
}`

export default function JsonFormatterPage() {
  return (
    <main style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
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
          data / json
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          JSONフォーマッター
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          JSONの整形・圧縮・バリデーションをブラウザ内で完結。入力データはサーバーに送信されません。
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
        <JsonFormatterTool />
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
          <li>左側のテキストエリアにJSONをペーストしてください</li>
          <li>インデント幅（2スペース・4スペース・タブ）を選択します</li>
          <li>「整形」ボタンで読みやすく整形、「圧縮」ボタンで1行に圧縮できます</li>
          <li>右側に結果が表示されたら「コピー」ボタンでクリップボードにコピーできます</li>
          <li>入力時にリアルタイムでJSONの有効性を確認できます</li>
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
          コアロジックはブラウザ標準の{' '}
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>JSON.parse</code>
          {' '}と{' '}
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>JSON.stringify</code>
          {' '}のみで実装しています。外部ライブラリは不要なので、そのままコピーしてご利用いただけます。
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
            title="APIレスポンスの確認"
            body="curl や fetch で取得したAPIレスポンスが1行で返ってくる場合、このツールで整形すると構造が一目でわかります。開発・デバッグ時に便利です。"
          />
          <UsageNote
            title="設定ファイルの圧縮"
            body="package.json や tsconfig.json などを圧縮して最小化したい場合は「圧縮」ボタンを使います。ただし、コメントを含むJSONはJSON仕様外のためパースエラーになります。"
          />
          <UsageNote
            title="JSONとJSON5の違い"
            body="標準のJSON（RFC 8259）はキーを必ずダブルクォートで囲む必要があります。シングルクォートやコメント、末尾カンマはJSON仕様外です。このツールはJSON仕様に準拠して検証します。"
          />
          <UsageNote
            title="数値精度の注意"
            body="JavaScriptのNumber型はIEEE 754倍精度浮動小数点数のため、53ビット超の整数（例: 銀行のID等）は精度が失われます。大きな整数を扱う場合は文字列として扱うのが安全です。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/base64" label="Base64変換" disabled />
          <RelatedToolBadge href="/url-encode" label="URLエンコード" disabled />
          <RelatedToolBadge href="/character-count" label="文字数カウンター" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/json-formatter"
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
