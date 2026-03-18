import type { Metadata } from 'next'
import JsonDiffTool from './_components/JsonDiffTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'JSON差分ツール — 2つのJSONをキー単位で比較',
  description: '2つのJSONオブジェクトをキー・パス単位で比較し、追加・削除・変更箇所を色分けして表示するWebツール。入力データはサーバーに送信されません。',
  openGraph: {
    title: 'JSON差分ツール | tool-nest',
    description: '2つのJSONをキー・パス単位で比較。追加・削除・変更をブラウザ内で完結。外部ライブラリ不要。',
    url: 'https://tool-nest.pages.dev/json-diff',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JSON差分ツール',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '2つのJSONをキー・パス単位で比較し、差分を色分け表示するWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/json-diff',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreLogicCode = `export type Result<T> = { ok: true; output: T } | { ok: false; error: string }

export type DiffEntry = {
  path: string
  type: 'added' | 'removed' | 'changed' | 'unchanged'
  left?: unknown
  right?: unknown
}

function diffValues(left: unknown, right: unknown, path: string, result: DiffEntry[]): void {
  if (left === right) {
    result.push({ path, type: 'unchanged', left, right })
    return
  }

  if (
    typeof left === 'object' && left !== null &&
    typeof right === 'object' && right !== null &&
    !Array.isArray(left) && !Array.isArray(right)
  ) {
    const leftObj = left as Record<string, unknown>
    const rightObj = right as Record<string, unknown>
    const keys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)])
    for (const key of keys) {
      const childPath = path ? \`\${path}.\${key}\` : key
      if (!(key in leftObj)) {
        result.push({ path: childPath, type: 'added', right: rightObj[key] })
      } else if (!(key in rightObj)) {
        result.push({ path: childPath, type: 'removed', left: leftObj[key] })
      } else {
        diffValues(leftObj[key], rightObj[key], childPath, result)
      }
    }
    return
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    const len = Math.max(left.length, right.length)
    for (let i = 0; i < len; i++) {
      const childPath = \`\${path}[\${i}]\`
      if (i >= left.length) {
        result.push({ path: childPath, type: 'added', right: right[i] })
      } else if (i >= right.length) {
        result.push({ path: childPath, type: 'removed', left: left[i] })
      } else {
        diffValues(left[i], right[i], childPath, result)
      }
    }
    return
  }

  result.push({ path, type: 'changed', left, right })
}

export function diffJson(leftStr: string, rightStr: string): Result<DiffEntry[]> {
  try {
    const left = JSON.parse(leftStr)
    const right = JSON.parse(rightStr)
    const result: DiffEntry[] = []
    diffValues(left, right, '', result)
    return { ok: true, output: result }
  } catch (e) {
    return { ok: false, error: \`JSONパースエラー: \${(e as Error).message}\` }
  }
}`

export default function JsonDiffPage() {
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
          format / diff
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          JSON差分ツール
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          2つのJSONオブジェクトをキー・パス単位で比較し、追加・削除・変更箇所を色分けして表示します。
          ネストしたオブジェクトや配列にも対応。入力データはサーバーに送信されません。
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
        <JsonDiffTool />
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
          <li>左側（before）に変更前のJSONを入力します</li>
          <li>右側（after）に変更後のJSONを入力します</li>
          <li>「差分を計算」ボタンを押すと、キー・パス単位の差分が一覧表示されます</li>
          <li>緑色（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'rgba(46,200,128,0.12)', padding: '1px 5px', borderRadius: '3px' }}>+</code>）が追加、赤色（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'rgba(200,80,80,0.12)', padding: '1px 5px', borderRadius: '3px' }}>-</code>）が削除、黄色（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'rgba(200,160,80,0.12)', padding: '1px 5px', borderRadius: '3px' }}>~</code>）が値の変更です</li>
          <li>パス列はドット記法（例: <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px' }}>user.address.city</code>）や配列インデックス（例: <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px' }}>items[2]</code>）で表示されます</li>
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
          コアロジックは再帰的な深さ優先探索でJSONを走査しています。
          オブジェクト・配列・プリミティブ値を型判別しながら差分エントリを生成します。
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
            title="APIレスポンスの変更確認"
            body="バックエンドのAPIレスポンスが仕様変更されたとき、変更前後のレスポンスをここに貼り付けると、追加・削除・変更されたフィールドを一覧で確認できます。"
          />
          <UsageNote
            title="設定ファイルの比較"
            body="JSON形式の設定ファイル（package.json、tsconfig.json など）を比較するのに便利です。本番環境と開発環境の設定差異を素早く把握できます。"
          />
          <UsageNote
            title="キー順序の違いは無視"
            body="このツールはキーの順序に関係なく、同じパスに同じ値があれば unchanged として扱います。<code style='font-family:monospace;font-size:12px;background:rgba(0,0,0,0.08);padding:1px 4px;border-radius:3px'>{&quot;a&quot;:1,&quot;b&quot;:2}</code> と <code style='font-family:monospace;font-size:12px;background:rgba(0,0,0,0.08);padding:1px 4px;border-radius:3px'>{&quot;b&quot;:2,&quot;a&quot;:1}</code> は差分なしと判定されます。"
          />
          <UsageNote
            title="配列の比較はインデックスベース"
            body="配列の比較はインデックス（位置）ベースで行います。配列の要素が並び替えられた場合、全要素が changed として表示される場合があります。配列の順序変化を正確に検出したい場合は、並び替え後に比較することをお勧めします。"
          />
          <UsageNote
            title="プライバシーについて"
            body="入力したJSONはブラウザ内のみで処理されます。サーバーには一切送信されないため、認証情報や個人情報を含むJSONも安全に比較できます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/json-formatter" label="JSONフォーマッター" />
          <RelatedToolBadge href="/json-path" label="JSONパスクエリ" />
          <RelatedToolBadge href="/text-diff" label="テキスト差分ツール" />
          <RelatedToolBadge href="/json-to-ts" label="JSON → TypeScript型生成" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/json-diff"
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
