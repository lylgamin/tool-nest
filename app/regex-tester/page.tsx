import type { Metadata } from 'next'
import { Suspense } from 'react'
import RegexTesterClient from './_components/RegexTesterClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: '正規表現テスター',
  description: '正規表現（RegExp）のパターンを入力してマッチ結果を確認できるWebツール。gフラグ・iフラグ・mフラグに対応。キャプチャグループも表示。',
  openGraph: {
    title: '正規表現テスター | tool-nest',
    description: '正規表現（RegExp）のパターンとテスト対象テキストを入力し、マッチ結果をリアルタイムで確認。',
    url: 'https://tool-nest.pages.dev/regex-tester',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '正規表現テスター',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '正規表現（RegExp）のパターンを入力してマッチ結果を確認できるWebツール。gフラグ・iフラグ・mフラグに対応。キャプチャグループも表示。',
  url: 'https://tool-nest.pages.dev/regex-tester',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `// 正規表現でマッチを検索する純粋関数
export function testRegex(pattern, flags, input) {
  try {
    const regex = new RegExp(pattern, flags);
    const matches = [];
    if (flags.includes('g')) {
      let m;
      while ((m = regex.exec(input)) !== null) {
        matches.push({ match: m[0], index: m.index, groups: [...m].slice(1) });
        if (m[0].length === 0) regex.lastIndex++;
      }
    } else {
      const m = regex.exec(input);
      if (m) matches.push({ match: m[0], index: m.index, groups: [...m].slice(1) });
    }
    return { ok: true, matches, totalCount: matches.length };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}`

export default function RegexTesterPage() {
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
          text / regex
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          正規表現テスター
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          正規表現（RegExp）のパターンとテスト対象テキストを入力し、マッチ結果をリアルタイムで確認できます。
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
        <Suspense>
          <RegexTesterClient />
        </Suspense>
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
          <li>「パターン」欄に正規表現パターンを入力します（例：<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>\d+</code>）</li>
          <li>必要に応じてフラグ（g・i・m）をチェックします</li>
          <li>「テスト対象テキスト」にマッチを確認したい文字列を入力します</li>
          <li>マッチ結果がリアルタイムで下部に表示されます</li>
          <li>キャプチャグループ（括弧でくくった部分）がある場合は $1, $2 … として表示されます</li>
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
          ブラウザ標準の <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>RegExp</code> と <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>exec()</code> のみで実装。外部ライブラリ不要でそのままコピーして利用できます。
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
            title="電話番号・メールアドレスの検証パターン例"
            body="電話番号: /^0\d{1,4}-\d{1,4}-\d{4}$/ でハイフン区切りの日本の電話番号を検証できます。メールアドレス: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ で簡易的なバリデーションが可能です。本格的な検証には仕様（RFC 5322）に準拠したパターンが必要です。"
          />
          <UsageNote
            title="gフラグ忘れによるよくあるミス"
            body="gフラグなしで exec() を繰り返し呼ぶと、lastIndex がリセットされず同じマッチを無限に返すことがあります。全マッチを取得したいときは必ず g フラグを付けてください。このツールでは gフラグがある場合のみ exec() ループを使い、ない場合は最初の1件のみ取得します。"
          />
          <UsageNote
            title="特殊文字のエスケープ（.は任意文字）"
            body=". はドット文字ではなく任意の1文字にマッチします。リテラルのドットにマッチさせたい場合は \. と書いてください。同様に * + ? ( ) [ ] { } ^ $ | \ も特殊文字です。文字列をそのままパターンに使う場合は、これらを \\ でエスケープするか String.prototype.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') で自動エスケープできます。"
          />
          <UsageNote
            title="後方参照とキャプチャグループ"
            body="() でくくった部分はキャプチャグループになり $1, $2 … で参照できます。replace() では '$1' などで置換に使えます。例: 'hello world'.replace(/(\w+) (\w+)/, '$2 $1') → 'world hello'。グループをキャプチャせずに使いたい場合は (?:...) の非キャプチャグループを使います。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="文字数カウンター" href="/character-count" />
          <RelatedToolBadge label="HTMLエスケープ" href="/html-escape" />
          <RelatedToolBadge label="URLエンコード" href="/url-encode" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/regex-tester"
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
