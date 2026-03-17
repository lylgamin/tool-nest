import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'tool-nestのプライバシーポリシー。Cookieの使用・広告配信・個人情報の取り扱いについて説明します。',
}

const LAST_UPDATED = '2026年3月17日'

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      {/* ヘッダー */}
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
        <p style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          letterSpacing: '0.14em',
          color: 'var(--ink-light)',
          textTransform: 'uppercase',
          margin: '0 0 0.75rem',
        }}>
          Legal
        </p>
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: 'var(--ink)',
          margin: '0 0 0.5rem',
          lineHeight: 1.2,
        }}>
          プライバシーポリシー
        </h1>
        <p style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '11px',
          color: 'var(--ink-faint)',
          margin: 0,
        }}>
          最終更新：{LAST_UPDATED}
        </p>
      </header>

      {/* 本文 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

        <Section title="1. 基本方針">
          <p>
            tool-nest（以下「当サイト」）は、利用者のプライバシーを尊重し、個人情報の適切な保護に努めます。
            当サイトはサーバーへのデータ送信を一切行わない純粋なクライアントサイドアプリケーションです。
            入力されたテキストやデータはブラウザ内のみで処理され、外部に送信されません。
          </p>
        </Section>

        <Section title="2. 収集する情報">
          <p>当サイトが収集・利用する情報は以下に限られます。</p>
          <ul>
            <li><strong>Cookie・ローカルストレージ</strong>：広告配信の最適化およびサイト設定の保存に使用します。</li>
            <li><strong>アクセスログ</strong>：Cloudflare Pagesにより自動的に記録されるアクセス情報（IPアドレス・ブラウザ種別等）。これらはCloudflareのプライバシーポリシーに従って処理されます。</li>
          </ul>
          <p>当サイト自体は氏名・メールアドレス・その他個人を特定できる情報を収集・保存しません。</p>
        </Section>

        <Section title="3. 広告（Google AdSense）">
          <p>
            当サイトはGoogle LLCが提供するGoogle AdSenseを利用して広告を表示しています。
            Google AdSenseはCookieを使用して、利用者の興味に基づく広告を配信します。
          </p>
          <ul>
            <li>Googleはこれらの情報を使用して利用者に関連性の高い広告を表示することがあります。</li>
            <li>Googleによる広告Cookieの使用は、<a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Googleの広告に関するポリシー</a>に基づきます。</li>
            <li>広告のパーソナライズは<a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Googleの広告設定ページ</a>からオプトアウトできます。</li>
          </ul>
        </Section>

        <Section title="4. Cookieについて">
          <p>
            Cookieとはウェブサイトがブラウザに保存する小さなテキストファイルです。
            当サイトでは以下の目的でCookieまたはローカルストレージを使用します。
          </p>
          <ul>
            <li>Google AdSenseによる広告配信の最適化</li>
            <li>Cookieへの同意状態の記録</li>
          </ul>
          <p>
            ブラウザの設定からCookieを無効にすることができますが、一部機能が制限される場合があります。
          </p>
        </Section>

        <Section title="5. 第三者サービス">
          <p>当サイトが利用する主な第三者サービスとそのプライバシーポリシーは以下のとおりです。</p>
          <ul>
            <li>
              <strong>Google AdSense</strong>（広告配信）：
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Googleプライバシーポリシー</a>
            </li>
            <li>
              <strong>Cloudflare Pages</strong>（ホスティング）：
              <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflareプライバシーポリシー</a>
            </li>
          </ul>
        </Section>

        <Section title="6. ポリシーの変更">
          <p>
            本ポリシーは法令の改正やサービス変更に応じて予告なく更新することがあります。
            最新の内容は常に当ページにて確認できます。
          </p>
        </Section>

        <Section title="7. お問い合わせ">
          <p>
            本ポリシーに関するご質問は、
            <a href="https://github.com/lylgamin/tool-nest/issues" target="_blank" rel="noopener noreferrer">
              GitHubのIssueトラッカー
            </a>
            までお寄せください。
          </p>
        </Section>
      </div>

      {/* フッターナビ */}
      <div style={{
        marginTop: '3.5rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--border-light)',
      }}>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '11px',
            color: 'var(--teal)',
            textDecoration: 'none',
            letterSpacing: '0.06em',
          }}
        >
          ← ツール一覧に戻る
        </Link>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 style={{
        fontFamily: 'var(--font-noto-serif), serif',
        fontSize: '1.05rem',
        fontWeight: 600,
        color: 'var(--navy)',
        margin: '0 0 1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--border-light)',
      }}>
        {title}
      </h2>
      <div style={{
        fontFamily: 'var(--font-noto-sans), sans-serif',
        fontSize: '14px',
        color: 'var(--ink-mid)',
        lineHeight: 1.8,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {children}
      </div>
    </section>
  )
}
