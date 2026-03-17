"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

const CATEGORIES = [
  { id: "text", label: "テキスト", icon: "Tt", count: 2 },
  { id: "encode", label: "エンコード", icon: "{}", count: 6 },
  { id: "format", label: "フォーマット", icon: "<>", count: 1 },
  { id: "convert", label: "変換", icon: "⇄", count: 7 },
  { id: "generate", label: "生成", icon: "✦", count: 3 },
  { id: "calc", label: "計算", icon: "#", count: 6 },
  { id: "ref", label: "リファレンス", icon: "?", count: 1 },
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
      "JSONの整形・圧縮・構文チェックができます。インデント幅を2/4スペース・タブから選択可能。",
    category: "format",
    href: "/json-formatter",
    ready: true,
  },
  {
    id: "base64",
    title: "Base64変換",
    description:
      "テキストをBase64でエンコード・デコードできます。日本語（UTF-8）・URL-safe形式に対応。",
    category: "encode",
    href: "/base64",
    ready: true,
  },
  {
    id: "uuid-generator",
    title: "UUID生成",
    description:
      "UUIDv4を最大20個まで一括生成。大文字/小文字切替・個別コピー・全件コピーに対応。",
    category: "generate",
    href: "/uuid-generator",
    ready: true,
  },
  {
    id: "url-encode",
    title: "URLエンコード",
    description:
      "URLをパーセントエンコーディングでエンコード・デコードできます。日本語や特殊文字の変換に対応。",
    category: "encode",
    href: "/url-encode",
    ready: true,
  },
  {
    id: "html-escape",
    title: "HTMLエスケープ",
    description:
      "HTMLの特殊文字（&・<・>・\"・'）をエスケープ・アンエスケープできます。XSS対策の確認に。",
    category: "encode",
    href: "/html-escape",
    ready: true,
  },
  {
    id: "hash",
    title: "ハッシュ生成",
    description:
      "SHA-1・SHA-256・SHA-384・SHA-512のハッシュ値を生成できます。Web Crypto API使用。",
    category: "generate",
    href: "/hash",
    ready: true,
  },
  {
    id: "zenkaku-hankaku",
    title: "全角・半角変換",
    description:
      "英数字・記号・カタカナ（濁音・半濁音含む）を全角⇔半角に変換します。データ正規化に。",
    category: "encode",
    href: "/zenkaku-hankaku",
    ready: true,
  },
  {
    id: "camel-case",
    title: "キャメルケース変換",
    description:
      "snake_case・kebab-case・スペース区切りなどをcamelCase / PascalCaseに変換します。",
    category: "convert",
    href: "/camel-case",
    ready: true,
  },
  {
    id: "kebab-case",
    title: "ケバブ・スネークケース変換",
    description:
      "camelCase・PascalCase・スペース区切りなどをkebab-case / snake_caseに変換します。",
    category: "convert",
    href: "/kebab-case",
    ready: true,
  },
  {
    id: "unix-time",
    title: "UNIXタイム変換",
    description:
      "UNIXタイムスタンプと日時（年月日時分秒）を相互に変換できます。",
    category: "convert",
    href: "/unix-time",
    ready: true,
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
  {
    id: "rokujukkanshi",
    title: "六十干支計算",
    description: "西暦を入力すると十干・十二支の組み合わせ（六十干支）と読みを表示。60年サイクル一覧付き。",
    category: "convert",
    href: "/rokujukkanshi",
    ready: true,
  },
  {
    id: "timezone",
    title: "タイムゾーン変換",
    description: "日時を入力してUTC・JST・EST・PST等8タイムゾーンに一括変換。Intl.DateTimeFormat使用。",
    category: "convert",
    href: "/timezone",
    ready: true,
  },
  {
    id: "day-of-year",
    title: "経過日数・週数計算",
    description: "日付を入力すると年間の経過日数・残り日数・進捗・ISO週番号を計算します。",
    category: "calc",
    href: "/day-of-year",
    ready: true,
  },
  {
    id: "regex-tester",
    title: "正規表現テスター",
    description: "正規表現パターンとテスト対象テキストを入力し、マッチ結果をリアルタイム確認。g/i/mフラグ・キャプチャグループに対応。",
    category: "text",
    href: "/regex-tester",
    ready: true,
  },
  {
    id: "jwt-decoder",
    title: "JWTデコーダー",
    description: "JWT（JSON Web Token）のヘッダー・ペイロードをデコードして表示。expクレームの期限確認付き。署名検証なし。",
    category: "encode",
    href: "/jwt-decoder",
    ready: true,
  },
  {
    id: "http-status",
    title: "HTTPステータスコード一覧",
    description: "HTTPステータスコードの意味・用途を日本語で解説。コード番号やキーワードで検索・カテゴリフィルタ対応。",
    category: "ref",
    href: "/http-status",
    ready: true,
  },
  {
    id: "number-base",
    title: "進数変換",
    description: "10進・2進・8進・16進を相互に変換。ビット演算や組み込みデバッグに。",
    category: "convert",
    href: "/number-base",
    ready: true,
  },
  {
    id: "url-parser",
    title: "URLパーサー",
    description: "URLをプロトコル・ホスト・パス・クエリパラメータに分解して表示。デバッグに便利。",
    category: "encode",
    href: "/url-parser",
    ready: true,
  },
  {
    id: "byte-converter",
    title: "Byte単位変換",
    description: "B・KB・MB・GB・TB を相互変換。SI（10進）と IEC（2進・1024）の両方に対応。",
    category: "calc",
    href: "/byte-converter",
    ready: true,
  },
  {
    id: "cron-parser",
    title: "cron式パーサー",
    description: "cron式を入力すると日本語で意味を解説し、次回実行時刻を5件表示。よく使うプリセット付き。",
    category: "calc",
    href: "/cron-parser",
    ready: true,
  },
  {
    id: "date-diff",
    title: "日時差分計算",
    description: "2つの日時の差を日・時間・分・秒・年月日で計算。デプロイ間隔やプロジェクト期間の確認に。",
    category: "calc",
    href: "/date-diff",
    ready: true,
  },
  {
    id: "password-generator",
    title: "パスワード生成",
    description: "大文字・小文字・数字・記号の組み合わせでランダムパスワードを生成。強度（エントロピー）表示付き。",
    category: "generate",
    href: "/password-generator",
    ready: true,
  },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return TOOLS.filter((tool) => {
      const matchesQuery =
        q === "" ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === null || tool.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  const handleCategoryClick = (id: string) => {
    setActiveCategory((prev) => (prev === id ? null : id));
  };

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

        {/* 検索ボックス */}
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
            { value: "7", label: "カテゴリ" },
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
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                style={{
                  backgroundColor: isActive ? "var(--teal-mid)" : "var(--surface)",
                  border: isActive
                    ? "2px solid var(--teal)"
                    : "1px solid var(--border-light)",
                  borderRadius: "4px",
                  padding: isActive ? "calc(1rem - 1px)" : "1rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "border 0.15s, background-color 0.15s",
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
            );
          })}
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
        <div
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
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
          {(query !== "" || activeCategory !== null) && (
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "11px",
                color: "var(--ink-light)",
              }}
            >
              {filtered.length} / {TOOLS.length}
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 1rem",
              fontFamily: "var(--font-noto-sans), sans-serif",
              fontSize: "14px",
              color: "var(--ink-light)",
            }}
          >
            「{query}」に一致するツールが見つかりません
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {filtered.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        )}
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
