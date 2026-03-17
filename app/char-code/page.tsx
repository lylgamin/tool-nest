import type { Metadata } from 'next'
import CharCodeTool from './_components/CharCodeTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: '文字コード変換 | Unicode / UTF-8 / HTML実体参照',
  description: '文字とUnicode / UTF-8バイト列 / HTML実体参照を相互変換するWebツール。U+XXXX形式・10進・16進に対応。サロゲートペアや絵文字も解析できます。入力内容はサーバーに送信されません。',
  openGraph: {
    title: '文字コード変換 | tool-nest',
    description: '文字 ↔ Unicode / UTF-8 / HTML実体参照を相互変換。U+XXXX・10進・16進入力対応。',
    url: 'https://tool-nest.pages.dev/char-code',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '文字コード変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '文字とUnicode / UTF-8バイト列 / HTML実体参照を相互変換するWebツール。',
  url: 'https://tool-nest.pages.dev/char-code',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export interface CharInfo {
  char: string
  codePoint: number     // Unicodeコードポイント（10進）
  codePointHex: string  // U+XXXX 形式
  utf8Bytes: string     // 例: "E3 81 82"
  utf16le: string       // 例: "42 30"
  htmlEntity: string    // 例: "&#12354;" or "&amp;"
  htmlEntityHex: string // 例: "&#x3042;"
  category: string
}

// 文字列の各文字を解析（サロゲートペア対応）
export function analyzeString(input: string): CharInfo[] {
  const chars = [...input].slice(0, 20)  // spread でコードポイント単位に分解
  return chars.map(char => {
    const cp = char.codePointAt(0) ?? 0
    const utf8 = new TextEncoder().encode(char)
    return {
      char,
      codePoint: cp,
      codePointHex: 'U+' + cp.toString(16).toUpperCase().padStart(4, '0'),
      utf8Bytes: Array.from(utf8)
        .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
        .join(' '),
      // ... UTF-16LE, HTML entity など
    }
  })
}

// U+XXXX / 10進 / 0x16進 → コードポイント解析
export function parseCodePoint(input: string): number | null {
  const s = input.trim()
  const uPlus = s.match(/^[Uu]\\+([0-9A-Fa-f]{1,6})$/)
  if (uPlus) return parseInt(uPlus[1], 16)
  const hex0x = s.match(/^0[Xx]([0-9A-Fa-f]+)$/)
  if (hex0x) return parseInt(hex0x[1], 16)
  if (/^\\d+$/.test(s)) return parseInt(s, 10)
  return null
}`

export default function CharCodePage() {
  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
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
          text / encoding
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          文字コード変換
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          文字を入力すると Unicode コードポイント・UTF-8バイト列・UTF-16LE・HTML実体参照をリアルタイムで表示します。
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>U+XXXX</code> 形式・10進数・16進数からの逆引きにも対応しています。
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
        <CharCodeTool />
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
          <li>上部のテキストエリアに解析したい文字を入力してください（最大20文字）</li>
          <li>入力するたびに各文字のUnicode・UTF-8・UTF-16LE・HTML実体参照が即座に表示されます</li>
          <li>絵文字（😀）や日本語（あいう）など、あらゆるUnicode文字に対応しています</li>
          <li>下部の「コードポイントから変換」では <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>U+3042</code>、<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>12354</code>、<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>0x3042</code> の3形式を入力できます</li>
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
          ブラウザ標準の{' '}
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>TextEncoder</code>・
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>String.fromCodePoint()</code>・
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>codePointAt()</code>{' '}
          のみで実装しています。外部ライブラリ不要でそのままコピーして利用できます。
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
            title="UTF-8 エンコードとバイト数の把握"
            body="ASCII文字（U+0000〜U+007F）はUTF-8で1バイト、日本語のひらがな・漢字（U+0800〜U+FFFF）は3バイトになります。データベースのフィールド長やHTTPヘッダーのbyte計算をする際にこのツールで確認できます。"
          />
          <UsageNote
            title="サロゲートペアと絵文字"
            body="JavaScriptの文字列はUTF-16エンコードを使用します。U+10000以上の文字（多くの絵文字・一部の漢字）は2つのコードユニット（サロゲートペア）で表現されます。このためstr.lengthは文字数と異なる場合があります。このツールは[...str]スプレッド構文でコードポイント単位に正しく分解しています。"
          />
          <UsageNote
            title="HTML実体参照の使い分け"
            body="&amp; &lt; &gt; &quot; &apos; の5文字はXSS対策として必ずエスケープが必要です。&nbsp; は改行禁止スペース（U+00A0）で通常の半角スペースとは別物です。&copy; &reg; &trade; などの記号は名前付き参照か数値参照（&#169; / &#xA9;）を使えます。"
          />
          <UsageNote
            title="UTF-16LE とバイトオーダー"
            body="Windowsのテキストファイルや一部のAPIはUTF-16LE（リトルエンディアン）を使用します。例えば 'A'（U+0041）はUTF-16LEでは 0x41 0x00 の2バイトになります。JavaScriptのcharCodeAt()は常にUTF-16コードユニットを返します。"
          />
          <UsageNote
            title="U+FFFD 文字化け・置換文字"
            body="U+FFFD（□に?）はUnicodeの置換文字で、デコード不可能なバイトシーケンスを受け取った際に表示されます。文字化けの調査では、どのバイト列がU+FFFDに置換されているかを追うとエンコーディングの不一致を特定できます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="HTMLエスケープ" href="/html-escape" />
          <RelatedToolBadge label="URLエンコード" href="/url-encode" />
          <RelatedToolBadge label="Base64エンコード" href="/base64" />
        </div>
      </section>

      {/* ソースコード */}
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/char-code"
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

function RelatedToolBadge({ label, href }: { label: string; href: string }) {
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
