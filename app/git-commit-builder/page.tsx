import type { Metadata } from 'next'
import GitCommitBuilderTool from './_components/GitCommitBuilderTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'Gitコミットメッセージ生成',
  description: 'Conventional Commits形式のコミットメッセージをGUIで作成。feat/fix/docs等のタイプ選択、スコープ、BREAKING CHANGE対応。',
  openGraph: {
    title: 'Gitコミットメッセージ生成 | tool-nest',
    description: 'Conventional Commits形式のコミットメッセージをGUIで作成。タイプ・スコープ・ブレーキングチェンジをフォームで入力し、正確なメッセージを自動生成。',
    url: 'https://tool-nest.pages.dev/git-commit-builder',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Gitコミットメッセージ生成',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'Conventional Commits形式のコミットメッセージをGUIで作成するWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/git-commit-builder',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export function buildCommitMessage(fields: CommitFields): string {
  const { type, scope, breaking, subject, body, footer } = fields
  if (!type || !subject.trim()) return ''

  const scopePart = scope.trim() ? \`(\${scope.trim()})\` : ''
  const breakingMark = breaking ? '!' : ''
  const header = \`\${type}\${scopePart}\${breakingMark}: \${subject.trim()}\`

  const parts = [header]
  if (body.trim()) parts.push('', body.trim())
  if (breaking && !footer.toLowerCase().includes('breaking change')) {
    const breakingFooter = footer.trim()
      ? \`BREAKING CHANGE: \${footer.trim()}\`
      : 'BREAKING CHANGE: '
    parts.push('', breakingFooter)
  } else if (footer.trim()) {
    parts.push('', footer.trim())
  }

  return parts.join('\\n')
}`

export default function GitCommitBuilderPage() {
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
          git / tools
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          Git コミットメッセージ生成
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          Conventional Commits形式のコミットメッセージをGUIで作成します。タイプ・スコープ・ブレーキングチェンジをフォームで入力し、正確なメッセージを自動生成。
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
        <GitCommitBuilderTool />
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
          <li>コミットタイプ（feat・fix・docs など）をボタンから選択してください</li>
          <li>変更対象のスコープを任意で入力します（例: auth、api、ui）</li>
          <li>タイトルに変更内容を72文字以内で簡潔に記入します（英語・命令形推奨）</li>
          <li>後方互換性のない変更の場合は「BREAKING CHANGE」チェックボックスをオンにします</li>
          <li>必要に応じて本文・フッターを入力すると、右側にメッセージが自動生成されます</li>
          <li>「コピー」ボタンでコミットメッセージをクリップボードにコピーできます</li>
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
          コアロジックは文字列操作のみで実装しています。Conventional Commits仕様に従い、
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>type(scope)!: subject</code>
          {' '}の形式でヘッダーを組み立て、本文・フッターを空行で区切って連結します。外部ライブラリは不要です。
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
            title="Conventional Commits とは"
            body="Conventional Commits は、コミットメッセージに人間と機械が読める意味を持たせるための仕様です。semantic-release や CHANGELOG 自動生成ツールと連携することで、バージョン管理を自動化できます。"
          />
          <UsageNote
            title="スコープの命名規則"
            body="スコープは変更箇所のモジュール・コンポーネント名を使います。例: fix(auth): fix token expiry や feat(api): add pagination。プロジェクト内で一貫した命名を使うことが重要です。"
          />
          <UsageNote
            title="BREAKING CHANGE の扱い"
            body="後方互換性のない変更には「BREAKING CHANGE」フッターが必要です。このツールでチェックを入れると、タイトルに「!」が付加され、フッターに BREAKING CHANGE: が自動挿入されます。semver では MAJOR バージョンのインクリメントに対応します。"
          />
          <UsageNote
            title="本文・フッターの使い分け"
            body="本文（body）には変更の背景・理由・詳細を記述します。フッター（footer）には Issue 番号（Closes #123）や共著者（Co-authored-by:）、BREAKING CHANGE の説明を記載します。本文・フッターは空行で区切ることが仕様上必須です。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/regex-tester" label="正規表現テスター" />
          <RelatedToolBadge href="/character-count" label="文字数カウンター" />
          <RelatedToolBadge href="/hash" label="ハッシュ生成" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/git-commit-builder"
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
