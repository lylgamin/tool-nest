import Link from "next/link";

const CATEGORIES = [
  { id: "text", label: "テキスト", icon: "Tt", count: 1 },
  { id: "encode", label: "エンコード", icon: "{}", count: 0 },
  { id: "format", label: "フォーマット", icon: "<>", count: 0 },
  { id: "convert", label: "変換", icon: "⇄", count: 1 },
  { id: "generate", label: "生成", icon: "✦", count: 0 },
  { id: "calc", label: "計算", icon: "#", count: 2 },
];

const TOOLS = [
  {
    id: "character-count",
    title: "文字数カウンター",
    description:
      "文字数・バイト数・単語数・行数をリアルタイムで確認できます。日本語（UTF-8）のバイト数にも対応しています。",
    category: "text",
    href: "/character-count",
    ready: true,
  },
  {
    id: "json-formatter",
    title: "JSONフォーマッター",
    description:
      "JSONの整形・圧縮・構文チェックができます。シンタックスハイライト付き。",
    category: "format",
    href: null,
    ready: false,
  },
  {
    id: "base64",
    title: "Base64変換",
    description:
      "テキストやファイルをBase64でエンコード・デコードできます。",
    category: "encode",
    href: null,
    ready: false,
  },
  {
    id: "url-encode",
    title: "URLエンコード",
    description:
      "URLをパーセントエンコーディングでエンコード・デコードできます。",
    category: "encode",
    href: null,
    ready: false,
  },
  {
    id: "hash",
    title: "ハッシュ生成",
    description:
      "MD5・SHA-1・SHA-256・SHA-512のハッシュ値を生成できます。",
    category: "generate",
    href: null,
    ready: false,
  },
  {
    id: "unix-time",
    title: "UNIXタイム変換",
    description:
      "UNIXタイムスタンプと日時（年月日時分秒）を相互に変換できます。",
    category: "convert",
    href: null,
    ready: false,
  },
  {
    id: "wareki",
    title: "西暦・和暦変換",
    description: "西暦（グレゴリオ暦）と和暦（令和・平成・昭和・大正・明治）を相互変換。元号境界を正確に処理。",
    category: "convert",
    href: "/wareki",
    ready: true,
  },
  {
    id: "japan-holidays",
    title: "日本の祝日計算",
    description: "指定した年の祝日一覧を計算します。ハッピーマンデー・振替休日・国民の祝日に対応。",
    category: "calc",
    href: "/japan-holidays",
    ready: true,
  },
  {
    id: "business-days",
    title: "営業日計算",
    description: "期間の営業日数を計算します。祝日リスト貼り付け・土曜除外オプション付き。",
    category: "calc",
    href: "/business-days",
    ready: true,
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "5rem 1.5rem 4rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "10px",
            letterSpacing: "0.18em",
            color: "var(--teal)",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          developer utilities
        </div>

        <h1
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
            fontWeight: 500,
            color: "var(--ink)",
            lineHeight: 1.05,
            margin: "0 0 1.25rem",
            letterSpacing: "-0.01em",
          }}
        >
          Tools for
          <br />
          <em style={{ fontStyle: "italic", color: "var(--navy)" }}>
            developers
          </em>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-noto-sans), sans-serif",
            fontSize: "15px",
            color: "var(--ink-mid)",
            lineHeight: 1.8,
            maxWidth: "480px",
            margin: "0 auto 2.5rem",
          }}
        >
          JSONフォーマッターや文字数カウンターなど、よく使う開発ツールをブラウザだけで手軽に使えます。入力した内容はサーバーに送信されません。
        </p>

        {/* 検索ボックス (visual only) */}
        <div
          style={{
            maxWidth: "400px",
            margin: "0 auto 3rem",
            position: "relative",
          }}
        >
          <input
            type="search"
            placeholder="ツールを検索... (例: JSON, Base64)"
            style={{
              width: "100%",
              padding: "10px 16px",
              paddingLeft: "40px",
              backgroundColor: "var(--surface-alt)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              fontFamily: "var(--font-noto-sans), sans-serif",
              fontSize: "13px",
              color: "var(--ink)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "13px",
              color: "var(--ink-faint)",
              pointerEvents: "none",
            }}
          >
            /
          </span>
        </div>

        {/* 統計 */}
        <div style={{ display: "flex", justifyContent: "center", gap: "3rem" }}>
          {[
            { value: "50+", label: "ツール（予定）" },
            { value: "6", label: "カテゴリ" },
            { value: "0", label: "サーバー通信" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "22px",
                  fontWeight: 400,
                  color: "var(--navy)",
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-noto-sans), sans-serif",
                  fontSize: "11px",
                  color: "var(--ink-light)",
                  marginTop: "2px",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* カテゴリグリッド */}
      <section
        id="categories"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1.5rem 3rem",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-noto-serif), serif",
              fontSize: "16px",
              fontWeight: 600,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            カテゴリ
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "4px",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "16px",
                  color: "var(--navy)",
                  marginBottom: "6px",
                }}
              >
                {cat.icon}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-noto-sans), sans-serif",
                  fontSize: "13px",
                  color: "var(--ink-mid)",
                }}
              >
                {cat.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "9px",
                  color: "var(--ink-faint)",
                  letterSpacing: "0.1em",
                  marginTop: "3px",
                }}
              >
                {cat.count} tools
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ツールカード一覧 */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1.5rem 6rem",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-noto-serif), serif",
              fontSize: "16px",
              fontWeight: 600,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            すべてのツール
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ToolCard({
  title,
  description,
  category,
  href,
  ready,
}: {
  title: string;
  description: string;
  category: string;
  href: string | null;
  ready: boolean;
}) {
  const cardStyle = {
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border-light)",
    borderRadius: "4px",
    padding: "1.25rem",
    display: "block",
    textDecoration: "none",
    opacity: ready ? 1 : 0.55,
    cursor: ready ? "pointer" : "default",
    position: "relative" as const,
    overflow: "hidden" as const,
  };

  const inner = (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-noto-sans), sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--ink)",
          }}
        >
          {title}
        </div>
        {!ready && (
          <span
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "9px",
              letterSpacing: "0.1em",
              color: "var(--ink-faint)",
              border: "1px solid var(--border-light)",
              borderRadius: "2px",
              padding: "2px 6px",
              whiteSpace: "nowrap" as const,
              marginLeft: "8px",
            }}
          >
            準備中
          </span>
        )}
      </div>
      <p
        style={{
          fontFamily: "var(--font-noto-sans), sans-serif",
          fontSize: "12px",
          color: "var(--ink-light)",
          lineHeight: 1.6,
          margin: "0 0 0.75rem",
        }}
      >
        {description}
      </p>
      <div
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "9px",
          letterSpacing: "0.12em",
          color: "var(--ink-faint)",
          textTransform: "uppercase" as const,
        }}
      >
        {category}
      </div>
    </>
  );

  if (ready && href) {
    return (
      <Link href={href} style={cardStyle} aria-label={title}>
        {inner}
      </Link>
    );
  }

  return (
    <div style={cardStyle} aria-disabled="true">
      {inner}
    </div>
  );
}
