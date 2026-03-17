"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TOOLS, CATEGORIES } from "../_data/tools";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.trim() === ""
    ? TOOLS.filter((t) => t.ready).slice(0, 8)
    : TOOLS.filter((t) => {
        if (!t.ready) return false;
        const q = query.toLowerCase();
        return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      }).slice(0, 8);

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, []);

  const navigate = useCallback(
    (href: string) => {
      closePalette();
      router.push(href);
    },
    [closePalette, router]
  );

  // カスタムイベントの購読
  useEffect(() => {
    window.addEventListener("open-command-palette", openPalette);
    return () => window.removeEventListener("open-command-palette", openPalette);
  }, [openPalette]);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          closePalette();
        } else {
          openPalette();
        }
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        closePalette();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        const tool = results[selectedIndex];
        if (tool) navigate(tool.href);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, openPalette, closePalette, navigate, results, selectedIndex]);

  // open 時のスクロールロックとフォーカス
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);


  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="コマンドパレット"
      onClick={closePalette}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(25,22,26,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "18vh",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "560px",
          margin: "0 1rem",
          backgroundColor: "var(--surface-alt)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {/* 検索入力 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border-light)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "14px",
              color: "var(--ink-faint)",
              flexShrink: 0,
            }}
          >
            /
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="ツールを検索..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-noto-sans), sans-serif",
              fontSize: "15px",
              color: "var(--ink)",
            }}
          />
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
            Esc
          </kbd>
        </div>

        {/* 結果リスト */}
        <ul
          role="listbox"
          style={{ margin: 0, padding: "6px 0", listStyle: "none", maxHeight: "320px", overflowY: "auto" }}
        >
          {results.length === 0 ? (
            <li
              style={{
                padding: "24px 16px",
                textAlign: "center",
                fontFamily: "var(--font-noto-sans), sans-serif",
                fontSize: "13px",
                color: "var(--ink-light)",
              }}
            >
              「{query}」に一致するツールが見つかりません
            </li>
          ) : (
            results.map((tool, i) => {
              const isSelected = i === selectedIndex;
              const cat = CATEGORIES.find((c) => c.id === tool.category);
              return (
                <li
                  key={tool.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => navigate(tool.href)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 16px",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "var(--navy-light)" : "transparent",
                    borderLeft: isSelected ? "3px solid var(--teal)" : "3px solid transparent",
                    transition: "background-color 0.1s",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "2px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-noto-sans), sans-serif",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "var(--ink)",
                        }}
                      >
                        {tool.title}
                      </span>
                      {cat && (
                        <span
                          style={{
                            fontFamily: "var(--font-jetbrains), monospace",
                            fontSize: "9px",
                            letterSpacing: "0.12em",
                            color: "var(--ink-light)",
                            border: "1px solid var(--border-light)",
                            borderRadius: "2px",
                            padding: "1px 5px",
                            textTransform: "uppercase",
                            flexShrink: 0,
                          }}
                        >
                          {cat.label}
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-noto-sans), sans-serif",
                        fontSize: "11px",
                        color: "var(--ink-light)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tool.description}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "10px",
                      color: "var(--ink-faint)",
                      flexShrink: 0,
                    }}
                  >
                    {tool.href}
                  </span>
                </li>
              );
            })
          )}
        </ul>

        {/* フッター */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            padding: "8px 16px",
            borderTop: "1px solid var(--border-light)",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "10px",
            color: "var(--ink-faint)",
            letterSpacing: "0.06em",
          }}
        >
          <span>↑↓ 移動</span>
          <span>Enter 開く</span>
          <span>Esc 閉じる</span>
        </div>
      </div>
    </div>
  );
}
