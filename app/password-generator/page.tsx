import type { Metadata } from 'next'
import PasswordGeneratorClient from './_components/PasswordGeneratorClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'パスワード生成 — ランダムパスワードをブラウザで生成',
  description: '大文字・小文字・数字・記号の組み合わせでランダムパスワードを生成。Web Crypto APIを使用し、サーバーに送信しません。強度表示（エントロピー）付き。',
  openGraph: {
    title: 'パスワード生成 | tool-nest',
    description: '大文字・小文字・数字・記号の組み合わせでランダムパスワードを生成。Web Crypto API使用。サーバー不送信。',
    url: 'https://tool-nest.pages.dev/password-generator',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'パスワード生成',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '大文字・小文字・数字・記号の組み合わせでランダムパスワードをブラウザで生成するWebツール。Web Crypto API使用。',
  url: 'https://tool-nest.pages.dev/password-generator',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `export type PasswordOptions = {
  length: number       // 8〜64
  uppercase: boolean   // A-Z
  lowercase: boolean   // a-z
  numbers: boolean     // 0-9
  symbols: boolean     // !@#$%^&*()-_=+[]{}|;:,.<>?
}

const CHARSET = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
}

export function generatePassword(options: PasswordOptions): string {
  const { length, uppercase, lowercase, numbers, symbols } = options
  const pools: string[] = []
  if (uppercase) pools.push(CHARSET.uppercase)
  if (lowercase) pools.push(CHARSET.lowercase)
  if (numbers)   pools.push(CHARSET.numbers)
  if (symbols)   pools.push(CHARSET.symbols)
  if (pools.length === 0) return ''

  const fullPool = pools.join('')
  const result: string[] = []

  // 各プールから最低1文字
  for (const pool of pools) {
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    result.push(pool[arr[0] % pool.length])
  }

  // 残りをランダム選択
  const remaining = length - result.length
  for (let i = 0; i < remaining; i++) {
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    result.push(fullPool[arr[0] % fullPool.length])
  }

  // シャッフル（Fisher-Yates）
  for (let i = result.length - 1; i > 0; i--) {
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    const j = arr[0] % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result.join('')
}

export function calcEntropy(options: PasswordOptions): number {
  let poolSize = 0
  if (options.uppercase) poolSize += 26
  if (options.lowercase) poolSize += 26
  if (options.numbers)   poolSize += 10
  if (options.symbols)   poolSize += 28
  if (poolSize === 0) return 0
  return options.length * Math.log2(poolSize)
}`

export default function PasswordGeneratorPage() {
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
          security / password
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          パスワード生成
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          大文字・小文字・数字・記号の組み合わせでランダムなパスワードを生成します。
          Web Crypto APIを使用し、生成はすべてブラウザ内で完結します。入力内容はサーバーに送信されません。
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
        <PasswordGeneratorClient />
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
          <li>スライダーでパスワードの長さ（8〜64文字）を選択します</li>
          <li>使用する文字種（大文字・小文字・数字・記号）をチェックボックスで選択します</li>
          <li>設定変更のたびに自動でパスワードが再生成されます。「再生成」ボタンで手動再生成も可能です</li>
          <li>「コピー」ボタンでクリップボードにコピーできます。「表示/非表示」で文字の表示を切り替えられます</li>
          <li>「5件生成」ボタンで一度に5個のパスワードを一覧表示できます</li>
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
          <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>
            crypto.getRandomValues
          </code>
          {' '}のみで実装。外部ライブラリ不要でそのままコピーして利用できます。Fisher-Yatesシャッフルで文字位置の偏りを排除しています。
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
            title="エントロピーとは"
            body="エントロピーはパスワードの予測困難さをビット数で表した指標です。エントロピー = log2(文字プールサイズ) × 長さ で計算されます。60bit未満は総当たり攻撃に対して脆弱です。一般的なWebサービスには80bit以上、機密性の高い用途には128bit以上を推奨します。このツールでは強度を5段階で可視化しています。"
          />
          <UsageNote
            title="文字種が強度に与える影響"
            body="文字プールが大きいほどエントロピーが増加します。小文字のみ（26文字）に比べ、大文字+小文字+数字+記号（約90文字）を使うと同じ長さでも約1.8倍のビット数になります。特に記号を追加するだけで強度が大幅に向上します。ただしシステムによっては記号が使用できない場合もあるため、対象サービスの仕様を確認してください。"
          />
          <UsageNote
            title="パスワードマネージャーとの併用"
            body="生成したランダムパスワードは覚えることが困難なため、1Password・Bitwarden・KeePassXCなどのパスワードマネージャーへの保存を強く推奨します。パスワードマネージャーを使えば、サービスごとに異なる強力なパスワードを安全に管理できます。マスターパスワードのみ記憶すれば問題ありません。"
          />
          <UsageNote
            title="ブラウザ内完結の安全性"
            body="このツールはすべての処理をブラウザ内で完結しています。入力した設定や生成されたパスワードはサーバーに送信されません。Web Crypto APIの crypto.getRandomValues() は暗号論的に安全な擬似乱数生成器（CSPRNG）を使用しており、Math.random() とは異なり予測不可能な乱数を生成します。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="ハッシュ生成" href="/hash" />
          <RelatedToolBadge label="UUID生成" href="/uuid-generator" />
          <RelatedToolBadge label="パスワード強度チェック" href="/password-strength" disabled={true} />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/password-generator"
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
