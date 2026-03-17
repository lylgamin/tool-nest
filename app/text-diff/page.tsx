import type { Metadata } from 'next'
import TextDiffTool from './_components/TextDiffTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'テキスト差分ツール — 2つのテキストを行単位で比較',
  description: '2つのテキストを行単位で比較し、追加・削除・変更箇所をハイライト表示するWebツール。LCSアルゴリズム使用。入力データはサーバーに送信されません。',
  openGraph: {
    title: 'テキスト差分ツール | tool-nest',
    description: '2つのテキストを行単位で比較。追加・削除をブラウザ内で完結。LCSアルゴリズム実装。',
    url: 'https://tool-nest.pages.dev/text-diff',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'テキスト差分ツール',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '2つのテキストを行単位で比較し、差分をハイライト表示するWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/text-diff',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreLogicCode = `export type DiffKind = 'equal' | 'added' | 'removed'
export interface DiffLine {
  kind: DiffKind
  lineOld: number | null  // 元テキストでの行番号（1始まり）
  lineNew: number | null  // 新テキストでの行番号（1始まり）
  content: string
}

/** LCS（最長共通部分列）アルゴリズムを使った行単位の差分計算 */
export function diffLines(oldText: string, newText: string): DiffLine[] {
  if (oldText === '' && newText === '') return []

  const oldLines = oldText === '' ? [] : oldText.split('\\n')
  const newLines = newText === '' ? [] : newText.split('\\n')
  const m = oldLines.length
  const n = newLines.length

  // DPテーブルを構築（O(m*n) 時間・空間計算量）
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  )
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // バックトラックで差分を生成
  const result: DiffLine[] = []
  let i = m
  let j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.push({ kind: 'equal', lineOld: i, lineNew: j, content: oldLines[i - 1] })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ kind: 'added', lineOld: null, lineNew: j, content: newLines[j - 1] })
      j--
    } else {
      result.push({ kind: 'removed', lineOld: i, lineNew: null, content: oldLines[i - 1] })
      i--
    }
  }
  return result.reverse()
}`

export default function TextDiffPage() {
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
          text / compare
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          テキスト差分ツール
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          2つのテキストを行単位で比較し、追加・削除・変更箇所をハイライト表示します。
          LCS（最長共通部分列）アルゴリズムで実装。入力データはサーバーに送信されません。
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
        <TextDiffTool />
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
          <li>左側（旧テキスト）に変更前のテキストを入力します</li>
          <li>右側（新テキスト）に変更後のテキストを入力します</li>
          <li>「差分を計算」ボタンを押すと、2つのテキストの差分が表示されます</li>
          <li>緑色の行（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'rgba(46,200,128,0.12)', padding: '1px 5px', borderRadius: '3px' }}>+</code>）が追加行、赤色の行（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'rgba(200,80,80,0.12)', padding: '1px 5px', borderRadius: '3px' }}>-</code>）が削除行です</li>
          <li>左側の数字が旧テキストの行番号、右側の数字が新テキストの行番号です</li>
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
          コアロジックはLCS（Longest Common Subsequence）アルゴリズムをJavaScriptのみで実装しています。
          DPテーブルを構築後、バックトラックで差分を復元します。外部ライブラリは不要なので、そのままコピーしてご利用いただけます。
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
            title="コードのレビューに使う"
            body="プルリクエストのレビュー前に、変更前後のコードをここに貼り付けて差分を確認できます。ファイル全体をコピーして比較することで、細かい変更点を見逃しにくくなります。"
          />
          <UsageNote
            title="設定ファイルの比較"
            body="サーバーやアプリの設定ファイルを比較するのに便利です。本番環境と開発環境の設定差異を素早く把握できます。"
          />
          <UsageNote
            title="LCSアルゴリズムの特性"
            body="このツールはLCS（最長共通部分列）アルゴリズムを使っています。行が完全に一致するかどうかで equal / added / removed を判定します。行内の細かい文字差分（インライン差分）は表示されません。空白の違いも1行の変更として扱われます。"
          />
          <UsageNote
            title="大きなテキストの注意点"
            body="LCSアルゴリズムは O(m×n) の時間・空間計算量があります。行数が数千行を超える大きなファイルを比較すると、ブラウザのメモリ消費が増加する場合があります。数百行以内の比較を推奨します。"
          />
          <UsageNote
            title="プライバシーについて"
            body="入力したテキストはブラウザ内のみで処理されます。サーバーには一切送信されないため、機密情報を含むコードや設定ファイルも安全に比較できます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/character-count" label="文字数カウンター" />
          <RelatedToolBadge href="/regex-tester" label="正規表現テスター" />
          <RelatedToolBadge href="/json-formatter" label="JSONフォーマッター" />
          <RelatedToolBadge href="/text-to-table" label="テキスト → テーブル変換" disabled />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/text-diff"
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
