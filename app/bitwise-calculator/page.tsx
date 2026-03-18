import type { Metadata } from 'next'
import BitwiseCalculatorTool from './_components/BitwiseCalculatorTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'ビット演算計算機 — AND/OR/XOR/NOT/シフト演算をブラウザで',
  description: 'AND・OR・XOR・NOT・左右シフトなどのビット演算をブラウザ上で計算。2進数・8進数・10進数・16進数で結果を表示。入力データはサーバーに送信されません。',
  openGraph: {
    title: 'ビット演算計算機 | tool-nest',
    description: 'AND/OR/XOR/NOT/LSHIFT/RSHIFTをブラウザ内で計算。BIN・OCT・DEC・HEXで結果表示。',
    url: 'https://tool-nest.pages.dev/bitwise-calculator',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ビット演算計算機',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'AND・OR・XOR・NOT・左右シフトなどのビット演算をブラウザ上で計算するWebツール。2進数・8進数・10進数・16進数で入力・出力できます。データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/bitwise-calculator',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreLogicCode = `export type BitwiseOp = 'AND' | 'OR' | 'XOR' | 'NOT' | 'LSHIFT' | 'RSHIFT'

export function bitwiseCalc(op: BitwiseOp, a: number, b: number): number {
  switch (op) {
    case 'AND':    return (a & b) >>> 0
    case 'OR':     return (a | b) >>> 0
    case 'XOR':    return (a ^ b) >>> 0
    case 'NOT':    return (~a) >>> 0
    case 'LSHIFT': return (a << b) >>> 0
    case 'RSHIFT': return (a >>> b)
  }
}

export function toBinaryStr(n: number, bits: 8 | 16 | 32 = 32): string {
  const unsigned = n >>> 0
  return unsigned.toString(2).padStart(bits, '0')
}

export function toHexStr(n: number): string {
  return (n >>> 0).toString(16).toUpperCase().padStart(8, '0')
}

export function parseIntInput(s: string, base: 2 | 8 | 10 | 16): number | null {
  const trimmed = s.trim()
  if (!trimmed) return null
  const n = parseInt(trimmed, base)
  if (isNaN(n)) return null
  return n >>> 0
}`

export default function BitwiseCalculatorPage() {
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
          calc / bitwise
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          ビット演算計算機
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          AND・OR・XOR・NOT・左右シフトなどのビット演算をブラウザ上で計算します。
          2進数・8進数・10進数・16進数で入力でき、結果はすべての基数で表示されます。入力データはサーバーに送信されません。
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
        <BitwiseCalculatorTool />
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
          <li>「入力基数」で値の表記（2進数/8進数/10進数/16進数）を選択します</li>
          <li>「演算子」ボタンで実行したいビット演算（AND/OR/XOR/NOT/LSHIFT/RSHIFT）を選びます</li>
          <li>値Aを入力します（例：10進数モードなら <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>255</code>）</li>
          <li>NOT・RSHIFT 以外の演算では値Bも入力します</li>
          <li>「計算する」ボタンを押すと、BIN・OCT・DEC・HEX の4形式で結果が表示されます</li>
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
          コアロジックはJavaScript組み込みのビット演算子と <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>{`>>> 0`}</code> による符号なし32bit整数変換のみで実装しています。外部ライブラリ不要で、そのままコピーしてご利用いただけます。
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
            title="フラグ管理・パーミッションのデバッグ"
            body="複数のフラグをビットフィールドで管理するコードのデバッグに使えます。例えばLinuxのファイルパーミッション（755 = 0b111_101_101）を8進数モードで入力し、ANDマスクを使って特定ビットを確認できます。"
          />
          <UsageNote
            title="ネットワークのサブネット計算"
            body="IPアドレスとサブネットマスクのAND演算でネットワークアドレスを求める用途に使えます。例：192.168.1.100（10進数）AND 255.255.255.0（10進数）= ネットワークアドレス。各オクテットを個別に計算してご利用ください。"
          />
          <UsageNote
            title=">>> 0 による符号なし32bit整数の扱い"
            body="JavaScriptのビット演算は内部で符号付き32bit整数として処理されますが、このツールでは <code style='font-family:monospace;font-size:12px;background:rgba(27,45,79,0.1);padding:1px 4px;border-radius:3px'>>>> 0</code>（ゼロ埋め右シフト）を使って常に符号なし32bit整数（0〜4294967295）として扱います。そのため NOT 演算の結果も正の値になります。"
          />
          <UsageNote
            title="LSHIFT の桁あふれ"
            body="左シフト（LSHIFT）は32bit整数の範囲内で動作します。32以上シフトすると結果が 0 になる場合があります。例：1 &lt;&lt; 31 = 2147483648（符号なし32bit最大の半分）、1 &lt;&lt; 32 = 0。"
          />
          <UsageNote
            title="16進数入力のポイント"
            body="16進数モードでは 'A'〜'F' を大文字・小文字どちらでも入力できます。'0x' プレフィックスは不要です。例：FF → 255、DEADBEEF → 3735928559。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/number-base" label="進数変換" />
          <RelatedToolBadge href="/byte-converter" label="Byte単位変換" />
          <RelatedToolBadge href="/hash" label="ハッシュ生成" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/bitwise-calculator"
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
