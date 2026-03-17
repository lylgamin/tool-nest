import type { Metadata } from 'next'
import CurlToFetchTool from './_components/CurlToFetchTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'curl → Fetch / Axios / Python 変換',
  description: 'curlコマンドをFetch API・Axios・Python requestsのコードに変換するWebツール。-X/-H/-d/-uオプションに対応。入力はブラウザ内でのみ処理されます。',
  openGraph: {
    title: 'curl → Fetch / Axios / Python 変換 | tool-nest',
    description: 'curlコマンドをJS/PythonのHTTPクライアントコードに変換。ブラウザ内で完結。',
    url: 'https://tool-nest.pages.dev/curl-to-fetch',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'curl → Fetch / Axios / Python 変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'curlコマンドをFetch API・Axios・Python requestsのコードに変換するWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/curl-to-fetch',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const parseCurlCode = `function parseCurl(cmd: string): ParsedCurl {
  const tokens = tokenize(cmd.replace(/\\\\\\n/g, ' ').trim())
  let i = 0
  if (tokens[i]?.toLowerCase() === 'curl') i++

  let url = '', method = ''
  const headers: Record<string, string> = {}
  let body: string | null = null

  while (i < tokens.length) {
    const tok = tokens[i]
    if (tok === '-X' || tok === '--request') {
      method = tokens[++i] ?? 'GET'; i++
    } else if (tok === '-H' || tok === '--header') {
      const h = tokens[++i] ?? ''; i++
      const idx = h.indexOf(':')
      if (idx > 0) headers[h.slice(0, idx).trim()] = h.slice(idx + 1).trim()
    } else if (tok === '-d' || tok === '--data' || tok === '--data-raw') {
      body = tokens[++i] ?? ''; i++
    } else if (!tok.startsWith('-')) {
      url = tok; i++
    } else { i++ }
  }
  if (!method) method = body ? 'POST' : 'GET'
  const ct = headers['Content-Type'] || ''
  return { url, method: method.toUpperCase(), headers, body, isJson: ct.includes('json') }
}

function toFetch(parsed: ParsedCurl): string {
  const { url, method, headers, body } = parsed
  const opts: string[] = []
  if (method !== 'GET') opts.push(\`  method: '\${method}'\`)
  if (Object.keys(headers).length > 0) {
    const lines = Object.entries(headers).map(([k, v]) => \`    '\${k}': '\${v}'\`)
    opts.push(\`  headers: {\\n\${lines.join(',\\n')}\\n  }\`)
  }
  if (body !== null) opts.push(\`  body: \${JSON.stringify(body)}\`)
  if (opts.length === 0) return \`const response = await fetch('\${url}');\\nconst data = await response.json();\`
  return \`const response = await fetch('\${url}', {\\n\${opts.join(',\\n')},\\n});\\nconst data = await response.json();\`
}`

export default function CurlToFetchPage() {
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
          network / convert
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          curl → Fetch API 変換
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          curlコマンドをFetch API・Axios・Python requestsのコードに変換します。-X/-H/-d/-uオプションに対応。入力はブラウザ内でのみ処理されます。
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
        <CurlToFetchTool />
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
          <li>左側のテキストエリアにcurlコマンドをペーストしてください</li>
          <li>出力形式（Fetch API・Axios・Python requests）をタブで選択します</li>
          <li>「変換」ボタンを押すと右側にコードが生成されます</li>
          <li>「コピー」ボタンで生成されたコードをクリップボードにコピーできます</li>
          <li>サンプルボタンから代表的なcurlコマンドをワンクリックで入力できます</li>
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
          コアロジックはブラウザ標準APIのみで実装しています。外部ライブラリは不要で、そのままコピーしてご利用いただけます。
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>parseCurl</code>
          {' '}でcurl引数をトークン解析し、{' '}
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>toFetch</code>
          {' '}で各形式に変換します。
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
          <code>{parseCurlCode}</code>
        </pre>
      </section>

      {/* よくある使用例・注意点 */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="よくある使用例・注意点" count="03" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <UsageNote
            title="curlオプションの対応範囲"
            body="-X（メソッド指定）、-H（ヘッダー）、-d / --data / --data-raw / --data-binary（リクエストボディ）、--json（JSONボディ＋ヘッダー自動付与）、-u（Basic認証）に対応しています。--compressed・-L・-sなどの転送制御オプションは無視されます。"
          />
          <UsageNote
            title="認証情報の扱い"
            body="-u user:pass を指定すると Authorization: Basic ヘッダーに自動変換します。Bearer トークンは -H で直接指定してください。変換後のコードに認証情報がそのまま含まれるため、コードをコミットする際はトークンを環境変数に置き換えることを強くお勧めします。"
          />
          <UsageNote
            title="複数行curlコマンド"
            body="バックスラッシュ（\\）で改行した複数行のcurlコマンドにも対応しています。ターミナルからそのままコピーして貼り付けることができます。ただし、シェルの変数展開（$VAR）はそのままの文字列として扱われます。"
          />
          <UsageNote
            title="変換の制限事項"
            body="--form（マルチパートフォーム）、--cert（クライアント証明書）、--proxy などの高度なオプションは現在未対応です。また、Content-Type が application/json の場合のみボディをJSONとして解釈します。フォームデータ（application/x-www-form-urlencoded）はそのまま文字列として出力されます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/url-parser" label="URLパーサー" />
          <RelatedToolBadge href="/http-status" label="HTTPステータスコード一覧" />
          <RelatedToolBadge href="/url-encode" label="URLエンコード" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/curl-to-fetch"
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
