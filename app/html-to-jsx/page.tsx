import type { Metadata } from 'next'
import HtmlToJsxTool from './_components/HtmlToJsxTool'

export const metadata: Metadata = {
  title: 'HTML ↔ JSX 変換',
  description: 'HTMLをJSXに変換、またはJSXをHTMLに変換するWebツール。class→className、for→htmlFor、style文字列→スタイルオブジェクトなどの属性変換に対応。ブラウザ内で完結します。',
  openGraph: {
    title: 'HTML ↔ JSX 変換 | tool-nest',
    description: 'HTMLをJSXに、JSXをHTMLに変換。class→className、イベントハンドラ変換、void要素の自己終了タグ対応。',
    url: 'https://tool-nest.pages.dev/html-to-jsx',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'HTML ↔ JSX 変換',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'HTMLをJSXに変換、またはJSXをHTMLに変換するWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/html-to-jsx',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export type ConvertResult =
  | { ok: true; output: string }
  | { ok: false; error: string }

const ATTR_MAP: Record<string, string> = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  // ... 他の属性マッピング
}

function convertAttrName(name: string): string {
  const lower = name.toLowerCase()
  if (ATTR_MAP[lower]) return ATTR_MAP[lower]
  // onclick → onClick
  if (/^on[a-z]/.test(lower))
    return 'on' + name[2].toUpperCase() + name.slice(3)
  return name
}

export function htmlToJsx(html: string): ConvertResult {
  if (!html.trim()) return { ok: false, error: '入力が空です' }
  let out = html.replace(
    /<([a-zA-Z][a-zA-Z0-9-]*)((?:\\s+[^>]*?)?)(\\\/?)>/g,
    (_m, tag, attrs, slash) => {
      const jsxAttrs = convertAttrs(attrs)
      const isVoid = VOID_ELEMENTS.has(tag.toLowerCase())
      const close = isVoid || slash ? ' />' : '>'
      return \`<\${tag}\${jsxAttrs}\${close}\`
    },
  )
  return { ok: true, output: out }
}

export function jsxToHtml(jsx: string): ConvertResult {
  if (!jsx.trim()) return { ok: false, error: '入力が空です' }
  const reverseMap = Object.fromEntries(
    Object.entries(ATTR_MAP).map(([html, jsx]) => [jsx, html]),
  )
  // self-closing void → bare open tag
  VOID_ELEMENTS.forEach(el => {
    out = out.replace(
      new RegExp(\`<(\${el})(\\\\s[^/]*?)\\\\s*/>\`, 'gi'),
      (_m, t, a) => \`<\${t}\${a}>\`
    )
  })
  return { ok: true, output: out }
}`

export default function HtmlToJsxPage() {
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
          text / convert
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          HTML ↔ JSX 変換
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          HTMLをJSXに変換、またはJSXをHTMLに変換します。<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>class</code>→<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>className</code>、イベントハンドラ、style属性のオブジェクト変換に対応。入力データはサーバーに送信されません。
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
        <HtmlToJsxTool />
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
          <li>変換方向を「HTML → JSX」または「JSX → HTML」から選択します</li>
          <li>左側のテキストエリアにHTMLまたはJSXをペーストしてください</li>
          <li>「変換」ボタンをクリックすると右側に変換結果が表示されます</li>
          <li>「コピー」ボタンで変換結果をクリップボードにコピーできます</li>
          <li>「クリア」ボタンで入力・出力をリセットできます</li>
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
          コアロジックは正規表現と属性マッピングテーブルのみで実装しています。外部ライブラリは不要なので、そのままコピーしてご利用いただけます。
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
            title="既存HTMLテンプレートをReactコンポーネントに移植"
            body="デザイナーから受け取ったHTMLをReactコンポーネントに変換する際に活用できます。class、for、onclick などの属性を一括でJSX形式に変換します。"
          />
          <UsageNote
            title="style属性の変換"
            body='HTML の style="color: red; font-size: 14px" は、JSX では style={{ color: "red", fontSize: "14px" }} のようにオブジェクト形式になります。プロパティ名はキャメルケースに変換されます。'
          />
          <UsageNote
            title="void要素の自己終了タグ"
            body='JSXでは <br>、<input>、<img> などのvoid要素は <br />、<input />、<img /> のように自己終了タグ（/> で閉じる）にする必要があります。このツールは自動で変換します。'
          />
          <UsageNote
            title="注意：複雑なJSX式は変換対象外"
            body="このツールは属性名の変換とvoid要素の処理を行いますが、JSX式（{}内の動的な値）やコンポーネント構文の変換は行いません。テキストベースの変換のため、DOMパーサーを使わずに処理します。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/camel-case" label="キャメルケース変換" />
          <RelatedToolBadge href="/html-escape" label="HTMLエスケープ" />
          <RelatedToolBadge href="/json-formatter" label="JSONフォーマッター" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/html-to-jsx"
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
