import type { Metadata } from 'next'
import CharacterCountTool from './_components/CharacterCountTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: '文字数カウンター',
  description: 'テキストの文字数・バイト数・単語数・行数をリアルタイムで確認できます。日本語（UTF-8）のバイト数にも対応。入力内容はサーバーに送信されません。',
  openGraph: {
    title: '文字数カウンター | tool-nest',
    description: 'テキストの文字数・バイト数・単語数・行数をリアルタイム計測。日本語UTF-8対応。',
    url: 'https://tool-nest.pages.dev/character-count',
  },
}

// JSON-LD structured data (static constant — no user input involved)
const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '文字数カウンター',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'テキストの文字数・バイト数・単語数・行数をリアルタイムで計測するWebツール。日本語のUTF-8バイト数計算に対応。',
  url: 'https://tool-nest.pages.dev/character-count',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export type CountStats = {
  chars: number
  charsNoSpace: number
  bytes: number
  lines: number
  words: number
}

export function countStats(text: string): CountStats {
  return {
    chars: text.length,
    charsNoSpace: text.replace(/\\s/g, '').length,
    bytes: new TextEncoder().encode(text).length,
    lines: text === '' ? 0 : text.split('\\n').length,
    words: text.trim() === '' ? 0 : text.trim().split(/\\s+/).length,
  }
}`

export default function CharacterCountPage() {
  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
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
          text / string
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          文字数カウンター
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          文字数・バイト数・単語数・行数をリアルタイムで確認できます。日本語（UTF-8）のバイト数にも対応しています。
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
        <CharacterCountTool />
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
          <li>テキストエリアに調べたいテキストを入力またはペーストしてください</li>
          <li>文字数・空白を除いた文字数・バイト数・単語数・行数がリアルタイムで表示されます</li>
          <li>「クリア」ボタンでテキストをリセットできます</li>
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
          コアのロジックはブラウザ標準の <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>TextEncoder</code> API だけで実装しています。外部ライブラリは不要なので、そのままコピーしてご利用いただけます。
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
            title="SNS投稿の文字数制限チェック"
            body="X（旧Twitter）は140文字制限で、日本語・英語ともに1文字としてカウントされます。投稿前に「文字数」の数値で確認できます。"
          />
          <UsageNote
            title="データベースのカラムサイズ確認"
            body="MySQLのVARCHAR(255)はバイト数ではなく文字数で制限されます。ただしutf8mb4では1文字最大4バイトを消費するため、バイト数も合わせて確認しておくと安心です。"
          />
          <UsageNote
            title="バイト数と文字数の違い"
            body="ASCII文字（英数字）は1文字あたり1バイト、日本語（ひらがな・カタカナ・漢字）はUTF-8で1文字あたり3バイト、絵文字は1文字あたり4バイトを使います。"
          />
          <UsageNote
            title="単語数カウントの注意"
            body="このツールでは、空白文字（スペース・タブ・改行）で区切られたまとまりを1単語としてカウントします。日本語は単語の境界が明確でないため、形態素解析（意味的な単語分割）には対応していません。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="JSONフォーマッター" disabled />
          <RelatedToolBadge label="Base64変換" disabled />
          <RelatedToolBadge label="URLエンコード" disabled />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/character-count"
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

function RelatedToolBadge({ label, disabled }: { label: string; disabled?: boolean }) {
  return (
    <span style={{
      fontFamily: 'var(--font-jetbrains), monospace',
      fontSize: '11px',
      letterSpacing: '0.05em',
      color: disabled ? 'var(--ink-faint)' : 'var(--navy)',
      border: '1px solid var(--border-light)',
      borderRadius: '3px',
      padding: '5px 10px',
      cursor: disabled ? 'default' : 'pointer',
    }}>
      {disabled ? `${label} — 準備中` : label}
    </span>
  )
}
