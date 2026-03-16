import type { Metadata } from 'next'
import KanshiTool from './_components/KanshiTool'

export const metadata: Metadata = {
  title: '六十干支計算',
  description: '西暦から六十干支（干支）を計算。天干（十干）・地支（十二支）・読み・サイクル番号を表示。紀元前の年にも対応。全60干支の一覧付き。',
  openGraph: {
    title: '六十干支計算 | tool-nest',
    description: '西暦から六十干支（干支）を計算。天干・地支・読み・サイクル番号を表示。全60干支の一覧付き。',
    url: 'https://tool-nest.pages.dev/rokujukkanshi',
  },
}

const jsonLdString = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: '六十干支計算',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: '西暦から六十干支（干支）を計算するWebツール。天干・地支・読み・サイクル番号を表示。',
  url: 'https://tool-nest.pages.dev/rokujukkanshi',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
  inLanguage: 'ja',
})

const coreCode = `// 基準: 4年 = 甲子（cycleIndex=1）
export function getKanshi(year: number): KanshiResult {
  const stemIdx   = ((year - 4) % 10 + 10) % 10
  const branchIdx = ((year - 4) % 12 + 12) % 12
  const cycleIndex = ((year - 4) % 60 + 60) % 60 + 1
  return {
    kanshi:     JIKKAN[stemIdx] + JUNISHI[branchIdx],
    yomi:       JIKKAN_YOMI[stemIdx] + JUNISHI_YOMI[branchIdx],
    stem:       JIKKAN[stemIdx],
    branch:     JUNISHI[branchIdx],
    stemYomi:   JIKKAN_YOMI[stemIdx],
    branchYomi: JUNISHI_YOMI[branchIdx],
    cycleIndex,
  }
}`

export default function RokujukkanshiPage() {
  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--teal)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          calculate / date
        </div>
        <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 500, color: 'var(--ink)', margin: 0, lineHeight: 1.1 }}>
          六十干支計算
        </h1>
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', marginTop: '0.75rem', lineHeight: 1.6 }}>
          西暦から六十干支（干支）を計算します。天干（十干）・地支（十二支）・読み・サイクル番号を表示。紀元前の年にも対応しています。
        </p>
      </div>

      <section style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem', marginBottom: '3rem' }}>
        <KanshiTool />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="使い方" count="01" />
        <ol style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', lineHeight: 2, paddingLeft: '1.5rem', margin: 0 }}>
          <li>西暦の年を入力すると、対応する六十干支・読み・天干・地支・サイクル番号が表示されます</li>
          <li>「今年」ボタンを押すと現在の年に設定します</li>
          <li>「六十干支 全一覧を表示」を開くと全60干支の一覧が確認でき、現在の干支がハイライトされます</li>
        </ol>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="実装コード" count="02" />
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', marginBottom: '1rem', lineHeight: 1.7 }}>
          西暦4年を甲子（cycleIndex=1）の基準として、剰余演算で天干・地支のインデックスを求めます。負の年でも正しく動作するよう、<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>+10</code>・<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>+12</code>・<code style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', backgroundColor: 'var(--navy-light)', padding: '1px 5px', borderRadius: '3px' }}>+60</code> で正値に補正しています。
        </p>
        <pre style={{ backgroundColor: '#111820', color: '#a8b8c8', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '13px', lineHeight: 1.65, padding: '1.25rem 1.5rem', borderRadius: '6px', overflowX: 'auto', margin: 0 }}>
          <code>{coreCode}</code>
        </pre>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="よくある使用例・注意点" count="03" />
        <div style={{ display: 'grid', gap: '1rem' }}>
          <UsageNote title="干支と十二支の違い" body="一般的に「干支」は十二支（ね・うし・とら...）を指すことが多いですが、本来の「干支」は十干と十二支の組み合わせで60年周期のサイクルです。このツールは本来の意味での六十干支を計算します。" />
          <UsageNote title="60年周期（還暦）" body="60年で一巡することから、61歳の誕生日を「還暦」と呼びます。生まれた年の干支に戻ること（暦が還る）が語源です。" />
          <UsageNote title="紀元前の年" body="西暦1年より前の年も入力できます。負の年（紀元前）でも正しく計算します。なお、歴史的には干支の起源は中国の殷の時代（紀元前14世紀頃）とされています。" />
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <SectionHeading title="関連ツール" count="04" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <RelatedToolBadge label="西暦・和暦変換" href="/wareki" />
          <RelatedToolBadge label="日本の祝日計算" href="/japan-holidays" />
          <RelatedToolBadge label="Unix時間変換" />
        </div>
      </section>

      <section>
        <SectionHeading title="ソースコード" count="05" />
        <p style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', color: 'var(--ink-mid)', lineHeight: 1.7 }}>
          このツールのソースコード（テストコードを含む）はGitHubで公開しています。MITライセンスで自由に利用・改変できます。
        </p>
        <a
          href="https://github.com/lylgamin/tool-nest/tree/main/app/rokujukkanshi"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-jetbrains), monospace', fontSize: '12px', color: 'var(--navy)', textDecoration: 'none', border: '1px solid var(--border)', borderRadius: '4px', padding: '8px 14px', marginTop: '0.75rem', backgroundColor: 'var(--surface)' }}
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
        <h2 style={{ fontFamily: 'var(--font-noto-serif), serif', fontSize: '18px', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
          {title}
        </h2>
        <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '10px', color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>
          {count}
        </span>
      </div>
      <div style={{ height: '1px', backgroundColor: 'var(--border-light)', marginTop: '0.75rem' }} />
    </div>
  )
}

function UsageNote({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '1rem 1.25rem' }}>
      <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--ink)', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontFamily: 'var(--font-noto-sans), sans-serif', fontSize: '13px', color: 'var(--ink-mid)', lineHeight: 1.7 }}>{body}</div>
    </div>
  )
}

function RelatedToolBadge({ label, href }: { label: string; href?: string }) {
  if (href) {
    return (
      <a href={href} style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', letterSpacing: '0.05em', color: 'var(--navy)', border: '1px solid var(--border-light)', borderRadius: '3px', padding: '5px 10px', textDecoration: 'none' }}>
        {label}
      </a>
    )
  }
  return (
    <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', letterSpacing: '0.05em', color: 'var(--ink-faint)', border: '1px solid var(--border-light)', borderRadius: '3px', padding: '5px 10px' }}>
      {label} — 準備中
    </span>
  )
}
