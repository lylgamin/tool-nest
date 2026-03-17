import type { Metadata } from 'next'
import JsonPathTool from './_components/JsonPathTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'JSONパスクエリ — JSONPathで値を抽出',
  description: 'JSONPathクエリ（$.foo.bar, $..price, $[*]）をブラウザ内で実行・デバッグできるWebツール。入力データはサーバーに送信されません。再帰検索・ワイルドカード・後ろからのインデックスに対応。',
  openGraph: {
    title: 'JSONパスクエリ | tool-nest',
    description: 'JSONPathクエリをブラウザ内で実行。$.foo.bar, $..price, $[*]などの構文に対応。外部ライブラリなし。',
    url: 'https://tool-nest.pages.dev/json-path',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JSONパスクエリ',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'JSONPathクエリ（$.foo.bar, $..price, $[*]）を実行・デバッグするWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/json-path',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export type QueryResult =
  | { ok: true; results: unknown[]; count: number }
  | { ok: false; error: string }

// セグメント適用（再帰）
function applySegments(node: unknown, segments: Segment[]): unknown[] {
  if (segments.length === 0) return [node]
  const [seg, ...rest] = segments

  if (seg.type === 'key') {
    if (node !== null && typeof node === 'object' && !Array.isArray(node)) {
      const obj = node as Record<string, unknown>
      if (Object.prototype.hasOwnProperty.call(obj, seg.key)) {
        return applySegments(obj[seg.key], rest)
      }
    }
    return []
  }

  if (seg.type === 'index') {
    if (Array.isArray(node)) {
      const idx = seg.index < 0 ? node.length + seg.index : seg.index
      if (idx >= 0 && idx < node.length) {
        return applySegments(node[idx], rest)
      }
    }
    return []
  }

  if (seg.type === 'wildcard') {
    if (Array.isArray(node)) {
      return node.flatMap(item => applySegments(item, rest))
    }
    if (node !== null && typeof node === 'object') {
      return Object.values(node as Record<string, unknown>)
        .flatMap(v => applySegments(v, rest))
    }
    return []
  }

  if (seg.type === 'recursive') {
    const results: unknown[] = []
    if (seg.key === null) {
      results.push(...applySegments(node, rest))
    } else if (
      node !== null && typeof node === 'object' && !Array.isArray(node)
    ) {
      const obj = node as Record<string, unknown>
      if (Object.prototype.hasOwnProperty.call(obj, seg.key)) {
        results.push(...applySegments(obj[seg.key], rest))
      }
    }
    if (Array.isArray(node)) {
      for (const item of node) results.push(...applySegments(item, segments))
    } else if (node !== null && typeof node === 'object') {
      for (const val of Object.values(node as Record<string, unknown>)) {
        results.push(...applySegments(val, segments))
      }
    }
    return results
  }

  return []
}`

export default function JsonPathPage() {
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
          json / query
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          JSONパスクエリ
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          JSONPathクエリ（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'rgba(27,45,79,0.07)', padding: '1px 5px', borderRadius: '3px' }}>$.foo.bar</code>、<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'rgba(27,45,79,0.07)', padding: '1px 5px', borderRadius: '3px' }}>$..price</code>）をブラウザ内で実行・デバッグ。入力データはサーバーに送信されません。
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
        <JsonPathTool />
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
          <li>上部のテキストエリアにJSONをペーストしてください</li>
          <li>クエリ入力欄にJSONPathを入力します（例: <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px' }}>$.store.book[*].title</code>）</li>
          <li>サンプルクエリボタンをクリックするとクエリが自動入力されます</li>
          <li>「実行」ボタン（またはEnterキー）でクエリを実行します</li>
          <li>下部のターミナルにマッチ件数と各結果が表示されます</li>
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
          外部ライブラリを使わず、標準JavaScriptのみで実装したJSONPathエンジンのコアロジックです。
          パス式をセグメント列に分解し、再帰的にノードを辿ることで再帰検索（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'rgba(27,45,79,0.07)', padding: '1px 4px', borderRadius: '3px' }}>..</code>）も実現しています。
        </p>
        <pre style={{
          backgroundColor: '#111820',
          color: '#a8b8c8',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '12px',
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
        <SectionHeading title="JSONPath記法ガイド" count="03" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <UsageNote
            title="$ — ルートを表す記号"
            body="すべてのJSONPathは $ から始まります。$ 単体でJSONのルート全体を返します。XPathの / に相当し、絶対パスで書くのが基本です。"
          />
          <UsageNote
            title=".. — 再帰的検索（descendant-or-self）"
            body="$..price のように .. を使うと、JSON全体を再帰的に探索してキーにマッチするすべての値を返します。ネストの深さに関係なく一括収集できるため、APIレスポンス内の特定フィールドを全取得したいときに便利です。"
          />
          <UsageNote
            title="[*] — 配列またはオブジェクトの全要素"
            body="$.book[*] で配列の全要素を取得できます。$.store[*] のようにオブジェクトに使うと全値（book配列とbicycleオブジェクト）を返します。[*] の後ろにプロパティを続けて $.book[*].title のように使うのが典型的なパターンです。"
          />
          <UsageNote
            title="[-1] — 後ろからのインデックス"
            body="[-1] で配列の最後の要素、[-2] で後ろから2番目の要素を取得できます。Pythonのスライス記法と同様の感覚で使えます。ただしJSON Pathの仕様実装によって動作が異なる場合があるため、本番コードで使う際は動作確認を推奨します。"
          />
          <UsageNote
            title="このツールの実装範囲について"
            body="フィルタ式（$.book[?(@.price < 10)]）、スライス記法（[0:2]）、複数インデックス指定（[0,2]）は本実装では対応していません。これらが必要な場合はjsonpath-plusなどのライブラリを検討してください。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/json-formatter" label="JSONフォーマッター" />
          <RelatedToolBadge href="/json-to-ts" label="JSON to TypeScript" />
          <RelatedToolBadge href="/csv-json" label="CSV ↔ JSON変換" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/json-path"
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
