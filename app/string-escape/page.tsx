import type { Metadata } from 'next'
import StringEscapeTool from './_components/StringEscapeTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: '文字列エスケープ変換 — JS / JSON / Python / SQL対応',
  description: 'JavaScript・JSON・Python・SQL の文字列エスケープ・アンエスケープをブラウザだけで変換。\\n \\t \\" \\\\ などの特殊文字を一括処理。入力データはサーバーに送信されません。',
  openGraph: {
    title: '文字列エスケープ変換 | tool-nest',
    description: 'JS / JSON / Python / SQL の文字列エスケープ・アンエスケープをブラウザ内で完結。外部ライブラリ不使用。',
    url: 'https://tool-nest.pages.dev/string-escape',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '文字列エスケープ変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'JavaScript・JSON・Python・SQL の文字列エスケープ・アンエスケープを行うWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/string-escape',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreLogicCode = `export type Lang = 'js' | 'json' | 'python' | 'sql'

export function escapeString(input: string, lang: Lang): string {
  switch (lang) {
    case 'js':
      return input
        .replace(/\\\\/g, '\\\\\\\\')
        .replace(/"/g, '\\\\"')
        .replace(/\\n/g, '\\\\n')
        .replace(/\\r/g, '\\\\r')
        .replace(/\\t/g, '\\\\t')
    case 'json':
      return JSON.stringify(input).slice(1, -1)
    case 'python':
      return input
        .replace(/\\\\/g, '\\\\\\\\')
        .replace(/'/g, "\\\\'")
        .replace(/\\n/g, '\\\\n')
        .replace(/\\r/g, '\\\\r')
        .replace(/\\t/g, '\\\\t')
    case 'sql':
      return input.replace(/'/g, "''")
  }
}

export function unescapeString(input: string, lang: Lang): Result<string> {
  try {
    switch (lang) {
      case 'js':
      case 'json': {
        const parsed = JSON.parse('"' + input + '"')
        return { ok: true, output: parsed }
      }
      case 'python': {
        const result = input
          .replace(/\\\\\\\\/g, '\\x00')
          .replace(/\\\\'/g, "'")
          .replace(/\\\\n/g, '\\n')
          .replace(/\\\\r/g, '\\r')
          .replace(/\\\\t/g, '\\t')
          .replace(/\\x00/g, '\\\\')
        return { ok: true, output: result }
      }
      case 'sql': {
        return { ok: true, output: input.replace(/''/g, "'") }
      }
    }
  } catch {
    return { ok: false, error: 'アンエスケープに失敗しました。' }
  }
}`

export default function StringEscapePage() {
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
          encode / string
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          文字列エスケープ変換
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          JavaScript・JSON・Python・SQL の文字列エスケープ・アンエスケープをブラウザだけで変換。
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>{'\\n'}</code>
          {' '}
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>{'\\t'}</code>
          {' '}
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>{'\\"'}</code>
          {' '}
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>{"\\'"}</code>
          などの特殊文字に対応。入力データはサーバーに送信されません。
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
        <StringEscapeTool />
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
          <li>変換対象の言語（JS / JSON / Python / SQL）を選択します</li>
          <li>「エスケープ」または「アンエスケープ」のモードを選択します</li>
          <li>テキストエリアに変換したい文字列を入力します</li>
          <li>ボタンを押すと、変換結果が出力エリアに表示されます</li>
          <li>「コピー」ボタンで結果をクリップボードにコピーできます</li>
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
          コアロジックは標準ブラウザAPI（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px' }}>JSON.stringify / JSON.parse</code>）と正規表現のみで実装しています。
          外部ライブラリは不要なので、そのままコピーしてご利用いただけます。
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
            title="SQLインジェクション対策での利用"
            body="SQL の文字列リテラルにユーザー入力を埋め込む際は、シングルクォートを '' にエスケープする必要があります。このツールでSQLエスケープの動作を素早く確認できます。プロダクションコードではプリペアドステートメントの利用を推奨します。"
          />
          <UsageNote
            title="JSONデータのデバッグに使う"
            body="APIレスポンスやログに含まれるエスケープ済み文字列をアンエスケープして、実際の値を確認するのに便利です。JSON モードでは JSON.parse と同等の処理を行うため、標準的なJSONエスケープに完全対応しています。"
          />
          <UsageNote
            title="JS と JSON のエスケープの違い"
            body="JS モードはダブルクォート文字列向けのエスケープです。JSON モードは JSON.stringify 相当で、制御文字（U+0000〜U+001F）もエスケープします。通常のユースケースでは両者の差はほとんどありませんが、制御文字を含む場合は JSON モードを推奨します。"
          />
          <UsageNote
            title="Python の文字列エスケープ"
            body="Python モードはシングルクォート文字列向けのエスケープです。バックスラッシュ・シングルクォート・改行・タブに対応しています。raw文字列（r'...'）やトリプルクォートには対応していません。"
          />
          <UsageNote
            title="プライバシーについて"
            body="入力したテキストはブラウザ内のみで処理されます。サーバーには一切送信されないため、APIキーやパスワードなどの機密情報も安全に変換できます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/url-encode" label="URLエンコード/デコード" />
          <RelatedToolBadge href="/html-escape" label="HTMLエスケープ" />
          <RelatedToolBadge href="/base64" label="Base64エンコード/デコード" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/string-escape"
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
