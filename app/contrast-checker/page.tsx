import type { Metadata } from 'next'
import ContrastCheckerTool from './_components/ContrastCheckerTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'コントラスト比チェッカー',
  description: 'テキスト色と背景色のコントラスト比を計算し、WCAG 2.1のAA・AAAレベルを満たすか判定します。アクセシビリティ対応の確認に。',
  openGraph: {
    title: 'コントラスト比チェッカー | tool-nest',
    description: 'テキスト色と背景色のコントラスト比をブラウザ内で計算。WCAG 2.1 AA/AAAレベル判定対応。',
    url: 'https://tool-nest.pages.dev/contrast-checker',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'コントラスト比チェッカー',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'テキスト色と背景色のコントラスト比を計算し、WCAG 2.1のアクセシビリティ基準（AA/AAA）を満たすか判定するWebツール。',
  url: 'https://tool-nest.pages.dev/contrast-checker',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `/** sRGB channel linearization */
function linearize(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

/** Relative luminance (WCAG 2.x) */
export function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

/** Contrast ratio between two luminance values */
export function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/** Parse hex, rgb(), rgba() color strings to 0-255 components */
export function parseColor(input: string): ParseResult {
  const s = input.trim()
  const hex3 = s.match(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i)
  if (hex3) {
    return { ok: true, r: parseInt(hex3[1]+hex3[1],16),
             g: parseInt(hex3[2]+hex3[2],16), b: parseInt(hex3[3]+hex3[3],16) }
  }
  const hex6 = s.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (hex6) {
    return { ok: true, r: parseInt(hex6[1],16),
             g: parseInt(hex6[2],16), b: parseInt(hex6[3],16) }
  }
  const rgb = s.match(/rgba?\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)/)
  if (rgb) {
    return { ok: true, r: parseInt(rgb[1]), g: parseInt(rgb[2]), b: parseInt(rgb[3]) }
  }
  return { ok: false, error: \`色の形式が無効です: "\${input}"\` }
}`

export default function ContrastCheckerPage() {
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
          color / accessibility
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          コントラスト比チェッカー
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          テキスト色と背景色のコントラスト比を計算し、WCAG 2.1のAA・AAAレベルを満たすか判定します。アクセシビリティ対応の確認に。
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
        <ContrastCheckerTool />
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
          <li>「テキスト色」にテキストのカラーコードを入力します（例: #19161a, rgb(25,22,26)）</li>
          <li>「背景色」に背景のカラーコードを入力します（例: #f3efe8）</li>
          <li>カラーピッカー（左の色ボックス）をクリックしてGUIで色を選ぶこともできます</li>
          <li>コントラスト比とWCAG 2.1の合否判定がリアルタイムで表示されます</li>
          <li>下部のプレビューで実際のテキスト表示を確認できます</li>
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
          WCAG 2.1に準拠したコントラスト比の計算は、sRGB線形化と相対輝度の計算に基づいています。外部ライブラリは不要で、ブラウザ標準のJavaScriptのみで実装しています。
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
            title="WCAG 2.1 の基準値"
            body="通常テキスト（18px未満・非ボールド）はAA合格に4.5:1以上、AAA合格に7:1以上が必要です。大きなテキスト（18px以上または14px以上のボールド）はAA合格に3:1以上、AAA合格に4.5:1以上です。"
          />
          <UsageNote
            title="UIコンポーネントへの適用"
            body="ボタンの枠線・アイコン・フォームの境界線など、テキスト以外のUI要素にも3:1以上のコントラスト比が求められます（WCAG 2.1 成功基準 1.4.11）。背景に対して十分なコントラストを確保してください。"
          />
          <UsageNote
            title="アルファ・透明度の扱い"
            body="このツールは不透明色（アルファ値なし）のみ対応しています。rgba()で透明度を指定した場合、RGBの値のみを使用して計算します。半透明の色は実際の表示と異なる場合があります。"
          />
          <UsageNote
            title="デザイントークンへの活用"
            body="デザインシステムのカラートークンを定義する際に、事前にコントラスト比を確認する習慣をつけると、アクセシビリティ対応コストを後から削減できます。特にライトモード・ダークモードの両方で基準を満たすか確認することが重要です。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/color-converter" label="カラー変換" disabled />
          <RelatedToolBadge href="/password-strength" label="パスワード強度チェック" disabled />
          <RelatedToolBadge href="/html-escape" label="HTMLエスケープ" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/contrast-checker"
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
