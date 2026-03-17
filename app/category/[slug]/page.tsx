import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, TOOLS, type Tool } from "../../_data/tools";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.id === slug);
  if (!cat) return {};
  return {
    title: `${cat.label}ツール一覧`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.id === slug);
  if (!cat) notFound();

  const tools = TOOLS.filter((t) => t.category === slug && t.ready);
  const otherCategories = CATEGORIES.filter((c) => c.id !== slug);

  return (
    <main>
      {/* ヒーロー */}
      <section
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "4rem 1.5rem 3rem",
        }}
      >
        {/* パンくず */}
        <nav
          aria-label="パンくずリスト"
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "11px",
            color: "var(--ink-light)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Link href="/" style={{ color: "var(--ink-light)", textDecoration: "none" }}>
            ツール一覧
          </Link>
          <span>/</span>
          <span style={{ color: "var(--ink-mid)" }}>{cat.label}</span>
        </nav>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "48px",
            height: "48px",
            border: "2px solid var(--navy)",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--navy)",
            marginBottom: "1.25rem",
          }}
        >
          {cat.icon}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            fontWeight: 500,
            color: "var(--ink)",
            lineHeight: 1.1,
            margin: "0 0 1rem",
          }}
        >
          {cat.label}
          <em style={{ fontStyle: "italic", color: "var(--navy)", marginLeft: "0.4em" }}>
            ツール
          </em>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-noto-sans), sans-serif",
            fontSize: "15px",
            color: "var(--ink-mid)",
            lineHeight: 1.8,
            margin: "0 0 1rem",
            maxWidth: "480px",
          }}
        >
          {cat.description}
        </p>

        <span
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "10px",
            letterSpacing: "0.12em",
            color: "var(--teal)",
            border: "1px solid var(--teal)",
            borderRadius: "2px",
            padding: "2px 8px",
          }}
        >
          {tools.length} tools
        </span>
      </section>

      {/* ツールグリッド */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1.5rem 4rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {tools.map((tool) => (
            <CategoryToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* 他カテゴリリンク */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1.5rem 6rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-noto-serif), serif",
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--ink)",
            margin: "0 0 1.25rem",
          }}
        >
          他のカテゴリ
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          {otherCategories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border-light)",
                borderRadius: "4px",
                padding: "8px 14px",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "12px",
                  color: "var(--navy)",
                }}
              >
                {c.icon}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-noto-sans), sans-serif",
                  fontSize: "13px",
                  color: "var(--ink-mid)",
                }}
              >
                {c.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "9px",
                  color: "var(--ink-faint)",
                  letterSpacing: "0.1em",
                }}
              >
                {c.count}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function CategoryToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      aria-label={tool.title}
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border-light)",
        borderRadius: "4px",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        textDecoration: "none",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-noto-sans), sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          color: "var(--ink)",
          marginBottom: "8px",
        }}
      >
        {tool.title}
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
        {tool.description}
      </p>
      <div
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "9px",
          letterSpacing: "0.12em",
          color: "var(--teal)",
          textTransform: "uppercase",
        }}
      >
        {tool.href}
      </div>
    </Link>
  );
}
