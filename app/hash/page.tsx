import type { Metadata } from 'next'
import HashToolClient from './_components/HashToolClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'SHA-256/512 ハッシュ生成',
  description: 'テキストのSHA-1・SHA-256・SHA-384・SHA-512ハッシュ値をブラウザ上で即座に計算します。Web Crypto API使用。入力内容はサーバーに送信されません。',
  openGraph: {
    title: 'SHA-256/512 ハッシュ生成 | tool-nest',
    description: 'テキストのSHA-1・SHA-256・SHA-384・SHA-512ハッシュ値をブラウザ上で即座に計算。Web Crypto API使用。',
    url: 'https://tool-nest.pages.dev/hash',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SHA-256/512 ハッシュ生成',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'テキストのSHA-1・SHA-256・SHA-384・SHA-512ハッシュ値をブラウザ上で計算するWebツール。',
  url: 'https://tool-nest.pages.dev/hash',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const faqLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'ハッシュとは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ハッシュ（SHA-256など）は、任意の長さのデータから固定長のダイジェスト値を生成する一方向関数です。元データの改ざん検証やパスワード保存に使われます。',
      },
    },
    {
      '@type': 'Question',
      name: 'SHA-1とSHA-256の違いは何ですか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SHA-1は160ビット、SHA-256は256ビットのダイジェストを生成します。SHA-1は衝突攻撃への耐性が弱く非推奨です。新しいシステムではSHA-256以上を使用してください。',
      },
    },
    {
      '@type': 'Question',
      name: 'ハッシュ値からデータを復元できますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'できません。ハッシュは一方向関数のため、ハッシュ値から元のデータを逆算することは計算上不可能です（これを一方向性といいます）。',
      },
    },
  ],
})

const coreCode = `export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

// Web Crypto API を使ったハッシュ計算（非同期）
export async function computeHash(
  input: string,
  algorithm: HashAlgorithm
): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 8文字ごとにスペースを挿入して可読性を向上
export function formatHash(hashHex: string): string {
  return hashHex.match(/.{1,8}/g)?.join(' ') ?? hashHex
}`

export default function HashPage() {
  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      {/* JSON-LD: static structured data, no user input */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLdString }} />

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
          crypto / hash
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          SHA ハッシュ生成
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          テキストのSHA-1・SHA-256・SHA-384・SHA-512ハッシュ値をブラウザ上で即座に計算します。
          Web Crypto APIを使用し、入力内容はサーバーに送信されません。
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
        <HashToolClient />
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
          <li>アルゴリズムボタン（SHA-1 / SHA-256 / SHA-384 / SHA-512）でハッシュ関数を選択します</li>
          <li>テキストエリアにハッシュ化したいテキストを入力します</li>
          <li>リアルタイムでハッシュ値が16進数で表示されます</li>
          <li>「コピー」ボタンでハッシュ値をクリップボードにコピーできます</li>
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
          ブラウザ標準の{' '}
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>crypto.subtle.digest</code>
          {' '}のみで実装。外部ライブラリ不要でそのままコピーして利用できます。
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
            title="ファイルの整合性確認"
            body="ダウンロードしたファイルが改ざんされていないか確認するために、SHA-256ハッシュを比較します。配布元が公開するハッシュ値と一致すれば、ファイルは正常です。GitHubのリリースページでも sha256sum として掲載されることが多いです。"
          />
          <UsageNote
            title="パスワードの保存（注意あり）"
            body="SHAはパスワード保存に適していません。SHA-256などは計算が高速なため、ブルートフォース攻撃に弱いです。パスワードの保存にはbcrypt・Argon2・scryptなど専用のKey Derivation Function（KDF）を使用してください。"
          />
          <UsageNote
            title="データの一意識別子（チェックサム）"
            body="テキストやデータのSHA-256ハッシュは、内容が同じなら常に同じ値になります。キャッシュのキーや重複チェック、データの変更検知など、一意な識別子として活用できます。"
          />
          <UsageNote
            title="アルゴリズムの選択基準"
            body="SHA-1は衝突攻撃が発見されており、セキュリティ用途には非推奨です。一般的なセキュリティ用途にはSHA-256を推奨します。SHA-384・SHA-512はより強力ですが、出力が長くなります。パフォーマンスよりセキュリティを重視する場合に選択してください。"
          />
          <UsageNote
            title="Web Crypto APIの対応環境"
            body="このツールはブラウザ標準のWeb Crypto API（crypto.subtle）を使用しています。Chrome 37+、Firefox 34+、Safari 7+、Edge 12+で利用可能です。なお、crypto.subtleはセキュアコンテキスト（HTTPS または localhost）でのみ動作します。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="UUID生成" href="/uuid-generator" />
          <RelatedToolBadge label="パスワード生成" href="/password-generator" />
          <RelatedToolBadge label="Base64エンコード" href="/base64" />
          <RelatedToolBadge label="URLエンコード" href="/url-encode" />
          <RelatedToolBadge label="HTMLエスケープ" href="/html-escape" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/hash"
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
