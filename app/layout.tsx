import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  JetBrains_Mono,
  Noto_Sans_JP,
  Noto_Serif_JP,
} from "next/font/google";
import Script from "next/script";
import Nav from "./_components/Nav";
import Footer from "./_components/Footer";
import CookieBanner from "./_components/CookieBanner";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const notoSans = Noto_Sans_JP({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const notoSerif = Noto_Serif_JP({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "tool-nest — 開発者向けユーティリティ",
    template: "%s | tool-nest",
  },
  description:
    "JSONフォーマッター・文字数カウンター・Base64変換など、開発者向けWebユーティリティを無料で提供。サーバー不要・ブラウザで完結。",
  metadataBase: new URL("https://tool-nest.pages.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontVars = [
    cormorant.variable,
    jetbrains.variable,
    notoSans.variable,
    notoSerif.variable,
  ].join(" ");

  return (
    <html lang="ja">
      <body
        className={fontVars}
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9891812277341685"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Nav />
        <div style={{ flex: 1 }}>{children}</div>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
