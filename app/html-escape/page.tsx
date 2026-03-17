import type { Metadata } from 'next'
import HtmlEscapeToolClient from './_components/HtmlEscapeToolClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'HTMLエスケープ / アンエスケープ',
  description: 'HTMLの特殊文字（<>&"\'）をエンティティ形式にエスケープ・アンエスケープするWebツール。XSS対策や表示確認に。入力内容はサーバーに送信されません。',
  openGraph: {
    title: 'HTMLエスケープ / アンエスケープ | tool-nest',
    description: 'HTMLの特殊文字をエスケープ・アンエスケープ。XSS対策や表示確認に便利。',
    url: 'https://tool-nest.pages.dev/html-escape',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'HTMLエスケープ / アンエスケープ',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'HTMLの特殊文字（<>&"\'）をエンティティ形式にエスケープ・アンエスケープするWebツール。',
  url: 'https://tool-nest.pages.dev/html-escape',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export function escapeHtml(input: string): string {
  // In this order: & → &amp;  < → &lt;  > → &gt;  " → &quot;  ' → &#39;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function unescapeHtml(input: string): string {
  // Handle named entities and numeric/hex references
  // Unknown entities pass through unchanged
  return input.replace(
    /&(?:#(\\d+)|#x([0-9A-Fa-f]+)|([a-zA-Z]+));/g,
    (match, dec, hex, named) => {
      if (dec) return String.fromCodePoint(parseInt(dec, 10))
      if (hex) return String.fromCodePoint(parseInt(hex, 16))
      const namedEntities: Record<string, string> = {
        amp: '&', lt: '<', gt: '>', quot: '"', apos: "'"
      }
      return namedEntities[named] ?? match
    }
  )
}`

export default function HtmlEscapePage() {
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
          encoding / html
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          HTML エスケープ / アンエスケープ
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          HTMLの特殊文字（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>&lt; &gt; &amp; &quot; &#39;</code>）をエンティティ形式にエスケープ・アンエスケープします。XSS対策の確認や表示テストに便利です。
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
        <HtmlEscapeToolClient />
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
          <li>「エスケープ」または「アンエスケープ」タブを選択してください</li>
          <li>テキストエリアに入力すると、リアルタイムで変換結果が表示されます</li>
          <li>エスケープでは <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>&lt; &gt; &amp; &quot; &#39;</code> の5種類の特殊文字が変換されます</li>
          <li>アンエスケープでは名前付きエンティティ・十進数・十六進数参照に対応します</li>
          <li>「コピー」ボタンで変換結果をクリップボードにコピーできます</li>
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
          ブラウザ標準の <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>String.replace()</code> と
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}> String.fromCodePoint()</code> のみで実装。外部ライブラリ不要でそのままコピーして利用できます。
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
            title="XSS（クロスサイトスクリプティング）対策"
            body={'ユーザー入力をHTMLに埋め込む場合、<script>タグや onload 属性などを含む悪意ある文字列を無害化するためにエスケープが必要です。< > & " \' の5文字を必ずエスケープすることで基本的なXSSを防止できます。'}
          />
          <UsageNote
            title="テンプレートエンジンとの使い分け"
            body="ReactやVue、その他モダンなフレームワークでは変数展開時に自動でHTMLエスケープが行われます。dangerouslySetInnerHTML（React）やv-html（Vue）など、生のHTMLを挿入する機能を使う場合は手動でエスケープが必要です。"
          />
          <UsageNote
            title="&amp;の順序が重要"
            body="エスケープ処理では必ず & を最初に変換する必要があります。& を後から変換すると、すでに変換済みの &lt; や &gt; の & が再びエスケープされて &amp;lt; のように二重エスケープされてしまいます。"
          />
          <UsageNote
            title="数値文字参照（&#x7B; など）の利用"
            body="HTMLエンティティには &amp; &lt; などの名前付き参照に加え、&#123;（十進数）や&#x7B;（十六進数）のような数値文字参照があります。このツールのアンエスケープではどちらの形式にも対応しています。"
          />
          <UsageNote
            title="属性値のエスケープとクォート"
            body='HTML属性値をエスケープする場合、ダブルクォートで囲む属性には &quot; のエスケープが必須です。シングルクォートで囲む場合は &#39; のエスケープが必要です。安全のため両方ともエスケープしておくことを推奨します。'
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="URLエンコード" href="/url-encode" disabled />
          <RelatedToolBadge label="JSONフォーマッター" href="/json-formatter" disabled />
          <RelatedToolBadge label="ハッシュ生成" href="/hash" disabled />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/html-escape"
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
