import type { Metadata } from 'next'
import ZenkakuHankakuClient from './_components/ZenkakuHankakuClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: '全角・半角変換',
  description: '全角・半角文字を相互変換するWebツール。英数字・記号・カタカナ（濁音・半濁音含む）に対応。入力内容はサーバーに送信されません。',
  openGraph: {
    title: '全角・半角変換 | tool-nest',
    description: '英数字・記号・カタカナの全角⇔半角変換。ブラウザ上で即時変換、外部送信なし。',
    url: 'https://tool-nest.pages.dev/zenkaku-hankaku',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '全角・半角変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '英数字・記号・カタカナ（濁音・半濁音含む）の全角⇔半角変換ツール。',
  url: 'https://tool-nest.pages.dev/zenkaku-hankaku',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `// 全角ASCII → 半角 (U+FF01-FF5E → U+0021-007E)
export function toHankaku(input: string): string {
  return input
    .replace(/[\\uFF01-\\uFF5E]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
    )
    .replace(/\\u3000/g, ' ')                          // 全角スペース → 半角
    .replace(/[ァ-ヶｦ-ﾟ、-ー]/g, (ch) => ZEN_TO_HAN_KANA[ch] ?? ch)
}

// 半角ASCII → 全角 (U+0021-007E → U+FF01-FF5E)
export function toZenkaku(input: string): string {
  let result = input.replace(
    /[｡-ﾟ][ﾞﾟ]|[｡-ﾟ]/g,
    (ch) => HAN_DAKUTEN[ch] ?? HAN_TO_ZEN_KANA[ch] ?? ch
  )
  return result
    .replace(/[\\u0021-\\u007E]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) + 0xFEE0)
    )
    .replace(/ /g, '\\u3000')                          // 半角スペース → 全角
}`

export default function ZenkakuHankakuPage() {
  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
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
          全角・半角 変換
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          英数字・記号・カタカナ（濁音・半濁音含む）を全角⇔半角に変換します。
          データクレンジングやフォーム入力の正規化に便利です。
        </p>
      </div>

      {/* ツール本体 */}
      <section style={{ marginBottom: '3rem' }}>
        <ZenkakuHankakuClient />
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
          <li>「全角 → 半角」または「半角 → 全角」タブを選択してください</li>
          <li>テキストエリアに変換したい文字列を入力すると、リアルタイムで結果が表示されます</li>
          <li>英数字・記号・カタカナ（濁音・半濁音含む）・句読点が変換対象です</li>
          <li>ひらがな・漢字は変換されません</li>
          <li>「コピー」ボタンで変換結果をクリップボードにコピーできます</li>
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
          ASCII領域は Unicode コードポイントのオフセット（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>0xFEE0</code>）で変換。
          カタカナはマッピングテーブルで対応し、濁音・半濁音の2文字結合（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>ｶﾞ → ガ</code>）も正しく処理します。
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
            title="データクレンジング・入力正規化"
            body="フォームから送られてくるユーザー入力は、全角・半角が混在することがあります。DBに保存する前や検索クエリ生成時に半角に統一することで、文字列比較やソートの一貫性が保てます。"
          />
          <UsageNote
            title="CSV・TSVデータの前処理"
            body="ExcelやスプレッドシートからエクスポートしたCSVデータには全角数字や全角スペースが含まれる場合があります。このツールで半角に変換してからプログラムに取り込むと処理しやすくなります。"
          />
          <UsageNote
            title="濁音・半濁音の2文字結合に注意"
            body="半角カタカナの濁音（ﾞ）と半濁音（ﾟ）は独立した文字コードです。例えば「ｶﾞ」は2文字で「ガ」を表します。このツールでは2文字の組み合わせを正しく認識して全角1文字に変換します。"
          />
          <UsageNote
            title="ひらがな・漢字は変換されない"
            body="「あ」「亜」などのひらがな・漢字には全角・半角の区別がないため、このツールでは変換対象外です。変換されるのは ASCII 領域の英数字・記号と、カタカナ・句読点のみです。"
          />
          <UsageNote
            title="文字コード上の仕組み"
            body="全角ASCII文字（Ａ～Ｚ、０～９、！～～）は Unicode U+FF01〜U+FF5E に配置されており、半角対応文字（U+0021〜U+007E）と正確に 0xFEE0 の差があります。この性質を利用してコードポイントの加減算だけで変換できます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="URLエンコード" href="/url-encode" />
          <RelatedToolBadge label="HTMLエスケープ" href="/html-escape" />
          <RelatedToolBadge label="文字数カウンター" href="/character-count" />
          <RelatedToolBadge label="Base64変換" href="/base64" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/zenkaku-hankaku"
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
