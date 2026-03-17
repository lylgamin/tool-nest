import type { Metadata } from 'next'
import UrlEncodeToolClient from './_components/UrlEncodeToolClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'URLエンコード/デコード',
  description: 'テキストをURLエンコード（パーセントエンコーディング）に変換・復元するWebツール。日本語対応。入力内容はサーバーに送信されません。',
  openGraph: {
    title: 'URLエンコード/デコード | tool-nest',
    description: 'テキストをURLエンコード（パーセントエンコーディング）に変換・復元。日本語対応。',
    url: 'https://tool-nest.pages.dev/url-encode',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'URLエンコード/デコード',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'テキストをURLエンコード（パーセントエンコーディング）に変換・復元するWebツール。日本語対応。',
  url: 'https://tool-nest.pages.dev/url-encode',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `// URLエンコード: encodeURIComponent を使用
export function encodeUrlComponent(input: string): string {
  return encodeURIComponent(input)
}

// URLデコード: decodeURIComponent を使用
export type DecodeResult =
  | { ok: true; output: string }
  | { ok: false; error: string }

export function decodeUrlComponent(input: string): DecodeResult {
  try {
    return { ok: true, output: decodeURIComponent(input) }
  } catch (e) {
    return { ok: false, error: \`デコードエラー: \${(e as Error).message}\` }
  }
}

// 不正な%シーケンスの検出
export function isValidUrlEncoded(input: string): boolean {
  return !/%(?![0-9A-Fa-f]{2})/.test(input)
}`

export default function UrlEncodePage() {
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
          encoding / url
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          URL エンコード / デコード
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          テキストをURLエンコード（パーセントエンコーディング）形式に変換・復元します。日本語を含む文字列に対応しています。
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
        <UrlEncodeToolClient />
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
          <li>「エンコード」または「デコード」タブを選択してください</li>
          <li>テキストエリアに入力すると、リアルタイムで変換結果が表示されます</li>
          <li>エンコードでは日本語・記号・スペースなどを <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>%XX</code> 形式に変換します</li>
          <li>「コピー」ボタンで変換結果をクリップボードにコピーできます</li>
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
          ブラウザ標準の <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>encodeURIComponent</code> /
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}> decodeURIComponent</code> のみで実装。外部ライブラリ不要でそのままコピーして利用できます。
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
            title="クエリパラメータへの日本語埋め込み"
            body="URLのクエリパラメータに日本語や特殊文字を含める場合、必ずURLエンコードが必要です。例：検索ワード「日本語」→ ?q=%E6%97%A5%E6%9C%AC%E8%AA%9E。ブラウザのアドレスバーでは自動的に変換されることがありますが、コード上では明示的にエンコードしてください。"
          />
          <UsageNote
            title="encodeURI vs encodeURIComponent の違い"
            body="encodeURI はURL全体に使い、: / ? # & = などのURL構造文字はエンコードしません。encodeURIComponent はクエリ値などURL部品に使い、これらの文字もすべてエンコードします。このツールは encodeURIComponent を使用しています。"
          />
          <UsageNote
            title="+（プラス）記号の扱い"
            body="HTMLフォームのapplication/x-www-form-urlencoded形式ではスペースが+に変換されます。しかし encodeURIComponent ではスペースは%20になります。+をスペースとして扱うのは古い形式のみです。このツールは+をそのまま+として扱い、スペースには変換しません。"
          />
          <UsageNote
            title="デコードエラーの原因"
            body="%の後に16進数2桁（0-9, A-F）が続かない場合、デコードエラーになります。例：%ZZ, %G1, 末尾の%など。エラーが出た場合は入力文字列の%シーケンスが正しいか確認してください。"
          />
          <UsageNote
            title="APIリクエストのパラメータ構築"
            body="fetch や axios でAPIリクエストを送る際、URLにパラメータを含める場合は encodeURIComponent でエンコードしてください。URLSearchParams を使うと自動的に適切なエンコードが行われます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="Base64エンコード" href="/base64" />
          <RelatedToolBadge label="HTMLエスケープ" href="/html-escape" />
          <RelatedToolBadge label="ハッシュ生成" href="/hash" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/url-encode"
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
