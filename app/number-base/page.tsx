import type { Metadata } from 'next'
import NumberBaseClient from './_components/NumberBaseClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: '進数変換 — 2進・8進・10進・16進',
  description: '2進数・8進数・10進数・16進数を相互変換するWebツール。ビット演算や組み込み開発のデバッグに。入力内容はサーバーに送信されません。',
  openGraph: {
    title: '進数変換 — 2進・8進・10進・16進 | tool-nest',
    description: '2進数・8進数・10進数・16進数を相互変換。ビット演算や組み込み開発のデバッグに。',
    url: 'https://tool-nest.pages.dev/number-base',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '進数変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '2進数・8進数・10進数・16進数を相互変換するWebツール。ビット演算や組み込み開発のデバッグに。',
  url: 'https://tool-nest.pages.dev/number-base',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export type Base = 2 | 8 | 10 | 16

export type ConvertResult =
  | { ok: true; bin: string; oct: string; dec: string; hex: string }
  | { ok: false; error: string }

export function convertBase(value: string, fromBase: Base): ConvertResult {
  const trimmed = value.trim()
  if (!trimmed) return { ok: false, error: '' }

  const validChars: Record<Base, RegExp> = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9a-fA-F]+$/,
  }
  if (!validChars[fromBase].test(trimmed)) {
    return { ok: false, error: \`\${fromBase}進数として無効な文字が含まれています\` }
  }

  const decimal = parseInt(trimmed, fromBase)
  if (!Number.isSafeInteger(decimal)) {
    return { ok: false, error: '数値が大きすぎます（2^53-1 を超えています）' }
  }

  return {
    ok: true,
    bin: decimal.toString(2),
    oct: decimal.toString(8),
    dec: decimal.toString(10),
    hex: decimal.toString(16).toUpperCase(),
  }
}`

export default function NumberBasePage() {
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
          convert / number-base
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          進数変換
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          2進数・8進数・10進数・16進数を相互変換します。ビット演算・組み込み開発・ネットワークアドレス計算など幅広い用途に対応しています。
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
        <NumberBaseClient />
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
          <li>タブで入力する進数（2進 / 8進 / 10進 / 16進）を選択してください</li>
          <li>入力欄に値を入力すると、リアルタイムで全進数への変換結果が表示されます</li>
          <li>各行の「コピー」ボタンで変換結果をクリップボードにコピーできます</li>
          <li>16進数は大文字（A–F）で出力されます。先頭の <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>0x</code> / <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>0b</code> / <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>0o</code> は参考表示です（コピー時は含まれません）</li>
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
          ブラウザ標準の <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>parseInt</code> と <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>Number.prototype.toString</code> のみで実装。外部ライブラリ不要でそのままコピーして利用できます。
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
            title="ビット演算のデバッグ"
            body="JavaScriptやCなどでビット演算（AND, OR, XOR, シフト）を行う際、2進数での確認が欠かせません。例えば 0xFF & 0x0F = 0x0F（255 & 15 = 15）を視覚的に確認する際、このツールで各値の2進数表現を比較することで論理の誤りを見つけやすくなります。"
          />
          <UsageNote
            title="組み込み開発・レジスタ設定"
            body="マイコンのレジスタ設定はデータシートで16進数（例: 0x3C）として記載されることが多いですが、実際のビット意味を理解するには2進数への変換が必要です。また、8進数はUnixのファイルパーミッション（chmod 755 など）の確認にも使われます。"
          />
          <UsageNote
            title="安全に扱える数値の上限"
            body="このツールはJavaScriptの Number 型を使用しているため、2^53-1（9007199254740991）を超える値は正確に扱えません。64ビット整数が必要な場合は BigInt を使った実装を検討してください。大きな数値を入力するとエラーメッセージが表示されます。"
          />
          <UsageNote
            title="16進数の大文字・小文字"
            body="このツールでは16進数の出力は大文字（A–F）で統一しています。CSSのカラーコード（#ff0000）やシェルスクリプトでは小文字が使われることもありますが、値としては同一です。コピーした後に必要に応じて変換してください。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="ハッシュ生成" href="/hash" />
          <RelatedToolBadge label="UUID生成" href="/uuid-generator" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/number-base"
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
