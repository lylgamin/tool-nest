import type { Metadata } from 'next'
import CsvJsonTool from './_components/CsvJsonTool'

export const metadata: Metadata = {
  title: 'CSV ↔ JSON 変換',
  description: 'CSVとJSONを双方向に変換できるWebツール。CSVヘッダーをキーとしたJSONオブジェクト配列に変換し、テーブルプレビューを表示します。入力データはサーバーに送信されません。',
  openGraph: {
    title: 'CSV ↔ JSON 変換 | tool-nest',
    description: 'CSVとJSONの双方向変換をブラウザ内で完結。テーブルプレビュー・数値自動変換対応。',
    url: 'https://tool-nest.pages.dev/csv-json',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CSV ↔ JSON 変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'CSVとJSONを双方向に変換するWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/csv-json',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const csvToJsonCode = `/** CSV文字列 → JSONオブジェクト配列 */
export function csvToJson(csv: string): ConvertResult<string> {
  const parsed = parseCsv(csv)
  if (!parsed.ok) return parsed
  const [header, ...dataRows] = parsed.output
  if (!header || header.length === 0)
    return { ok: false, error: 'ヘッダー行が見つかりません' }
  const objects = dataRows.map(row => {
    const obj: Record<string, string | number> = {}
    header.forEach((key, i) => {
      const raw = row[i] ?? ''
      const num = Number(raw)
      // 数値に変換できる場合は自動的にnumber型へ
      obj[key.trim()] = raw !== '' && !isNaN(num) ? num : raw
    })
    return obj
  })
  return { ok: true, output: JSON.stringify(objects, null, 2) }
}

/** JSONオブジェクト配列 → CSV文字列 */
export function jsonToCsv(json: string): ConvertResult<string> {
  if (!json.trim()) return { ok: false, error: '入力が空です' }
  let parsed: unknown
  try { parsed = JSON.parse(json) } catch (e) {
    return { ok: false, error: \`JSONの解析に失敗: \${e instanceof SyntaxError ? e.message : String(e)}\` }
  }
  if (!Array.isArray(parsed))
    return { ok: false, error: 'JSONはオブジェクトの配列である必要があります' }
  if (parsed.length === 0) return { ok: true, output: '' }
  const headers = Object.keys(parsed[0] as Record<string, unknown>)
  const escape = (v: unknown) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\\n')
      ? \`"\${s.replace(/"/g, '""')}"\`
      : s
  }
  const lines = [
    headers.map(h => escape(h)).join(','),
    ...(parsed as Record<string, unknown>[]).map(
      row => headers.map(h => escape(row[h])).join(',')
    ),
  ]
  return { ok: true, output: lines.join('\\n') }
}`

export default function CsvJsonPage() {
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
          data / convert
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          CSV ↔ JSON 変換
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          CSVとJSONを双方向に変換できます。CSVヘッダーをキーとしたJSONオブジェクト配列に変換し、テーブルプレビューを表示します。入力データはサーバーに送信されません。
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
        <CsvJsonTool />
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
          <li>方向ボタンで「CSV → JSON」か「JSON → CSV」を選択します</li>
          <li>左側のテキストエリアに変換したいデータをペーストします</li>
          <li>「変換」ボタンを押すと右側に変換結果が表示されます</li>
          <li>CSV → JSON 変換の場合、下部にテーブルプレビューが表示されます（最大10行）</li>
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
          <code>{csvToJsonCode}</code>
        </pre>
      </section>

      {/* よくある使用例・注意点 */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="よくある使用例・注意点" count="03" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <UsageNote
            title="CSVのフォーマットについて"
            body="1行目をヘッダー行として扱います。各列の値がJSONオブジェクトのキーになります。ヘッダーの前後の空白は自動的に除去されます。空行は無視されます。"
          />
          <UsageNote
            title="クォートとエスケープ"
            body='カンマ・ダブルクォート・改行を含む値はダブルクォートで囲む必要があります（RFC 4180準拠）。ダブルクォート自体は "" のように二重にしてエスケープします。JSON → CSV 変換時はこの処理が自動で行われます。'
          />
          <UsageNote
            title="数値の自動変換（CSV→JSON）"
            body="CSV → JSON 変換時、数値として解釈できる値は自動的に number 型に変換されます（例: &quot;42&quot; → 42、&quot;1.5&quot; → 1.5）。電話番号・郵便番号など文字列として扱いたい数字列は、CSVでクォートしても変換されます。変換後にJSONを手動で調整してください。"
          />
          <UsageNote
            title="JSON→CSV変換の制限"
            body="JSON配列の最初のオブジェクトのキーがCSVのヘッダーになります。各行のオブジェクトにキーが存在しない場合は空文字列になります。ネストしたオブジェクトや配列は文字列として展開されます（フラット化は行いません）。"
          />
          <UsageNote
            title="大きなファイルの扱い"
            body="このツールはブラウザ内で処理するため、非常に大きなCSV/JSONファイルを変換するとブラウザが重くなる場合があります。数MB以上のファイルはNode.js等のサーバーサイド処理を推奨します。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/json-formatter" label="JSONフォーマッター" />
          <RelatedToolBadge href="/json-to-ts" label="JSON → TypeScript型生成" />
          <RelatedToolBadge href="/url-encode" label="URLエンコード" />
          <RelatedToolBadge href="/base64" label="Base64変換" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/csv-json"
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
      <div
        style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--ink-mid)',
          lineHeight: 1.7,
        }}
        dangerouslySetInnerHTML={{ __html: body }}
      />
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
