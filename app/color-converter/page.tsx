import type { Metadata } from 'next'
import ColorConverterClient from './_components/ColorConverterClient'

export const metadata: Metadata = {
  title: 'カラーコード変換 — HEX / RGB / HSL / HSV | tool-nest',
  description:
    'HEX・RGB・HSL・HSV のカラーコードをリアルタイムで相互変換。カラーピッカー付き。ブラウザのみで動作し、入力データはサーバーに送信されません。',
  openGraph: {
    title: 'カラーコード変換 — HEX / RGB / HSL / HSV | tool-nest',
    description:
      'HEX・RGB・HSL・HSV のカラーコードをリアルタイムで相互変換。カラーピッカー付き。',
    url: 'https://tool-nest.pages.dev/color-converter',
  },
}

const coreCode = `// HEX → RGB
function parseHex(hex) {
  const clean = hex.replace(/^#/, '').trim()
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    }
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    }
  }
  return null
}

// RGB → HSL
function rgbToHsl(r, g, b) {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255]
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  switch (max) {
    case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
    case gn: h = ((bn - rn) / d + 2) / 6; break
    default:  h = ((rn - gn) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

// RGB → HSV
function rgbToHsv(r, g, b) {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255]
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const v = max, d = max - min
  const s = max === 0 ? 0 : d / max
  let h = 0
  if (d !== 0) {
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
      case gn: h = ((bn - rn) / d + 2) / 6; break
      default:  h = ((rn - gn) / d + 4) / 6
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) }
}`

function SectionHeading({ title, count }: { title: string; count: string }) {
  return (
    <div style={{ margin: '2.5rem 0 1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-noto-serif), serif',
          fontSize: '1.15rem',
          fontWeight: 600,
          color: 'var(--ink)',
          margin: 0,
        }}>
          {title}
        </h2>
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: 'var(--ink-faint)',
        }}>
          {count}
        </span>
      </div>
      <div style={{ height: '1px', backgroundColor: 'var(--border-light)' }} />
    </div>
  )
}

function UsageNote({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border-light)',
      borderRadius: '6px',
      padding: '1rem 1.25rem',
      marginBottom: '0.75rem',
    }}>
      <div style={{
        fontFamily: 'var(--font-noto-sans), sans-serif',
        fontWeight: 500,
        fontSize: '0.875rem',
        color: 'var(--ink)',
        marginBottom: '0.4rem',
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: 'var(--font-noto-sans), sans-serif',
        fontSize: '0.85rem',
        color: 'var(--ink-mid)',
        lineHeight: 1.65,
      }}>
        {children}
      </div>
    </div>
  )
}

function RelatedToolBadge({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '11px',
        letterSpacing: '0.08em',
        padding: '6px 14px',
        border: '1px solid var(--border-light)',
        borderRadius: '3px',
        color: 'var(--ink-mid)',
        textDecoration: 'none',
      }}
    >
      {label}
    </a>
  )
}

export default function ColorConverterPage() {
  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>
      {/* ヘッダー */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--teal)',
          marginBottom: '0.5rem',
        }}>
          Color · CSS
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(1.9rem, 5vw, 2.8rem)',
          fontWeight: 600,
          color: 'var(--ink)',
          lineHeight: 1.15,
          margin: '0 0 0.6rem',
        }}>
          カラーコード変換
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '0.95rem',
          color: 'var(--ink-mid)',
          lineHeight: 1.7,
          margin: 0,
        }}>
          HEX・RGB・HSL・HSV を相互変換。カラーピッカーで直感的に色を選択でき、
          各形式をワンクリックでコピー可能。すべての処理はブラウザ内で完結します。
        </p>
      </div>

      {/* ツール本体 */}
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <ColorConverterClient />
      </div>

      {/* 使い方 */}
      <SectionHeading title="使い方" count="§ 01" />
      <ol style={{
        fontFamily: 'var(--font-noto-sans), sans-serif',
        fontSize: '0.9rem',
        color: 'var(--ink-mid)',
        lineHeight: 1.8,
        paddingLeft: '1.25rem',
        margin: 0,
      }}>
        <li>カラープレビューをクリックしてカラーピッカーを開き、色を選択します。</li>
        <li>HEX 入力欄に <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.85em' }}>#1a2b3c</code> や <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.85em' }}>#abc</code> 形式で直接入力することもできます。</li>
        <li>RGB / HSL / HSV の数値を個別に変更すると、他の形式もリアルタイムで更新されます。</li>
        <li>各行の「コピー」ボタンで CSS に貼り付け可能な文字列をクリップボードにコピーします。</li>
      </ol>

      {/* 実装コード */}
      <SectionHeading title="実装コード" count="§ 02" />
      <p style={{
        fontFamily: 'var(--font-noto-sans), sans-serif',
        fontSize: '0.85rem',
        color: 'var(--ink-mid)',
        marginBottom: '0.75rem',
      }}>
        外部ライブラリなし。Web 標準の算術演算のみで実装しています。
      </p>
      <pre style={{
        backgroundColor: '#111820',
        color: '#a8b8c8',
        borderRadius: '6px',
        padding: '1.25rem 1.5rem',
        overflowX: 'auto',
        fontSize: '12.5px',
        lineHeight: 1.65,
        fontFamily: 'var(--font-jetbrains), monospace',
        margin: 0,
      }}>
        <code>{coreCode}</code>
      </pre>

      {/* よくある使用例・注意点 */}
      <SectionHeading title="よくある使用例・注意点" count="§ 03" />

      <UsageNote title="CSS での使い分け">
        HTML/CSS では <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.9em' }}>color: #1a2b3c</code>（HEX）、
        <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.9em' }}>rgb(26, 43, 60)</code>、
        <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.9em' }}>hsl(210, 40%, 17%)</code> はすべて同じ色を表します。
        透明度を付けたい場合は <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.9em' }}>rgba()</code> や <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.9em' }}>hsla()</code>、
        または 8 桁 HEX（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '0.9em' }}>#1a2b3cff</code>）を使用します。
      </UsageNote>

      <UsageNote title="HSL の利点">
        HSL（色相・彩度・明度）は人間の直感に近い表現です。同系色を作るには H（色相）を固定したまま
        S・L を変化させるだけで済みます。デザインシステムのカラーパレット生成に特に有用です。
      </UsageNote>

      <UsageNote title="HSV と HSL の違い">
        HSV（色相・彩度・明度）は画像処理や色選択 UI でよく使われます。
        V=100% が「純色＋白混合なし」を意味するのに対し、HSL の L=50% が純色に相当します。
        Photoshop や多くのカラーピッカー UI 内部は HSV 系を使っています。
      </UsageNote>

      <UsageNote title="丸め誤差について">
        RGB → HSL → RGB のように変換を繰り返すと、整数丸めにより元の値と 1 程度ずれることがあります。
        これは仕様上の丸め誤差であり、実用上問題はありません。精度が必要な場合は HEX をマスター値として保持してください。
      </UsageNote>

      {/* 関連ツール */}
      <SectionHeading title="関連ツール" count="§ 04" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <RelatedToolBadge href="/contrast-checker" label="コントラスト比チェッカー" />
        <RelatedToolBadge href="/css-minify" label="CSS ミニファイ" />
        <RelatedToolBadge href="/html-escape" label="HTML エスケープ" />
        <RelatedToolBadge href="/number-base" label="進数変換" />
      </div>

      {/* GitHub */}
      <SectionHeading title="ソースコード" count="§ 05" />
      <p style={{
        fontFamily: 'var(--font-noto-sans), sans-serif',
        fontSize: '0.875rem',
        color: 'var(--ink-mid)',
        lineHeight: 1.7,
      }}>
        テストコードを含む実装全体は GitHub で公開しています。
        <a
          href="https://github.com/lylgamin/tool-nest/tree/main/app/color-converter"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--teal)', marginLeft: '0.4em' }}
        >
          lylgamin/tool-nest — app/color-converter ↗
        </a>
      </p>
    </main>
  )
}
