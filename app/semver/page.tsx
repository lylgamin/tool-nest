import type { Metadata } from 'next'
import SemverTool from './_components/SemverTool'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'Semver（セマンティックバージョニング）ツール — 比較・バンプ・レンジチェック',
  description: 'セマンティックバージョニング（SemVer）のバージョン比較、バンプ（major/minor/patch）、レンジチェック（^/~/>=/<）をブラウザで完結。入力データはサーバーに送信されません。',
  openGraph: {
    title: 'Semver ツール | tool-nest',
    description: 'SemVer のバージョン比較・バンプ・レンジチェックをブラウザで。外部ライブラリなしの純粋な JavaScript 実装。',
    url: 'https://tool-nest.pages.dev/semver',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Semver ツール',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'セマンティックバージョニング（SemVer）のバージョン比較・バンプ・レンジチェックをブラウザ上で実行するWebツール。データはサーバーに送信されません。',
  url: 'https://tool-nest.pages.dev/semver',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreLogicCode = `export type SemVer = { major: number; minor: number; patch: number; pre?: string }

export function parseSemVer(v: string): SemVer | null {
  const match = v.trim().replace(/^v/, '').match(
    /^(\\d+)\\.(\\d+)\\.(\\d+)(?:-([a-zA-Z0-9.\\-]+))?$/
  )
  if (!match) return null
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    pre: match[4],
  }
}

export function compareSemVer(a: string, b: string): -1 | 0 | 1 {
  const pa = parseSemVer(a)
  const pb = parseSemVer(b)
  if (!pa || !pb) return 0
  if (pa.major !== pb.major) return pa.major < pb.major ? -1 : 1
  if (pa.minor !== pb.minor) return pa.minor < pb.minor ? -1 : 1
  if (pa.patch !== pb.patch) return pa.patch < pb.patch ? -1 : 1
  // pre-release なし > pre-release あり (SemVer 仕様)
  if (!pa.pre && !pb.pre) return 0
  if (!pa.pre) return 1
  if (!pb.pre) return -1
  return pa.pre < pb.pre ? -1 : pa.pre > pb.pre ? 1 : 0
}

export function bumpVersion(v: string, type: 'major' | 'minor' | 'patch'): string {
  const parsed = parseSemVer(v)
  if (!parsed) return v
  const { major, minor, patch } = parsed
  switch (type) {
    case 'major': return \`\${major + 1}.0.0\`
    case 'minor': return \`\${major}.\${minor + 1}.0\`
    case 'patch': return \`\${major}.\${minor}.\${patch + 1}\`
  }
}

export function satisfiesRange(version: string, range: string): boolean {
  const v = parseSemVer(version)
  if (!v) return false
  const trimmedRange = range.trim()

  // ^x.y.z: >=x.y.z <(x+1).0.0
  const caretMatch = trimmedRange.match(/^\\^(.+)$/)
  if (caretMatch) {
    const min = parseSemVer(caretMatch[1])
    if (!min) return false
    return compareSemVer(version, caretMatch[1]) >= 0 && v.major === min.major
  }

  // ~x.y.z: >=x.y.z <x.(y+1).0
  const tildeMatch = trimmedRange.match(/^~(.+)$/)
  if (tildeMatch) {
    const min = parseSemVer(tildeMatch[1])
    if (!min) return false
    return (
      compareSemVer(version, tildeMatch[1]) >= 0 &&
      v.major === min.major &&
      v.minor === min.minor
    )
  }

  // >=, >, <=, <, =
  const opMatch = trimmedRange.match(/^(>=|>|<=|<|=)(.+)$/)
  if (opMatch) {
    const cmp = compareSemVer(version, opMatch[2].trim())
    switch (opMatch[1]) {
      case '>=': return cmp >= 0
      case '>':  return cmp > 0
      case '<=': return cmp <= 0
      case '<':  return cmp < 0
      case '=':  return cmp === 0
    }
  }

  return compareSemVer(version, trimmedRange) === 0
}`

export default function SemverPage() {
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
          calc / semver
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          Semver ツール
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          セマンティックバージョニング（SemVer）のバージョン比較・バンプ・レンジチェックをブラウザ上で実行します。
          外部ライブラリなしの純粋な JavaScript 実装。入力データはサーバーに送信されません。
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
        <SemverTool />
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
          <li><strong>バージョン比較</strong>: 2つのバージョンを入力し、大小関係（新しい・古い・等値）を確認します</li>
          <li><strong>バージョンバンプ</strong>: 現在のバージョンと major / minor / patch を選択すると次のバージョンを算出します</li>
          <li><strong>レンジチェック</strong>: バージョンとレンジ（<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'rgba(31,107,114,0.1)', padding: '1px 5px', borderRadius: '3px' }}>^</code>・<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'rgba(31,107,114,0.1)', padding: '1px 5px', borderRadius: '3px' }}>~</code>・比較演算子）を入力し、そのバージョンがレンジを満たすかを確認します</li>
          <li>バージョンには <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'rgba(31,107,114,0.1)', padding: '1px 5px', borderRadius: '3px' }}>v</code> プレフィックスも入力可能です（例: <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'rgba(31,107,114,0.1)', padding: '1px 5px', borderRadius: '3px' }}>v1.2.3</code>）</li>
          <li>pre-release 識別子にも対応しています（例: <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'rgba(31,107,114,0.1)', padding: '1px 5px', borderRadius: '3px' }}>1.0.0-alpha.1</code>）</li>
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
          コアロジックは標準の文字列操作と正規表現のみで実装しています。semver パッケージなどの外部ライブラリは不要。
          そのままコピーしてプロジェクトで利用できます。
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
          <code>{coreLogicCode}</code>
        </pre>
      </section>

      {/* よくある使用例・注意点 */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="よくある使用例・注意点" count="03" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <UsageNote
            title="npm パッケージの依存バージョンを確認したい"
            body="package.json の dependencies には ^ や ~ のようなレンジが書かれています。このツールのレンジチェックモードで、インストールされたバージョンが指定範囲に含まれるかをすぐに確認できます。"
          />
          <UsageNote
            title="リリース時のバージョン番号を決める"
            body="バグ修正のみなら patch、後方互換な新機能追加なら minor、破壊的変更なら major をバンプします。バンプモードに現在のバージョンを入力するだけで次のバージョン候補が即座に表示されます。"
          />
          <UsageNote
            title="pre-release バージョンの扱い"
            body="SemVer 仕様では 1.0.0-alpha は 1.0.0 より「古い」と見なされます（pre-release なし ＞ pre-release あり）。このツールも同じ仕様に準拠しています。バンプ時は pre-release 識別子が除去されます。"
          />
          <UsageNote
            title="^ と ~ の違い"
            body="^1.2.3 は major が一致する最新まで（1.2.3 以上 2.0.0 未満）を許容します。~1.2.3 はより厳しく、major と minor が一致する最新まで（1.2.3 以上 1.3.0 未満）のみ許容します。"
          />
          <UsageNote
            title="対応していないレンジ構文"
            body="このツールは単一のレンジ条件に対応しています。npm の &gt;=1.0.0 &lt;2.0.0 のような複数条件の AND 結合や、ハイフン範囲（1.0.0 - 2.0.0）、ワイルドカード（1.x）は未対応です。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge href="/git-commit-builder" label="Gitコミットメッセージ生成" />
          <RelatedToolBadge href="/cron-parser" label="cron式パーサー" />
          <RelatedToolBadge href="/regex-tester" label="正規表現テスター" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/semver"
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
      <div
        style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--ink-mid)',
          lineHeight: 1.7,
        }}
        dangerouslySetInnerHTML={{ __html: body }}
      />
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
