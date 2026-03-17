import type { Metadata } from 'next'
import UrlParserClient from './_components/UrlParserClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'URLパーサー — URL分解・クエリパラメータ解析',
  description: 'URLをプロトコル・ホスト・パス・クエリパラメータに分解して表示するWebツール。デバッグやAPIリクエスト構築に便利。入力内容はサーバーに送信されません。',
  openGraph: {
    title: 'URLパーサー — URL分解・クエリパラメータ解析 | tool-nest',
    description: 'URLをプロトコル・ホスト・パス・クエリパラメータに分解して表示。デバッグやAPIリクエスト構築に便利。',
    url: 'https://tool-nest.pages.dev/url-parser',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'URLパーサー',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'URLをプロトコル・ホスト・パス・クエリパラメータに分解して表示するWebツール。',
  url: 'https://tool-nest.pages.dev/url-parser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export type ParsedUrl = {
  protocol: string
  username: string
  password: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  params: Array<{ key: string; value: string }>
}

export type ParseResult =
  | { ok: true; parsed: ParsedUrl }
  | { ok: false; error: string }

export function parseUrl(input: string): ParseResult {
  const trimmed = input.trim()
  if (!trimmed) return { ok: false, error: '' }

  try {
    const url = new URL(trimmed)
    const params: Array<{ key: string; value: string }> = []
    url.searchParams.forEach((value, key) => {
      params.push({ key, value })
    })
    return {
      ok: true,
      parsed: {
        protocol: url.protocol,
        username: url.username,
        password: url.password,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        params,
      },
    }
  } catch {
    return {
      ok: false,
      error: '無効なURLです。http:// または https:// から始まるURLを入力してください',
    }
  }
}`

export default function UrlParserPage() {
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
          URL パーサー
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          URLをプロトコル・ホスト名・パス・クエリパラメータ・ハッシュに分解して表示します。入力内容はサーバーに送信されません。
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
        <UrlParserClient />
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
          <li>入力フィールドにURLを貼り付けてください（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>http://</code> または <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>https://</code> から始まるURL）</li>
          <li>リアルタイムでプロトコル・ホスト名・ポート・パス・クエリパラメータ・ハッシュに分解されます</li>
          <li>クエリパラメータはキーと値に分けて一覧表示されます</li>
          <li>各フィールドの「copy」ボタンで値をクリップボードにコピーできます</li>
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
          ブラウザ標準の <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>URL</code> APIと
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}> URLSearchParams</code> のみで実装。外部ライブラリ不要でそのままコピーして利用できます。
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
            title="クエリパラメータのデコード"
            body="URLSearchParams は自動的にパーセントエンコードされたクエリパラメータをデコードして返します。例えば ?q=%E6%97%A5%E6%9C%AC%E8%AA%9E は「日本語」として取得できます。生の %XX 表現が必要な場合は search プロパティを参照してください。"
          />
          <UsageNote
            title="ハッシュ（#）の扱い"
            body="URLのハッシュ部分（# 以降）はサーバーに送信されず、ブラウザ側のみで処理されます。SPAのルーティングやページ内リンクに使われます。hash プロパティには # 記号を含んだ値が返ります（例：#section-1）。"
          />
          <UsageNote
            title="ポート番号のデフォルト省略"
            body="http:// のデフォルトポートは80番、https:// は443番です。URLにこれらのデフォルトポートが省略されている場合、port プロパティは空文字列を返します。このツールでは空の場合「（デフォルト）」と表示します。"
          />
          <UsageNote
            title="認証情報（username / password）の扱い"
            body="URLにはユーザー名・パスワードを埋め込む構文があります（例：https://user:pass@example.com）。現代のWebではほとんど使われませんが、FTPや内部ツールのURLで見かけることがあります。パスワードをURLに含めることはセキュリティ上推奨されません。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="URLエンコード/デコード" href="/url-encode" />
          <RelatedToolBadge label="HTMLエスケープ" href="/html-escape" />
          <RelatedToolBadge label="Base64エンコード" href="/base64" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/url-parser"
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
