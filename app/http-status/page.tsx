import type { Metadata } from 'next'
import HttpStatusClient from './_components/HttpStatusClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'HTTPステータスコード一覧',
  description: 'HTTPステータスコードの意味・用途を日本語で解説。200・404・500など主要コードをキーワード検索で素早く確認できます。',
  openGraph: {
    title: 'HTTPステータスコード一覧 | tool-nest',
    description: 'HTTPステータスコードの意味・用途を日本語で解説。200・404・500など主要コードをキーワード検索で素早く確認できます。',
    url: 'https://tool-nest.pages.dev/http-status',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'HTTPステータスコード一覧',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'HTTPステータスコードの意味・用途を日本語で解説。200・404・500など主要コードをキーワード検索で素早く確認できます。',
  url: 'https://tool-nest.pages.dev/http-status',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `// HTTPステータスコードをキーワードで検索する純粋関数
export function searchHttpStatus(query) {
  if (!query) return HTTP_STATUS_CODES;
  const q = query.toLowerCase();
  return HTTP_STATUS_CODES.filter(s =>
    s.code.toString().includes(q) ||
    s.name.toLowerCase().includes(q) ||
    s.nameJa.includes(q) ||
    s.description.includes(q)
  );
}`

export default function HttpStatusPage() {
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
          network / http
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          HTTP ステータスコード一覧
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          HTTPステータスコードの意味と用途を日本語で解説します。コード番号やキーワードで検索できます。
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
        <HttpStatusClient />
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
          <li>検索ボックスにコード番号（例: 404）またはキーワード（例: 認証、redirect）を入力してください</li>
          <li>カテゴリボタン（1xx〜5xx）で絞り込みができます</li>
          <li>検索とカテゴリフィルターは組み合わせて使用できます</li>
          <li>各カードにはコード番号・英語名・日本語名・説明が表示されます</li>
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
          外部ライブラリ不要の純粋関数で実装。配列の
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>filter</code>
          と
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>includes</code>
          のみでキーワード検索を実現しています。
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
            title="401 vs 403 の使い分け"
            body="401 Unauthorized は「認証されていない」状態です。ログインしていないユーザーへのレスポンスに使います。403 Forbidden は「認証済みだが権限がない」状態です。ログイン済みでも閲覧権限がないページへのアクセスに使います。名前に反して401は「未認証」であることに注意してください。"
          />
          <UsageNote
            title="404 vs 410 の違い（SEOへの影響）"
            body="404 Not Found はリソースが見つからない汎用エラーです。410 Gone はリソースが恒久的に削除されたことを示します。SEOの観点では、削除したページには410を返すことでGoogleクローラーへの削除通知が素早くなります。404はいずれ再登録される可能性があるとクローラーが判断するため、インデックス削除に時間がかかります。"
          />
          <UsageNote
            title="302 vs 307 のメソッド保持の違い"
            body="302 Found は歴史的にPOSTリクエストをリダイレクト先でGETに変換するブラウザが多く、実質的にGETリダイレクトとして使われてきました。307 Temporary Redirect はHTTP/1.1で導入され、元のHTTPメソッド（POST/PUT等）を保持したままリダイレクトします。POSTフォームのリダイレクトに正確な動作が必要な場合は307を使用してください。"
          />
          <UsageNote
            title="429 のレートリミット実装"
            body="429 Too Many Requests はAPIのレートリミット超過時に返します。レスポンスには Retry-After ヘッダーで再試行可能な秒数またはHTTP日付を付与するのが標準的です。X-RateLimit-Limit（上限）・X-RateLimit-Remaining（残り回数）・X-RateLimit-Reset（リセット時刻）ヘッダーも合わせて返すと、クライアント側でより適切に制御できます。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="URLエンコード" href="/url-encode" />
          <RelatedToolBadge label="ハッシュ生成" href="/hash" />
          <RelatedToolBadge label="JSONフォーマッター" href="/json-formatter" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/http-status"
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
