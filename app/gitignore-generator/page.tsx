import type { Metadata } from 'next'
import GitignoreGeneratorTool from './_components/GitignoreGeneratorTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: '.gitignoreファイル生成',
  description: '言語・フレームワークを選択して.gitignoreファイルを生成します。Node.js/Python/Java/React/Go/Rust/Terraform/Unityに対応。ダウンロードボタン付き。',
  openGraph: {
    title: '.gitignore生成 | tool-nest',
    description: '言語・フレームワークを選択して.gitignoreを即生成。Node.js/Python/Java/React/Go/Rust/Terraform/Unity対応。',
    url: 'https://tool-nest.pages.dev/gitignore-generator',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '.gitignore生成ツール',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '言語・フレームワークを選択して.gitignoreファイルを生成するWebツール。ブラウザのみで動作し、データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/gitignore-generator',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export function generateGitignore(
  selectedIds: string[],
  includeCommon: boolean
): string {
  const sections: string[] = []

  selectedIds.forEach(id => {
    const template = TEMPLATES.find(t => t.id === id)
    if (template) {
      sections.push(
        \`# ===== \${template.label} =====\\n\${template.content}\`
      )
    }
  })

  if (includeCommon) {
    sections.push(
      \`# ===== 共通（OS・エディター）=====\\n\${COMMON_ENTRIES}\`
    )
  }

  return sections.join('\\n\\n')
}`

export default function GitignoreGeneratorPage() {
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
          .gitignore 生成
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          言語・フレームワークを選択して.gitignoreファイルを生成します。Node.js/Python/Java/React/Go/Rust/Terraform/Unityに対応。ダウンロードボタン付き。
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
        <GitignoreGeneratorTool />
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
          <li>左側のチェックボックスで使用する言語・フレームワークを選択します</li>
          <li>「共通エントリを含める」を有効にするとOS・エディター・.envファイルも追加されます</li>
          <li>右側のターミナルに.gitignoreの内容がリアルタイムで生成されます</li>
          <li>「ダウンロード」ボタンで.gitignoreファイルとして保存できます</li>
          <li>「コピー」ボタンでクリップボードにコピーしてそのまま貼り付けられます</li>
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
          コアロジックはテンプレート文字列の結合のみで実装しています。外部ライブラリは不要なので、そのままコピーしてご利用いただけます。
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
            title="既存リポジトリへの追加"
            body=".gitignoreはリポジトリのルートに置くのが基本です。すでに追跡されているファイルは.gitignoreに追加しても無視されないため、git rm --cached <file> で追跡を解除してからコミットする必要があります。"
          />
          <UsageNote
            title="node_modules を誤ってコミットした場合"
            body="node_modules/ を.gitignoreに追加した後、git rm -r --cached node_modules/ を実行してステージングから除外し、再コミットします。.gitignoreの設定は既存の追跡ファイルに遡及しません。"
          />
          <UsageNote
            title=".env ファイルの扱い"
            body="APIキーやシークレットを含む.envファイルは必ず.gitignoreに含めてください。一度でもコミットするとgit historyに残り続けるため、誤ってコミットした場合はgit filter-branchまたはBFG Repo Cleanerによる履歴書き換えが必要です。"
          />
          <UsageNote
            title="グローバル.gitignoreの活用"
            body="IDEの設定ファイル（.idea/、.vscode/）やOS固有ファイル（.DS_Store）はgit config --global core.excludesfile ~/.gitignore_globalでグローバルに設定できます。プロジェクト固有の.gitignoreをチームで共有しつつ、個人設定はグローバルで管理するのがベストプラクティスです。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/character-count" label="文字数カウンター" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/gitignore-generator"
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
