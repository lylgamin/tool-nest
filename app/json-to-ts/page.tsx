import type { Metadata } from 'next'
import JsonToTsTool from './_components/JsonToTsTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'JSON → TypeScript型生成',
  description: 'JSONオブジェクトからTypeScriptのinterface・type定義を自動生成するWebツール。APIレスポンスの型付けに。入力データはサーバーに送信されません。',
  openGraph: {
    title: 'JSON → TypeScript型生成 | tool-nest',
    description: 'JSONからTypeScriptのinterface・type定義を自動生成。ブラウザ内で完結。',
    url: 'https://tool-nest.pages.dev/json-to-ts',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JSON → TypeScript型生成',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'JSONオブジェクトからTypeScriptのinterface・type定義を自動生成するWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/json-to-ts',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `type JsonValue = string | number | boolean | null | JsonValue[] | Record<string, JsonValue>

function isRecord(v: JsonValue): v is Record<string, JsonValue> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function inferType(
  value: JsonValue,
  indent: string,
  depth: number,
  rootName: string,
  interfaces: Map<string, string>
): string {
  if (value === null) return 'null'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'string') return 'string'

  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]'
    const elementTypes = value.map(v =>
      inferType(v, indent, depth + 1, rootName, interfaces)
    )
    const unique = [...new Set(elementTypes)]
    const inner = unique.length === 1 ? unique[0] : \`(\${unique.join(' | ')})\`
    return \`\${inner}[]\`
  }

  if (isRecord(value)) {
    const entries = Object.entries(value)
    const lines = entries.map(([k, v]) => {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : \`"\${k}"\`
      const isOptional = v === null
      const typeStr = inferType(v, indent, depth + 1, rootName, interfaces)
      return \`\${indent.repeat(depth + 1)}\${safeKey}\${isOptional ? '?' : ''}: \${typeStr};\`
    })
    return \`{\n\${lines.join('\\n')}\n\${indent.repeat(depth)}}\`
  }

  return 'unknown'
}

export function generateTypes(
  json: string,
  rootName: string = 'Root',
  style: 'interface' | 'type' = 'interface'
): { ok: true; output: string } | { ok: false; error: string } {
  if (!json.trim()) return { ok: false, error: '入力が空です' }
  let parsed: JsonValue
  try {
    parsed = JSON.parse(json)
  } catch (e) {
    return { ok: false, error: \`JSONの解析に失敗: \${e instanceof SyntaxError ? e.message : String(e)}\` }
  }
  const indent = '  '
  const interfaces = new Map<string, string>()
  if (isRecord(parsed)) {
    const typeStr = inferType(parsed, indent, 0, rootName, interfaces)
    const decl = style === 'interface'
      ? \`export interface \${rootName} \${typeStr}\`
      : \`export type \${rootName} = \${typeStr}\`
    return { ok: true, output: decl }
  }
  return { ok: true, output: \`export type \${rootName} = \${inferType(parsed, indent, 0, rootName, interfaces)}\` }
}`

export default function JsonToTsPage() {
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
          data / typescript
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          JSON → TypeScript 型生成
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          JSONオブジェクトからTypeScriptのinterface・type定義を自動生成します。APIレスポンスの型付けに。入力データはサーバーに送信されません。
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
        <JsonToTsTool />
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
          <li>左側のテキストエリアにJSONをペーストしてください</li>
          <li>生成したい型の名前（デフォルト: Root）を「型名」フィールドに入力します</li>
          <li>スタイルを <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>interface</code> か <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>type</code> から選択します</li>
          <li>「生成」ボタンを押すとTypeScript型定義が右側に表示されます</li>
          <li>「コピー」ボタンでクリップボードにコピーして、そのままコードに貼り付けられます</li>
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
          {' '}のみで実装しており、外部ライブラリは一切使用していません。
          再帰的に型を推論する{' '}
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>inferType</code>
          {' '}関数と、エントリーポイントとなる{' '}
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>generateTypes</code>
          {' '}関数をそのままコピーしてご利用いただけます。
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
            title="APIレスポンスの型付け"
            body="fetch や axios で取得したAPIレスポンスに型を付けたい場合に活用できます。レスポンスJSONをそのままペーストすれば、すぐに使えるinterface定義が生成されます。生成後は実際のAPIドキュメントと照合して省略可能フィールドに ? を追加するとより堅牢になります。"
          />
          <UsageNote
            title="null値の扱い"
            body="JSONでnullのフィールドは TypeScriptの型として null と推論されます。実際には string | null のようなユニオン型が適切なケースも多いため、生成後に手動で調整することを推奨します。また、フィールドがnullの場合は ? (optional) としてマークします。"
          />
          <UsageNote
            title="ネストされたオブジェクト"
            body="深くネストされたオブジェクトも再帰的に処理し、インライン型として展開されます。ネストが深い場合や同じ構造が繰り返し使われる場合は、生成された型を分割して個別のinterfaceに切り出すとコードの再利用性が高まります。"
          />
          <UsageNote
            title="配列の型推論"
            body="配列の型は最初の要素から推論されます。複数の異なる型の要素が含まれる場合はユニオン型として生成されます。空配列の場合は unknown[] となるため、実際の型に置き換えてください。ルートが配列の場合は RootList 型も合わせて生成されます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/json-formatter" label="JSONフォーマッター" />
          <RelatedToolBadge href="/csv-json" label="CSV → JSON変換" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/json-to-ts"
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
