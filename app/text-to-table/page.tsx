import type { Metadata } from 'next'
import TextToTableTool from './_components/TextToTableTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'テキスト → テーブル変換 — CSV/TSV を Markdown テーブルに変換',
  description: 'CSV・TSV テキストを Markdown テーブル形式に変換するWebツール。1行目をヘッダーとして扱い、セル内の特殊文字も自動エスケープ。入力データはサーバーに送信されません。',
  openGraph: {
    title: 'テキスト → テーブル変換 | tool-nest',
    description: 'CSV・TSV を Markdown テーブルに変換。ブラウザのみで完結。コピーボタン付き。',
    url: 'https://tool-nest.pages.dev/text-to-table',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'テキスト → テーブル変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'CSV・TSV テキストを Markdown テーブル形式に変換するWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/text-to-table',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreLogicCode = `export type Result<T> = { ok: true; output: T } | { ok: false; error: string }

/**
 * CSVまたはTSVテキストをMarkdownテーブルに変換する
 * 1行目をヘッダー、2行目以降をデータ行として扱う
 * セル内の | は \\| にエスケープ
 */
export function csvToMarkdownTable(input: string, delimiter: '\\t' | ','): Result<string> {
  const trimmed = input.trim()
  if (!trimmed) return { ok: false, error: '入力が空です' }

  const lines = trimmed.split('\\n').map(l => l.trimEnd())
  if (lines.length < 1) return { ok: false, error: '入力が空です' }

  const parseRow = (line: string): string[] =>
    line.split(delimiter).map(cell => cell.trim().replace(/\\|/g, '\\\\|'))

  const headers = parseRow(lines[0])
  const colCount = headers.length

  const headerRow = '| ' + headers.join(' | ') + ' |'
  const separatorRow = '| ' + headers.map(() => '---').join(' | ') + ' |'

  const dataRows = lines.slice(1).map(line => {
    const cells = parseRow(line)
    while (cells.length < colCount) cells.push('')
    return '| ' + cells.slice(0, colCount).join(' | ') + ' |'
  })

  const result = [headerRow, separatorRow, ...dataRows].join('\\n')
  return { ok: true, output: result }
}`

export default function TextToTablePage() {
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
          text / format
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          テキスト → テーブル変換
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          CSV・TSV テキストを Markdown テーブル形式に変換します。
          1行目をヘッダーとして扱い、セル内の縦棒（|）は自動エスケープ。入力データはサーバーに送信されません。
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
        <TextToTableTool />
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
          <li>区切り文字を選択します（「カンマ」または「タブ」）</li>
          <li>入力エリアに CSV または TSV テキストを貼り付けます。1行目がヘッダーになります</li>
          <li>「変換」ボタンを押すと、Markdown テーブルが生成されます</li>
          <li>「コピー」ボタンで出力をクリップボードにコピーできます</li>
          <li>GitHub の README や Notion などに貼り付けてご利用ください</li>
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
          コアロジックは標準の文字列操作のみで実装しています。
          外部ライブラリは不要なので、そのままコピーしてプロジェクトに組み込めます。
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
            title="スプレッドシートから Markdown に変換する"
            body="Google スプレッドシートや Excel でセルを選択してコピーすると、タブ区切りのテキストとしてクリップボードに入ります。区切り文字を「タブ」に設定して貼り付けると、Markdown テーブルに変換できます。"
          />
          <UsageNote
            title="GitHub README のテーブル作成"
            body="GitHub の README.md にテーブルを追加したいときに便利です。CSV を貼り付けて変換し、そのまま README に貼り付けられます。"
          />
          <UsageNote
            title="セル内に縦棒（|）がある場合"
            body="Markdown テーブルの区切り文字として使われる縦棒（|）がセル内にある場合、自動的にエスケープされます。多くの Markdown パーサーで正しく表示されます。"
          />
          <UsageNote
            title="列数が揃っていない場合"
            body="データ行の列数がヘッダーより少ない場合は、空のセルで自動的に埋められます。ヘッダーより多い列は切り捨てられます。"
          />
          <UsageNote
            title="プライバシーについて"
            body="入力したテキストはブラウザ内のみで処理されます。サーバーには一切送信されないため、機密情報を含むデータも安全に変換できます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/text-diff" label="テキスト差分ツール" />
          <RelatedToolBadge href="/character-count" label="文字数カウンター" />
          <RelatedToolBadge href="/csv-json" label="CSV ↔ JSON 変換" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/text-to-table"
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
