import type { Metadata } from 'next'
import OgpPreviewTool from './_components/OgpPreviewTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'OGPメタタグ プレビュー',
  description: 'OGP（Open Graph Protocol）のmetaタグを入力し、Twitter/X・Slack・Facebookでの見え方をリアルタイムでシミュレート。metaタグのコード生成付き。',
  openGraph: {
    title: 'OGPメタタグ プレビュー | tool-nest',
    description: 'OGPメタタグをブラウザ内で生成・プレビュー。Twitter/X・Slack・Facebookの見え方を確認できます。',
    url: 'https://tool-nest.pages.dev/ogp-preview',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'OGPメタタグ プレビュー',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'OGP（Open Graph Protocol）のmetaタグを入力し、Twitter/X・Slack・Facebookでの見え方をリアルタイムでシミュレートするWebツール。',
  url: 'https://tool-nest.pages.dev/ogp-preview',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export function buildOgpTags(fields: OgpFields): string {
  const tags: string[] = []

  const add = (prop: string, content: string) => {
    if (content.trim()) {
      tags.push(
        \`<meta property="\${prop}" content="\${content.replace(/"/g, '&quot;')}" />\`
      )
    }
  }
  const addName = (name: string, content: string) => {
    if (content.trim()) {
      tags.push(
        \`<meta name="\${name}" content="\${content.replace(/"/g, '&quot;')}" />\`
      )
    }
  }

  add('og:title', fields.title)
  add('og:description', fields.description)
  add('og:url', fields.url)
  add('og:image', fields.imageUrl)
  add('og:site_name', fields.siteName)
  add('og:type', fields.type || 'website')

  addName('twitter:card', fields.twitterCard || 'summary_large_image')
  addName('twitter:title', fields.title)
  addName('twitter:description', fields.description)
  if (fields.imageUrl) addName('twitter:image', fields.imageUrl)
  if (fields.twitterSite)
    addName('twitter:site',
      fields.twitterSite.startsWith('@')
        ? fields.twitterSite
        : '@' + fields.twitterSite
    )

  return tags.join('\\n')
}`

export default function OgpPreviewPage() {
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
          web / seo
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          OGP メタタグ プレビュー
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          OGP（Open Graph Protocol）のmetaタグを入力し、Twitter/X・Slackでの見え方をリアルタイムでシミュレートします。metaタグのコード生成付き。
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
        <OgpPreviewTool />
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
          <li>左側のフォームにOGPフィールド（タイトル・説明・URL・画像URL等）を入力します</li>
          <li>右側にTwitter/X・Slackでのプレビューがリアルタイムで更新されます</li>
          <li>フィールドの文字数や形式に問題がある場合、インラインで警告が表示されます</li>
          <li>「生成されたmetaタグ」エリアに完成したHTMLタグが表示されます</li>
          <li>「コピー」ボタンでタグをクリップボードにコピーし、HTMLの&lt;head&gt;に貼り付けてください</li>
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
          コアロジックはブラウザ標準のAPIのみで実装しています。外部ライブラリは不要で、そのままコピーしてご利用いただけます。
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
            title="og:image の推奨サイズ"
            body="OGP画像の推奨サイズは 1200×630px（横長）です。Twitter/Xのsummary_large_imageカードでは600×314px以上が必要。サイズが小さいと表示されなかったり、クロップされることがあります。"
          />
          <UsageNote
            title="タイトル・説明の文字数"
            body="og:titleは60文字以内、og:descriptionは160文字以内が推奨です。超過すると各プラットフォームで省略表示されます。TwitterカードはX側でもタイトルを70文字程度で切ることがあります。"
          />
          <UsageNote
            title="twitter:card の種類"
            body="summary_large_imageは横幅いっぱいの大きな画像で表示されます。summaryは小さなサムネイル表示です。記事・製品ページにはsummary_large_image、プロフィール・アイコン系にはsummaryが適しています。"
          />
          <UsageNote
            title="SNSキャッシュの注意"
            body="OGPタグを更新しても、各SNSのクローラーがキャッシュを持つため即座に反映されません。TwitterはCard Validatorで、FacebookはSharing Debuggerでキャッシュをクリアできます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/url-encode" label="URLエンコード/デコード" />
          <RelatedToolBadge href="/url-parser" label="URLパーサー" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/ogp-preview"
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
        cursor: 'pointer',
      }}
    >
      {label}
    </a>
  )
}
