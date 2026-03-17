import type { Metadata } from 'next'
import ByteConverterClient from './_components/ByteConverterClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'Byte単位変換 — B/KB/MB/GB/TB 換算',
  description: 'バイト（B）・キロバイト（KB）・メガバイト（MB）・ギガバイト（GB）・テラバイト（TB）を相互変換。SI（10進）とIEC（2進・1024）の両方に対応。',
  openGraph: {
    title: 'Byte単位変換 — B/KB/MB/GB/TB 換算 | tool-nest',
    description: 'バイト（B）・キロバイト（KB）・メガバイト（MB）・ギガバイト（GB）・テラバイト（TB）を相互変換。SI（10進）とIEC（2進・1024）の両方に対応。',
    url: 'https://tool-nest.pages.dev/byte-converter',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Byte単位変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'バイト（B）・キロバイト（KB）・メガバイト（MB）・ギガバイト（GB）・テラバイト（TB）を相互変換。SI（10進）とIEC（2進・1024）の両方に対応。',
  url: 'https://tool-nest.pages.dev/byte-converter',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB'

export type ConvertResult = {
  si: Record<Unit, string>   // SI単位系（10の累乗: 1KB=1000B）
  iec: Record<Unit, string>  // IEC単位系（2の累乗: 1KiB=1024B）
}

const SI_MULTIPLIERS: Record<Unit, number> = {
  B:  1,
  KB: 1_000,
  MB: 1_000_000,
  GB: 1_000_000_000,
  TB: 1_000_000_000_000,
}

const IEC_MULTIPLIERS: Record<Unit, number> = {
  B:  1,
  KB: 1_024,
  MB: 1_048_576,
  GB: 1_073_741_824,
  TB: 1_099_511_627_776,
}

function fmt(n: number): string {
  if (!isFinite(n)) return '—'
  if (n === 0) return '0'
  if (n >= 0.001 && n < 1e15) {
    const s = n.toPrecision(7)
    return parseFloat(s).toString()
  }
  return n.toExponential(4)
}

export function convertBytes(valueStr: string, unit: Unit): ConvertResult | null {
  const num = parseFloat(valueStr)
  if (!isFinite(num) || num < 0) return null

  const bytes    = num * SI_MULTIPLIERS[unit]
  const bytesIEC = num * IEC_MULTIPLIERS[unit]

  const units: Unit[] = ['B', 'KB', 'MB', 'GB', 'TB']
  const si  = {} as Record<Unit, string>
  const iec = {} as Record<Unit, string>

  for (const u of units) {
    si[u]  = fmt(bytes    / SI_MULTIPLIERS[u])
    iec[u] = fmt(bytesIEC / IEC_MULTIPLIERS[u])
  }

  return { si, iec }
}`

export default function ByteConverterPage() {
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
          calc / byte
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          Byte 単位変換
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          バイト（B）・キロバイト（KB）・メガバイト（MB）・ギガバイト（GB）・テラバイト（TB）を相互変換します。
          SI（10進・1KB=1000B）とIEC（2進・1KiB=1024B）の両方に対応しています。
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
        <ByteConverterClient />
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
          <li>数値入力欄に変換したい数値を入力してください</li>
          <li>入力単位ボタン（B / KB / MB / GB / TB）から基準となる単位を選択してください</li>
          <li>SI（10進）とIEC（2進）それぞれの換算結果がリアルタイムで表示されます</li>
          <li>プリセットボタン（1KB / 1MB / 1GB / 1TB）を使うと素早く一般的な値を入力できます</li>
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
          外部ライブラリ不要で純粋なTypeScriptのみで実装。乗数テーブルで各単位を定義し、変換と表示フォーマットを純粋関数として分離しています。そのままコピーして利用できます。
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
            title="SI（10進）とIEC（2進）の違い"
            body="SI単位系ではKBは1,000B、MBは1,000,000B（10の累乗）です。一方IEC単位系ではKiBは1,024B、MiBは1,048,576B（2の累乗）です。コンピューター科学では歴史的に1KB=1024Bとして扱われてきたため、両者を混同しやすい点に注意してください。"
          />
          <UsageNote
            title="HDDとOSで容量表示が異なる理由"
            body="ハードディスクメーカーはSI単位系（1GB=1,000,000,000B）で容量を表示します。一方WindowsはIEC単位系（1GiB=1,073,741,824B）で表示するため、1TBのHDDはWindowsでは約931GBと表示されます。macOS（10.6以降）はSI単位系を採用しているため「1TB」と表示します。"
          />
          <UsageNote
            title="ネットワーク速度との換算"
            body="通信速度のbps（bits per second）をファイル転送速度に換算するには8で割ります（1Byte=8bit）。例えば100Mbps回線の場合、理論上の転送速度は12.5MB/s（SI）です。実際にはプロトコルオーバーヘッドがあるためさらに遅くなります。"
          />
          <UsageNote
            title="プログラムでのメモリ・ストレージ計算"
            body="プログラム内でメモリサイズやファイルサイズを扱う場合、OSのAPIが返す値はバイト単位です。人間が読みやすい表示に変換する際はIEC単位系（1024の累乗）を使うのが一般的ですが、ストレージ容量の表示にはSI単位系を使うケースが増えています。用途に応じて明示的に区別してください。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="進数変換" href="/number-base" />
          <RelatedToolBadge label="ハッシュ生成" href="/hash" />
          <RelatedToolBadge label="文字数カウンター" href="/character-count" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/byte-converter"
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

function RelatedToolBadge({ label, href, disabled }: { label: string; href: string; disabled?: boolean }) {
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
        display: 'inline-block',
      }}
    >
      {label}
    </a>
  )
}
