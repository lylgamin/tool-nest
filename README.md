# tool-nest

[![Cloudflare Pages](https://img.shields.io/badge/Hosted%20on-Cloudflare%20Pages-f38020?logo=cloudflare&logoColor=white)](https://tool-nest.pages.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-1b2d4f)](./LICENSE)
[![Tests: Vitest](https://img.shields.io/badge/Tests-Vitest-6e9f18?logo=vitest&logoColor=white)](https://vitest.dev)

> **ブラウザだけで動く、開発者向けユーティリティツール集。**
> Browser-based utility tools for developers — no backend, no tracking, just code.

🌐 **https://tool-nest.pages.dev**

---

## ツール一覧 / Tools

| ツール / Tool | 説明 / Description | ページ / Page |
|---|---|---|
| 文字数カウンター | 文字数・バイト数・単語数・行数をリアルタイム計測 | [/character-count](https://tool-nest.pages.dev/character-count) |
| 西暦・和暦変換 | 西暦と和暦（令和・平成・昭和・大正・明治）を相互変換 | [/wareki](https://tool-nest.pages.dev/wareki) |
| 日本の祝日計算 | 指定年の祝日一覧を計算。ハッピーマンデー・振替休日対応 | [/japan-holidays](https://tool-nest.pages.dev/japan-holidays) |
| 営業日計算 | 期間の営業日数を計算。祝日リスト貼り付け・土曜除外オプション付き | [/business-days](https://tool-nest.pages.dev/business-days) |
| 六十干支計算 | 西暦から十干・十二支（六十干支）と読みを計算。60年サイクル一覧付き | [/rokujukkanshi](https://tool-nest.pages.dev/rokujukkanshi) |
| UNIXタイムスタンプ変換 | UNIXタイムスタンプと日時（UTC/JST）を相互変換 | [/unix-time](https://tool-nest.pages.dev/unix-time) |
| タイムゾーン変換 | 日時をUTC・JST・EST等8タイムゾーンに一括変換 | [/timezone](https://tool-nest.pages.dev/timezone) |
| 経過日数・週数計算 | 年間の経過日数・残り日数・進捗・ISO週番号を計算 | [/day-of-year](https://tool-nest.pages.dev/day-of-year) |

新しいツールは随時追加予定です。 / More tools coming soon.

---

## 技術スタック / Tech Stack

- **Next.js 15** — App Router、静的エクスポート (`output: "export"`)
- **TypeScript** — 全ファイル型付き
- **Tailwind CSS v4** — PostCSS 経由、設定はゼロコンフィグ
- **Vitest + React Testing Library** — テストファースト開発
- **Cloudflare Pages** — 無料プランで静的ホスティング

---

## はじめ方 / Getting Started

### 前提条件 / Prerequisites

- Node.js 20+
- npm

### インストール / Install

```bash
git clone https://github.com/lylgamin/tool-nest.git
cd tool-nest
npm install
```

### 開発サーバー起動 / Dev Server

```bash
npm run dev
# → http://localhost:3000
```

### テスト / Test

```bash
npm run test        # 単発実行 / single run
npm run test:watch  # ウォッチモード / watch mode
```

### ビルド / Build

```bash
npm run build
# → out/ に静的ファイルを出力 / outputs static files to out/
```

---

## 設計方針 / Design Principles

**外部ライブラリ原則禁止**
標準ブラウザ API + React のみで実装します。コードをコピーしてどこでも動く状態を保ちます。

> No third-party utility libraries. Every tool runs on standard browser APIs + React, so you can copy the core logic into any project.

**バックエンドなし / No Backend**
全ツールはクライアントサイドのみで動作します。サーバー・DB・API ルートは一切使いません。

> All processing happens in the browser. Nothing is sent to a server.

**日本語ファースト・SEO 重視 / Japanese-first, SEO-oriented**
日本語圏の開発者をターゲットに、各ツールページには説明・実装コード・使用例を含めます。

**テストファースト / Test-first**
実装前にテストを書きます。コアロジックは純粋関数として切り出し、単体テスト可能な設計にします。

**教育的コード品質 / Educational Code Quality**
ソースコードは公開前提。他の開発者が読んで学べる・そのまま取り込める品質を目指します。

---

## ライセンス / License

[MIT](./LICENSE)
