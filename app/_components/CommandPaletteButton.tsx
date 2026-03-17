"use client";

export default function CommandPaletteButton() {
  const open = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <button
      onClick={open}
      aria-label="コマンドパレットを開く"
      title="コマンドパレット (Ctrl+K)"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "none",
        border: "1px solid var(--border)",
        borderRadius: "4px",
        padding: "5px 10px",
        cursor: "pointer",
        color: "var(--ink-light)",
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: "11px",
        letterSpacing: "0.04em",
        transition: "border-color 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--teal)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--teal)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-light)";
      }}
    >
      <span>検索</span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "2px",
          opacity: 0.7,
        }}
      >
        <kbd style={{ fontFamily: "inherit", fontSize: "10px" }}>⌘</kbd>
        <kbd style={{ fontFamily: "inherit", fontSize: "10px" }}>K</kbd>
      </span>
    </button>
  );
}
