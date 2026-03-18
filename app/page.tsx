"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { CATEGORIES, TOOLS } from "./_data/tools";
import { useRecentTools } from "./_components/useRecentTools";

// ピン止め状態をlocalStorageで管理するフック
function usePins() {
  const [pins, setPins] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tool_nest_pins");
      if (saved) setPins(new Set(JSON.parse(saved) as string[]));
    } catch {}
  }, []);

  const toggle = useCallback((id: string) => {
    setPins((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem("tool_nest_pins", JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  return { pins, toggle };
}

function openCommandPalette() {
  window.dispatchEvent(new CustomEvent("open-command-palette"));
}

export default function HomePage() {
  const { pins, toggle } = usePins();
  const recentIds = useRecentTools();

  const pinnedTools = TOOLS.filter((t) => t.ready && pins.has(t.id));
  const readyTools = TOOLS.filter((t) => t.ready);
  const recentTools = recentIds
    .map((id) => TOOLS.find((t) => t.id === id && t.ready && !pins.has(id)))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);

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

        {/* 検索トリガー（コマンドパレットを開く） */}
        <div
          style={{
            maxWidth: "400px",
            margin: "0 auto 3rem",
          }}
        >
          <button
            onClick={openCommandPalette}
            aria-label="ツールを検索（コマンドパレットを開く）"
            style={{
              width: "100%",
              padding: "10px 16px",
              paddingLeft: "40px",
              backgroundColor: "var(--surface-alt)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              fontFamily: "var(--font-noto-sans), sans-serif",
              fontSize: "13px",
              color: "var(--ink-faint)",
              cursor: "pointer",
              textAlign: "left",
              boxSizing: "border-box",
              position: "relative",
              display: "flex",
              alignItems: "center",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--teal)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "14px",
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "13px",
                color: "var(--ink-faint)",
              }}
            >
              /
            </span>
            <span style={{ flex: 1 }}>ツールを検索... (例: JSON, Base64)</span>
            <kbd
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                color: "var(--ink-faint)",
                border: "1px solid var(--border)",
                borderRadius: "3px",
                padding: "2px 6px",
                flexShrink: 0,
              }}
            >
              ⌘K
            </kbd>
          </button>
        </div>

        {/* 統計 */}
        <div style={{ display: "flex", justifyContent: "center", gap: "3rem" }}>
          {[
            { value: String(readyTools.length), label: "ツール" },
            { value: String(CATEGORIES.length), label: "カテゴリ" },
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
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "4px",
                padding: "1rem",
                textAlign: "center",
                textDecoration: "none",
                display: "block",
                transition: "border-color 0.15s, background-color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--teal)";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--teal-mid)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-light)";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--surface)";
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
            </Link>
          ))}
        </div>
      </section>

      {/* ピン止めセクション（1件以上の場合のみ表示） */}
      {pinnedTools.length > 0 && (
        <section
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 1.5rem 3rem",
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
              ピン止め
            </h2>
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                color: "var(--teal)",
                letterSpacing: "0.1em",
                border: "1px solid var(--teal)",
                borderRadius: "2px",
                padding: "1px 6px",
              }}
            >
              {pinnedTools.length}
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {pinnedTools.map((tool) => (
              <ToolCard
                key={tool.id}
                {...tool}
                isPinned
                onTogglePin={() => toggle(tool.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 最近使ったツール（1件以上・ピン未重複の場合のみ表示） */}
      {recentTools.length > 0 && (
        <section
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 1.5rem 3rem",
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
              最近使ったツール
            </h2>
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                color: "var(--teal)",
                letterSpacing: "0.1em",
                border: "1px solid var(--teal)",
                borderRadius: "2px",
                padding: "1px 6px",
              }}
            >
              {recentTools.length}
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {recentTools.map((tool) => (
              <ToolCard
                key={tool.id}
                {...tool}
                isPinned={pins.has(tool.id)}
                onTogglePin={() => toggle(tool.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ツールカード一覧 */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1.5rem 6rem",
        }}
      >
        <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
          <span
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "10px",
              color: "var(--teal)",
              letterSpacing: "0.1em",
              border: "1px solid var(--teal)",
              borderRadius: "2px",
              padding: "1px 6px",
            }}
          >
            {readyTools.length}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              {...tool}
              isPinned={pins.has(tool.id)}
              onTogglePin={() => toggle(tool.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function ToolCard({
  id,
  title,
  description,
  category,
  href,
  ready,
  isPinned,
  onTogglePin,
}: {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string | null;
  ready: boolean;
  isPinned: boolean;
  onTogglePin: () => void;
}) {
  void id;

  const cardStyle = {
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border-light)",
    borderRadius: "4px",
    padding: "1.25rem",
    paddingRight: "2.75rem", // ピンボタンの分のスペース
    display: "flex",
    flexDirection: "column" as const,
    height: "100%",
    textDecoration: "none",
    opacity: ready ? 1 : 0.55,
    cursor: ready ? "pointer" : "default",
    overflow: "hidden" as const,
    boxSizing: "border-box" as const,
  };

  const inner = (
    <>
      <div
        style={{
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-noto-sans), sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--ink)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {title}
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
                flexShrink: 0,
              }}
            >
              準備中
            </span>
          )}
        </div>
      </div>
      <p
        style={{
          fontFamily: "var(--font-noto-sans), sans-serif",
          fontSize: "12px",
          color: "var(--ink-light)",
          lineHeight: 1.6,
          margin: "0 0 0.75rem",
          flex: 1,
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

  const card =
    ready && href ? (
      <Link href={href} style={cardStyle} aria-label={title}>
        {inner}
      </Link>
    ) : (
      <div style={cardStyle} aria-disabled="true">
        {inner}
      </div>
    );

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {card}
      {ready && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTogglePin();
          }}
          aria-label={isPinned ? "ピン解除" : "ピン止め"}
          title={isPinned ? "ピン解除" : "ピン止め"}
          style={{
            position: "absolute",
            top: "0.875rem",
            right: "0.875rem",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            color: isPinned ? "var(--teal)" : "var(--ink-faint)",
            fontSize: "14px",
            lineHeight: 1,
            transition: "color 0.15s",
            borderRadius: "3px",
          }}
        >
          {isPinned ? "★" : "☆"}
        </button>
      )}
    </div>
  );
}
