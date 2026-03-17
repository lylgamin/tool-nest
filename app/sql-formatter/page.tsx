import type { Metadata } from 'next'
import SqlFormatterTool from './_components/SqlFormatterTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'SQLフォーマッター',
  description: 'SQLをキーワード大文字化・インデント整形・圧縮できるWebツール。入力データはサーバーに送信されず、ブラウザ内で完結します。SELECT/JOIN/WHERE句を自動整形。',
  openGraph: {
    title: 'SQLフォーマッター | tool-nest',
    description: 'SQLの整形・圧縮をブラウザ内で完結。キーワード大文字化・インデント整形・コメント除去に対応。',
    url: 'https://tool-nest.pages.dev/sql-formatter',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SQLフォーマッター',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'SQLをキーワード大文字化・インデント整形・圧縮するWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/sql-formatter',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export function formatSql(sql: string, indent: string = '  '): FormatResult {
  if (!sql.trim()) return { ok: false, error: '入力が空です' }
  try {
    const tokens = tokenize(sql)
    const words = tokens.map(t => {
      if (t.kind === 'whitespace' || t.kind === 'comment') return t
      const up = t.value.toUpperCase()
      if (KEYWORDS.includes(up)) return { kind: 'keyword' as TokenKind, value: up }
      return t
    })
    const multiKeywords = KEYWORDS
      .filter(k => k.includes(' '))
      .sort((a, b) => b.length - a.length)

    let out = ''
    let depth = 0
    const nonWS = words.filter(t => t.kind !== 'whitespace')

    for (let idx = 0; idx < nonWS.length; idx++) {
      const t = nonWS[idx]
      // multi-word keyword check (ORDER BY, LEFT JOIN, ...)
      let matched = ''
      for (const mk of multiKeywords) {
        const parts = mk.split(' ')
        let ok = true
        for (let p = 0; p < parts.length; p++) {
          const nt = nonWS[idx + p]
          if (!nt || nt.value.toUpperCase() !== parts[p]) { ok = false; break }
        }
        if (ok) { matched = mk; break }
      }
      if (matched) {
        if (NEWLINE_BEFORE.has(matched)) {
          out = out.trimEnd()
          out += '\\n' + indent.repeat(depth > 0 ? 1 : 0) + matched
        } else {
          out += ' ' + matched
        }
        idx += matched.split(' ').length - 1
        continue
      }
      if (t.kind === 'keyword' && NEWLINE_BEFORE.has(t.value)) {
        out = out.trimEnd()
        out += '\\n' + indent.repeat(depth > 0 ? 1 : 0) + t.value
      } else if (t.kind === 'paren') {
        if (t.value === '(') { out += '('; depth++ }
        else { depth = Math.max(0, depth - 1); out = out.trimEnd(); out += ')' }
      } else if (t.kind === 'comma') {
        out += ','
        out += depth <= 1 ? '\\n' + indent : ' '
      } else {
        out += ' ' + t.value
      }
    }
    return { ok: true, output: out.trim() }
  } catch (e) {
    return { ok: false, error: \`フォーマットエラー: \${String(e)}\` }
  }
}`

export default function SqlFormatterPage() {
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
          data / sql
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          SQLフォーマッター
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          SQLをキーワード大文字化・インデント整形・圧縮できます。入力データはサーバーに送信されません。
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
        <SqlFormatterTool />
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
          <li>左側のテキストエリアにSQLをペーストしてください</li>
          <li>「整形」ボタンを押すとキーワードが大文字化され、各句が改行・インデントされます</li>
          <li>「圧縮」ボタンを押すとコメントを除去して1行に圧縮できます</li>
          <li>右側に結果が表示されたら「コピー」ボタンでクリップボードにコピーできます</li>
          <li>「クリア」ボタンで入力・出力を一括リセットできます</li>
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
          コアロジックはブラウザ標準APIのみで実装しています。正規表現ベースのトークナイザーでSQLを字句解析し、キーワードの種類に応じて改行・インデントを挿入します。外部ライブラリは不要なので、そのままコピーしてご利用いただけます。
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
            title="クエリのレビュー・共有時に"
            body="ORM や BI ツールが生成した1行の長いSQLを整形して、レビューや共有に使えます。JOIN条件やWHERE句の論理が一目でわかるようになります。"
          />
          <UsageNote
            title="本番環境へのデプロイ前の圧縮"
            body="アプリケーションのコードに埋め込むSQLは圧縮してスペースを節約できます。コメント・余分な空白を除去した最小化されたSQLを生成します。"
          />
          <UsageNote
            title="方言による違いに注意"
            body="このツールはSQL標準のキーワードを対象に整形します。MySQL固有の構文（LIMIT ... OFFSET）やPostgreSQL拡張などは認識できないキーワードが出ることがありますが、文字列・識別子はそのまま保持されます。"
          />
          <UsageNote
            title="文字列リテラル・識別子は変換しない"
            body="シングルクォート・ダブルクォートで囲まれた文字列リテラルや、バッククォートで囲まれた識別子の内容は大文字化・改行の対象外です。データ値がそのまま保持されます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/json-formatter" label="JSONフォーマッター" />
          <RelatedToolBadge href="/character-count" label="文字数カウンター" />
          <RelatedToolBadge href="/regex-tester" label="正規表現テスター" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/sql-formatter"
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
