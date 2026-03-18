import type { Metadata } from 'next'
import UnitConverterTool from './_components/UnitConverterTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: '単位変換ツール — 長さ・重量・温度・速度・面積をまとめて変換',
  description: '長さ・重量・温度・速度・面積の単位をブラウザ内で即時変換。mm/cm/m/km/inch/ft/mile、kg/g/lb/oz、°C/°F/K など全単位への一括変換結果を表示。入力データはサーバーに送信されません。',
  openGraph: {
    title: '単位変換ツール | tool-nest',
    description: '長さ・重量・温度・速度・面積の単位を即時変換。全単位への一括変換結果テーブルも表示。',
    url: 'https://tool-nest.pages.dev/unit-converter',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '単位変換ツール',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '長さ・重量・温度・速度・面積の単位をリアルタイムで変換するWebツール。全単位への一括変換結果も表示。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/unit-converter',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreLogicCode = `export type UnitCategory = 'length' | 'weight' | 'temperature' | 'speed' | 'area'

export type UnitDef = {
  id: string
  label: string
  toBase: (v: number) => number   // 基準単位へ変換
  fromBase: (v: number) => number // 基準単位から変換
}

// 長さの基準単位: メートル (m)
// 重量の基準単位: キログラム (kg)
// 温度の基準単位: 摂氏 (°C)
// 速度の基準単位: m/s
// 面積の基準単位: m²

export function convert(
  value: number,
  fromId: string,
  toId: string,
  category: UnitCategory
): number {
  const units = UNIT_DEFS[category]
  const from = units.find(u => u.id === fromId)
  const to   = units.find(u => u.id === toId)
  if (!from || !to) throw new Error(\`Unknown unit: \${fromId} or \${toId}\`)
  // 1. 入力値を基準単位に変換
  const baseValue = from.toBase(value)
  // 2. 基準単位から目的単位へ変換
  return to.fromBase(baseValue)
}`

export default function UnitConverterPage() {
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
          calc / unit
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          単位変換ツール
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          長さ・重量・温度・速度・面積の単位をリアルタイムで変換します。
          入力すると全単位への一括変換結果を一覧表示。入力データはサーバーに送信されません。
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
        <UnitConverterTool />
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
          <li>上部のタブからカテゴリ（長さ・重量・温度・速度・面積）を選択します</li>
          <li>「変換元」フィールドに数値を入力します</li>
          <li>変換元と変換先の単位をプルダウンから選択します</li>
          <li>入力と同時にリアルタイムで変換結果が表示されます</li>
          <li>下部のテーブルには、選択した変換元単位から全単位への変換結果が一覧表示されます</li>
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
          変換ロジックは「基準単位を経由する2段階変換」で実装しています。各カテゴリに基準単位（長さはm、重量はkg、温度は°C、速度はm/s、面積はm²）を設け、入力値を一旦基準単位に変換してから目的単位へ変換します。外部ライブラリは不要です。
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
            title="海外レシピの重量変換"
            body="英語レシピで使われるオンス (oz) やポンド (lb) をグラムに変換するのに便利です。例えば 8 oz = 226.8 g のように確認できます。"
          />
          <UsageNote
            title="気温の確認（°C / °F）"
            body="海外の天気予報や設定値で表示される華氏 (°F) を摂氏 (°C) に変換できます。100°F は約 37.8°C（体温に近い）、-40°F と -40°C は同一値です。"
          />
          <UsageNote
            title="速度変換（km/h ↔ mph ↔ knot）"
            body="海外ナビや航空・航海アプリで使われる mph やノットを km/h に変換できます。高速道路の 100 km/h は約 62.1 mph、1 knot = 1.852 km/h です。"
          />
          <UsageNote
            title="土地面積の変換（ha / acre）"
            body="不動産や農業分野で使われるヘクタール (ha) やエーカー (acre) を m² や km² に変換できます。1 ha = 10,000 m²、1 acre ≒ 4,047 m² です。"
          />
          <UsageNote
            title="浮動小数点精度について"
            body="JavaScriptの IEEE 754 浮動小数点演算を使用しているため、変換結果に微小な誤差が生じる場合があります（例：0.1 + 0.2 = 0.30000000000000004 の問題）。精密計算が必要な場合は専用ツールをご利用ください。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/byte-converter" label="Byte単位変換" />
          <RelatedToolBadge href="/number-base" label="進数変換" />
          <RelatedToolBadge href="/date-diff" label="日時差分計算" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/unit-converter"
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
