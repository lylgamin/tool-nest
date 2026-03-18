import type { Metadata } from 'next'
import JsonSchemaTool from './_components/JsonSchemaTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'JSON Schema生成ツール — JSONからスキーマを自動生成',
  description: 'JSONデータを入力するだけでJSON Schema（draft-07）を自動生成するWebツール。型・必須フィールド・ネスト構造をブラウザ内で解析。入力データはサーバーに送信されません。',
  openGraph: {
    title: 'JSON Schema生成ツール | tool-nest',
    description: 'JSONからJSON Schema（draft-07）を自動生成。ブラウザのみで完結。外部ライブラリ不要。',
    url: 'https://tool-nest.pages.dev/json-schema',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JSON Schema生成ツール',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'JSONデータを入力するだけでJSON Schema（draft-07）を自動生成するWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/json-schema',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreLogicCode = `export type Result<T> = { ok: true; output: T } | { ok: false; error: string }

export function generateJsonSchema(value: unknown, title?: string): object {
  const schema = buildSchema(value)
  if (title && typeof schema === 'object' && schema !== null) {
    return { $schema: 'http://json-schema.org/draft-07/schema#', title, ...schema }
  }
  return { $schema: 'http://json-schema.org/draft-07/schema#', ...schema as object }
}

function buildSchema(value: unknown): object {
  if (value === null) return { type: 'null' }
  if (typeof value === 'boolean') return { type: 'boolean' }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' }
  }
  if (typeof value === 'string') return { type: 'string' }
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: 'array', items: {} }
    return { type: 'array', items: buildSchema(value[0]) }
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const properties: Record<string, object> = {}
    const required: string[] = []
    for (const [key, val] of Object.entries(obj)) {
      properties[key] = buildSchema(val)
      if (val !== null && val !== undefined) required.push(key)
    }
    const schema: Record<string, unknown> = { type: 'object', properties }
    if (required.length > 0) schema.required = required
    return schema
  }
  return {}
}

export function generateJsonSchemaFromString(input: string, title?: string): Result<string> {
  try {
    const parsed = JSON.parse(input)
    const schema = generateJsonSchema(parsed, title)
    return { ok: true, output: JSON.stringify(schema, null, 2) }
  } catch (e) {
    return { ok: false, error: \`JSONパースエラー: \${(e as Error).message}\` }
  }
}`

export default function JsonSchemaPage() {
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
          format / schema
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          JSON Schema生成ツール
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          JSONデータを貼り付けるだけでJSON Schema（draft-07）を自動生成します。
          型推論・必須フィールド・ネスト構造をブラウザ内で解析。入力データはサーバーに送信されません。
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
        <JsonSchemaTool />
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
          <li>JSON入力エリアにスキーマを生成したいJSONデータを貼り付けます</li>
          <li>タイトルフィールドに任意のスキーマ名を入力します（省略可）</li>
          <li>「スキーマ生成」ボタンを押すと、JSON Schema（draft-07）が生成されます</li>
          <li>生成されたスキーマは「コピー」ボタンでクリップボードにコピーできます</li>
          <li>配列の場合は最初の要素の型をもとに <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'rgba(31,107,114,0.1)', padding: '1px 5px', borderRadius: '3px' }}>items</code> スキーマを生成します</li>
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
          コアロジックは再帰的な型推論で実装しています。
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'rgba(31,107,114,0.1)', padding: '1px 5px', borderRadius: '3px' }}>buildSchema</code> 関数が値の型を判定し、オブジェクト・配列を再帰的に処理します。外部ライブラリ不要でそのままコピーしてご利用いただけます。
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
            title="APIレスポンスのバリデーションスキーマ作成"
            body="REST APIのレスポンスJSONを貼り付けるだけで、バリデーション用のJSON Schemaを素早く生成できます。生成したスキーマをAjvやzodのベースとして活用することで、型安全なAPI連携を実現できます。"
          />
          <UsageNote
            title="OpenAPI / Swagger仕様書の作成補助"
            body="OpenAPI仕様書のcomponentsセクションに掲載するスキーマを手動で書く手間を省けます。実際のレスポンスデータからスキーマを生成し、必要に応じて手動で調整する用途に最適です。"
          />
          <UsageNote
            title="配列の型推論について"
            body="配列の場合、最初の要素（index: 0）の型をもとに <code style='font-family: var(--font-jetbrains), monospace; font-size: 12px; background: rgba(31,107,114,0.1); padding: 1px 5px; border-radius: 3px;'>items</code> スキーマを生成します。配列内に複数の型が混在する場合は、生成後に手動で <code style='font-family: var(--font-jetbrains), monospace; font-size: 12px; background: rgba(31,107,114,0.1); padding: 1px 5px; border-radius: 3px;'>oneOf</code> などに修正してください。"
          />
          <UsageNote
            title="null値と required フィールドの扱い"
            body="プロパティの値が <code style='font-family: var(--font-jetbrains), monospace; font-size: 12px; background: rgba(31,107,114,0.1); padding: 1px 5px; border-radius: 3px;'>null</code> の場合は <code style='font-family: var(--font-jetbrains), monospace; font-size: 12px; background: rgba(31,107,114,0.1); padding: 1px 5px; border-radius: 3px;'>required</code> から除外されます。実際の要件に応じて、必要なフィールドを <code style='font-family: var(--font-jetbrains), monospace; font-size: 12px; background: rgba(31,107,114,0.1); padding: 1px 5px; border-radius: 3px;'>required</code> に追加してください。"
          />
          <UsageNote
            title="プライバシーについて"
            body="入力したJSONデータはブラウザ内のみで処理されます。サーバーには一切送信されないため、機密情報を含むAPIレスポンスや設定ファイルも安全に扱えます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/json-formatter" label="JSONフォーマッター" />
          <RelatedToolBadge href="/json-to-ts" label="JSON → TypeScript型生成" />
          <RelatedToolBadge href="/json-path" label="JSONパスクエリ" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/json-schema"
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
