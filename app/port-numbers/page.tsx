import type { Metadata } from 'next'
import PortNumbersClient from './_components/PortNumbersClient'
import AdUnit from '../_components/AdUnit'

export const metadata: Metadata = {
  title: 'ポート番号一覧',
  description: 'TCP/UDPポート番号の一覧と用途を検索できます。Well-Known ポート（0-1023）とRegistered ポート（1024-49151）の主要サービスをまとめています。ファイアウォール設定・セキュリティ設定の参考に。',
  openGraph: {
    title: 'ポート番号一覧 | tool-nest',
    description: 'TCP/UDPポート番号の一覧と用途を検索できます。Well-Known ポート（0-1023）とRegistered ポート（1024-49151）の主要サービスをまとめています。ファイアウォール設定・セキュリティ設定の参考に。',
    url: 'https://tool-nest.pages.dev/port-numbers',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ポート番号一覧',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'TCP/UDPポート番号の一覧と用途を検索できます。Well-Known ポート（0-1023）とRegistered ポート（1024-49151）の主要サービスをまとめています。',
  url: 'https://tool-nest.pages.dev/port-numbers',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `// ポート番号をキーワード・カテゴリで検索する純粋関数
export function searchPorts(query, category) {
  let results = PORT_ENTRIES;
  if (category) {
    results = results.filter(p => p.category === category);
  }
  if (!query) return results;
  const q = query.toLowerCase();
  return results.filter(p =>
    p.port.toString().includes(q) ||
    p.service.toLowerCase().includes(q) ||
    p.description.includes(q) ||
    p.protocol.toLowerCase().includes(q)
  );
}`

export default function PortNumbersPage() {
  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
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
          network / ports
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          ポート番号一覧
        </h1>
        <p style={{
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontSize: '14px',
          color: 'var(--ink-mid)',
          marginTop: '0.75rem',
          lineHeight: 1.6,
        }}>
          TCP/UDP ポート番号と対応サービスを検索できます。ファイアウォール設定やセキュリティ監査の参考にご活用ください。
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
        <PortNumbersClient />
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
          <li>検索ボックスにポート番号（例: 443）またはサービス名・キーワード（例: SSH、データベース）を入力してください</li>
          <li>カテゴリボタン（Web・Email・Database・Remote など）で絞り込みができます</li>
          <li>検索とカテゴリフィルターは組み合わせて使用できます</li>
          <li>
            <code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>WK</code>
            バッジはWell-Known ポート（0–1023）を示します
          </li>
        </ol>
      </section>

      <AdUnit />

      {/* ポートについての解説 */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="ポート番号の区分" count="02" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <InfoBlock
            title="Well-Known ポート（0–1023）"
            body="IANAが管理する予約済みポートです。HTTP（80）、HTTPS（443）、SSH（22）など広く使われるプロトコルが割り当てられています。Linuxでは1024未満のポートをリッスンするには root 権限が必要です。"
          />
          <InfoBlock
            title="Registered ポート（1024–49151）"
            body="IANAへの申請・登録により特定サービスへ割り当てられたポートです。MySQL（3306）、PostgreSQL（5432）、Redis（6379）など多くのミドルウェアがこの範囲を使用します。一般ユーザーでも利用可能です。"
          />
          <InfoBlock
            title="Dynamic / Private ポート（49152–65535）"
            body="OSが動的に割り当てるエフェメラルポートです。クライアントが通信を開始するとき、一時的な送信元ポートとして自動的に使用されます。固定割り当てには使用しません。"
          />
          <InfoBlock
            title="ファイアウォール設定での活用"
            body="ファイアウォールルールを設定する際は、必要なポートのみを開放する「最小権限の原則」を守ることが重要です。例えばWebサーバーなら80と443のみ、DBサーバーなら特定IPからのアクセスのみに制限します。"
          />
        </div>
      </section>

      {/* 実装コード */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="実装コード" count="03" />
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
          のみでキーワード検索とカテゴリフィルタリングを実現しています。
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
        <SectionHeading title="よくある使用例・注意点" count="04" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <UsageNote
            title="ポート衝突の回避"
            body="複数のサービスを同一サーバーで動かす際、ポート番号が重複するとサービスが起動できません。開発環境では 3000・5173・8080 などがよく使われます。既に使用中のポートは lsof -i :3000（Linux/Mac）または netstat -ano | findstr :3000（Windows）で確認できます。"
          />
          <UsageNote
            title="セキュリティ的に注意が必要なポート"
            body="23番（Telnet）・21番（FTP）は通信が平文のため、インターネット上での使用は非推奨です。代わりに SSH（22）・SFTP を使用してください。また 3389番（RDP）はブルートフォース攻撃の標的になりやすいため、インターネットへの直接公開は避け、VPN経由でのアクセスを推奨します。"
          />
          <UsageNote
            title="Well-Known ポートと非標準ポートの使い分け"
            body="本番環境のWebサーバーは 80/443 を使用します。Nginx や Apache をリバースプロキシとして前段に置き、バックエンドアプリケーション（Node.js 等）は 3000 などの非標準ポートで動かす構成が一般的です。こうすることでアプリを root 権限なしで起動できます。"
          />
          <UsageNote
            title="Docker・Kubernetes でのポートマッピング"
            body="Docker では -p ホスト側ポート:コンテナ側ポート でポートをマッピングします（例: -p 8080:80）。Kubernetes では Service リソースで port（クラスター内部）と targetPort（Pod）を分けて設定できます。NodePort を使うとクラスター外部からも 30000–32767 の範囲でアクセス可能になります。"
          />
        </div>
      </section>

      {/* 関連ツール */}
      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="05" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="HTTPステータスコード一覧" href="/http-status" />
          <RelatedToolBadge label="URLパーサー" href="/url-parser" />
          <RelatedToolBadge label="curl → Fetch 変換" href="/curl-to-fetch" />
          <RelatedToolBadge label="cron式パーサー" href="/cron-parser" />
        </div>
      </section>

      {/* GitHubリンク */}
      <section>
        <SectionHeading title="ソースコード" count="06" />
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
          href="https://github.com/lylgamin/tool-nest/tree/main/app/port-numbers"
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

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border-light)',
      borderLeft: '3px solid var(--teal)',
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
