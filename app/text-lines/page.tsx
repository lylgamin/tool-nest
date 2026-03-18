import type { Metadata } from 'next'
import TextLinesTool from './_components/TextLinesTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'テキスト行操作ツール — 重複削除・ソート・逆順・番号付け',
  description: 'テキストの行単位操作をブラウザで完結。重複行の削除、昇順・降順ソート、行の逆順、行番号付け、空行削除、前後の空白トリムに対応。入力データはサーバーに送信されません。',
  openGraph: {
    title: 'テキスト行操作ツール | tool-nest',
    description: 'テキストの重複削除・ソート・逆順・番号付け・空行削除・トリムをブラウザ内で完結。',
    url: 'https://tool-nest.pages.dev/text-lines',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'テキスト行操作ツール',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'テキストの行単位操作（重複削除・ソート・逆順・番号付け・空行削除・トリム）をブラウザのみで実行するWebツール。データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/text-lines',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreLogicCode = `export function deduplicateLines(text: string, caseSensitive: boolean): string {
  if (!text) return ''
  const lines = text.split('\\n')
  const seen = new Set<string>()
  return lines.filter(line => {
    const key = caseSensitive ? line : line.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).join('\\n')
}

export function sortLines(text: string, order: 'asc' | 'desc', caseSensitive: boolean): string {
  if (!text) return ''
  const lines = text.split('\\n')
  const sorted = [...lines].sort((a, b) => {
    const ka = caseSensitive ? a : a.toLowerCase()
    const kb = caseSensitive ? b : b.toLowerCase()
    return ka < kb ? -1 : ka > kb ? 1 : 0
  })
  return (order === 'desc' ? sorted.reverse() : sorted).join('\\n')
}

export function reverseLines(text: string): string {
  if (!text) return ''
  return text.split('\\n').reverse().join('\\n')
}

export function addLineNumbers(text: string, start: number): string {
  if (!text) return ''
  return text.split('\\n').map((line, i) => \`\${i + start}: \${line}\`).join('\\n')
}

export function removeEmptyLines(text: string): string {
  if (!text) return ''
  return text.split('\\n').filter(line => line.trim() !== '').join('\\n')
}

export function trimLines(text: string): string {
  if (!text) return ''
  return text.split('\\n').map(line => line.trim()).join('\\n')
}`

export default function TextLinesPage() {
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
          text / lines
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          テキスト行操作ツール
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          テキストの行単位操作をブラウザで完結。重複削除・ソート・逆順・行番号付け・空行削除・前後空白トリムに対応。
          外部ライブラリ不使用、入力データはサーバーに送信されません。
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
        <TextLinesTool />
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
          <li>入力テキストエリアに操作したいテキストを貼り付けます</li>
          <li>必要に応じて「大文字小文字を区別する」チェックボックスを切り替えます（重複削除・ソートに適用）</li>
          <li>実行したい操作のボタンを押します</li>
          <li>右側の出力エリアに結果が表示されます</li>
          <li>「コピー」ボタンで出力結果をクリップボードにコピーできます</li>
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
          すべての操作は標準のJavaScriptのみで実装しています。
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'var(--teal-mid)', padding: '1px 5px', borderRadius: '3px' }}>String.prototype.split</code>・
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'var(--teal-mid)', padding: '1px 5px', borderRadius: '3px' }}>Array.prototype.sort</code>・
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'var(--teal-mid)', padding: '1px 5px', borderRadius: '3px' }}>Set</code>
          のみを使用。外部ライブラリ不要でそのままコピーして利用できます。
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
            title="ログファイルの重複行を削除する"
            body="大量のログファイルから同じエラーメッセージを1つにまとめたいときに便利です。「大文字小文字を区別する」をオンにして重複削除を実行すると、完全に同一の行のみが削除されます。"
          />
          <UsageNote
            title="単語リストをアルファベット順に並べる"
            body="辞書ファイルや用語集などの単語リストを五十音順・アルファベット順に整列するのに使えます。「大文字小文字を区別しない」設定にすると、大文字・小文字を混在させたリストもまとめて整列できます。"
          />
          <UsageNote
            title="CSVやTSVの前後空白を除去する"
            body="スプレッドシートからコピーしたデータには、各行の末尾にタブや空白が混入していることがあります。「トリム」操作で一括除去できます。ただし行内の空白は除去されないため、列の途中の空白を消したい場合は正規表現テスターを使ってください。"
          />
          <UsageNote
            title="行番号付けの開始番号"
            body="「番号付け」は常に 1 始まりで付番します。0 始まりや任意の番号から始めたい場合は、実装コードの addLineNumbers 関数の start 引数を変更してください。"
          />
          <UsageNote
            title="プライバシーについて"
            body="入力したテキストはブラウザ内のみで処理されます。サーバーには一切送信されないため、機密情報を含むログやコードも安全に操作できます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/text-diff" label="テキスト差分ツール" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/text-lines"
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
