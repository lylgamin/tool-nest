# tool-nest

[![Cloudflare Pages](https://img.shields.io/badge/Hosted%20on-Cloudflare%20Pages-f38020?logo=cloudflare&logoColor=white)](https://tool-nest.pages.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-1b2d4f)](./LICENSE)
[![Tests: Vitest](https://img.shields.io/badge/Tests-Vitest-6e9f18?logo=vitest&logoColor=white)](https://vitest.dev)

> **ブラウザだけで動く、開発者向けユーティリティツール集。**
> Browser-based utility tools for developers — no backend, no tracking, just code.

🌐 **https://tool-nest.pages.dev**

---

## ツール一覧 / Tools（51本）

### テキスト / Text

| ツール | 説明 | ページ |
|---|---|---|
| 文字数カウンター | 文字数・バイト数・単語数・行数をリアルタイム計測。日本語UTF-8対応 | [/character-count](https://tool-nest.pages.dev/character-count) |
| 正規表現テスター | パターンとテストテキストを入力してマッチ結果をリアルタイム確認。g/i/mフラグ・キャプチャグループ対応 | [/regex-tester](https://tool-nest.pages.dev/regex-tester) |
| テキスト差分ツール | 2つのテキストを行単位で比較。追加・削除をハイライト表示。LCSアルゴリズム使用 | [/text-diff](https://tool-nest.pages.dev/text-diff) |
| テキスト → Markdown Table | CSV・TSVをMarkdownテーブルに変換。1行目をヘッダーとして自動認識 | [/text-to-table](https://tool-nest.pages.dev/text-to-table) |
| テキスト行操作 | 重複削除・ソート・逆順・番号付け・空行削除・トリム。ログやリストの整理に | [/text-lines](https://tool-nest.pages.dev/text-lines) |

### エンコード / Encode

| ツール | 説明 | ページ |
|---|---|---|
| Base64変換 | テキストをBase64エンコード/デコード。日本語（UTF-8）・URL-safe形式対応 | [/base64](https://tool-nest.pages.dev/base64) |
| URLエンコード | パーセントエンコーディングでエンコード/デコード。日本語や特殊文字に対応 | [/url-encode](https://tool-nest.pages.dev/url-encode) |
| HTMLエスケープ | &・<・>・"・' などをエスケープ/アンエスケープ。XSS対策の確認に | [/html-escape](https://tool-nest.pages.dev/html-escape) |
| 全角・半角変換 | 英数字・記号・カタカナ（濁音・半濁音含む）を全角⇔半角に変換 | [/zenkaku-hankaku](https://tool-nest.pages.dev/zenkaku-hankaku) |
| JWTデコーダー | JWT のヘッダー・ペイロードをデコード表示。exp クレームの期限確認付き。署名検証なし | [/jwt-decoder](https://tool-nest.pages.dev/jwt-decoder) |
| URLパーサー | URLをプロトコル・ホスト・パス・クエリパラメータに分解して表示 | [/url-parser](https://tool-nest.pages.dev/url-parser) |
| 文字コード変換 | 文字のUnicodeコードポイント・UTF-8バイト列・HTML実体参照を表示。U+XXXX逆引き対応 | [/char-code](https://tool-nest.pages.dev/char-code) |
| 文字列エスケープ変換 | JS・JSON・Python・SQLの文字列エスケープ/アンエスケープ変換 | [/string-escape](https://tool-nest.pages.dev/string-escape) |
| 画像 → Base64変換 | 画像ファイルをBase64 Data URIに変換。PNG・JPEG・GIF・WebP・SVG対応。ドラッグ＆ドロップ可 | [/image-to-base64](https://tool-nest.pages.dev/image-to-base64) |

### フォーマット / Format

| ツール | 説明 | ページ |
|---|---|---|
| JSONフォーマッター | JSONの整形・圧縮・構文チェック。インデント幅2/4スペース・タブ選択対応 | [/json-formatter](https://tool-nest.pages.dev/json-formatter) |
| SQLフォーマッター | SQLをキーワード大文字化・インデント整形・圧縮。主要句を自動改行 | [/sql-formatter](https://tool-nest.pages.dev/sql-formatter) |
| JSONパスクエリ | JSONPath式（$.foo・$..key・[*]等）でJSONをクエリ。外部ライブラリ不使用 | [/json-path](https://tool-nest.pages.dev/json-path) |
| JSONスキーマ生成 | JSONオブジェクトからJSON Schema（draft-07）を自動生成。型・required・propertiesを再帰推論 | [/json-schema](https://tool-nest.pages.dev/json-schema) |
| JSON Diff | 2つのJSONオブジェクトを比較してキーパス単位の差分を表示。追加・削除・変更・未変更を色分け | [/json-diff](https://tool-nest.pages.dev/json-diff) |

### 変換 / Convert

| ツール | 説明 | ページ |
|---|---|---|
| キャメルケース変換 | snake_case・kebab-case等をcamelCase / PascalCaseに変換 | [/camel-case](https://tool-nest.pages.dev/camel-case) |
| ケバブ・スネークケース変換 | camelCase・PascalCase等をkebab-case / snake_caseに変換 | [/kebab-case](https://tool-nest.pages.dev/kebab-case) |
| UNIXタイム変換 | UNIXタイムスタンプと日時（年月日時分秒）を相互変換 | [/unix-time](https://tool-nest.pages.dev/unix-time) |
| 西暦・和暦変換 | 西暦と和暦（令和・平成・昭和・大正・明治）を相互変換。元号境界を正確に処理 | [/wareki](https://tool-nest.pages.dev/wareki) |
| タイムゾーン変換 | UTC・JST・EST・PST等8タイムゾーンに一括変換。Intl.DateTimeFormat使用 | [/timezone](https://tool-nest.pages.dev/timezone) |
| 進数変換 | 10進・2進・8進・16進を相互変換。ビット演算や組み込みデバッグに | [/number-base](https://tool-nest.pages.dev/number-base) |
| HTML ↔ JSX変換 | HTMLをReact用JSXに変換。class→className・style文字列→オブジェクト等を自動変換 | [/html-to-jsx](https://tool-nest.pages.dev/html-to-jsx) |
| CSV ↔ JSON変換 | CSVとJSONを双方向変換。CSVヘッダーをキーとしたJSONオブジェクト配列に変換 | [/csv-json](https://tool-nest.pages.dev/csv-json) |
| JSON → TypeScript型生成 | JSONオブジェクトからTypeScriptのinterface・type定義を自動生成 | [/json-to-ts](https://tool-nest.pages.dev/json-to-ts) |
| curl → Fetch/Axios/Python変換 | curlコマンドをFetch API・Axios・Python requestsのコードに変換 | [/curl-to-fetch](https://tool-nest.pages.dev/curl-to-fetch) |
| カラーコード変換 | HEX・RGB・HSL・HSVカラーコードを相互変換。カラーピッカー付き | [/color-converter](https://tool-nest.pages.dev/color-converter) |
| 単位変換 | 長さ・重量・温度・速度・面積の単位を相互変換。メートル法・ヤードポンド法対応 | [/unit-converter](https://tool-nest.pages.dev/unit-converter) |

### 生成 / Generate

| ツール | 説明 | ページ |
|---|---|---|
| UUID生成 | UUIDv4を最大20個一括生成。大文字/小文字切替・個別コピー・全件コピー対応 | [/uuid-generator](https://tool-nest.pages.dev/uuid-generator) |
| ハッシュ生成 | SHA-1・SHA-256・SHA-384・SHA-512のハッシュ値を生成。Web Crypto API使用 | [/hash](https://tool-nest.pages.dev/hash) |
| パスワード生成 | 大文字・小文字・数字・記号の組み合わせでランダムパスワードを生成。エントロピー表示付き | [/password-generator](https://tool-nest.pages.dev/password-generator) |
| Gitコミットメッセージ生成 | Conventional Commits形式のコミットメッセージをGUIで作成。11種のタイプ・BREAKING CHANGE対応 | [/git-commit-builder](https://tool-nest.pages.dev/git-commit-builder) |
| .gitignore生成 | Node.js/Python/Java/React/Go/Rust等8テンプレートから.gitignoreを生成 | [/gitignore-generator](https://tool-nest.pages.dev/gitignore-generator) |
| QRコード生成 | テキスト・URLからQRコードを生成。SVG・PNG形式でダウンロード可能 | [/qr-generator](https://tool-nest.pages.dev/qr-generator) |
| CSPジェネレーター | Content Security Policyヘッダーを10ディレクティブのGUIで生成・編集 | [/csp-generator](https://tool-nest.pages.dev/csp-generator) |

### 計算 / Calculate

| ツール | 説明 | ページ |
|---|---|---|
| 日本の祝日計算 | 指定年の祝日一覧を計算。ハッピーマンデー・振替休日・国民の祝日対応 | [/japan-holidays](https://tool-nest.pages.dev/japan-holidays) |
| 営業日計算 | 期間の営業日数を計算。祝日リスト貼り付け・土曜除外オプション付き | [/business-days](https://tool-nest.pages.dev/business-days) |
| 六十干支計算 | 西暦から十干・十二支（六十干支）と読みを表示。60年サイクル一覧付き | [/rokujukkanshi](https://tool-nest.pages.dev/rokujukkanshi) |
| 経過日数・週数計算 | 年間の経過日数・残り日数・進捗・ISO週番号を計算 | [/day-of-year](https://tool-nest.pages.dev/day-of-year) |
| Byte単位変換 | B・KB・MB・GB・TBを相互変換。SI（10進）とIEC（2進・1024）両対応 | [/byte-converter](https://tool-nest.pages.dev/byte-converter) |
| cron式パーサー | cron式を日本語で解説し、次回実行時刻を5件表示。よく使うプリセット付き | [/cron-parser](https://tool-nest.pages.dev/cron-parser) |
| 日時差分計算 | 2つの日時の差を日・時間・分・秒・年月日で計算 | [/date-diff](https://tool-nest.pages.dev/date-diff) |
| コントラスト比チェッカー | テキスト色と背景色のコントラスト比を計算。WCAG 2.1 AA・AAAレベル判定付き | [/contrast-checker](https://tool-nest.pages.dev/contrast-checker) |
| パスワード強度チェック | パスワードのエントロピー（bits）・強度スコアを計算。改善提案と解読時間の目安を表示 | [/password-strength](https://tool-nest.pages.dev/password-strength) |
| ビット演算計算機 | AND・OR・XOR・NOT・LSHIFT・RSHIFTのビット演算を2進/8進/10進/16進で計算 | [/bitwise-calculator](https://tool-nest.pages.dev/bitwise-calculator) |
| Semantic Version 比較 | semverのバージョン比較・バンプ（major/minor/patch）・レンジ（^/~/>=/<）判定 | [/semver](https://tool-nest.pages.dev/semver) |

### リファレンス / Reference

| ツール | 説明 | ページ |
|---|---|---|
| HTTPステータスコード一覧 | HTTPステータスコードの意味・用途を日本語で解説。コード番号・キーワード検索対応 | [/http-status](https://tool-nest.pages.dev/http-status) |
| OGPメタタグ プレビュー | OGP metaタグを入力してTwitter/X・Slackでの見え方をリアルタイムシミュレート | [/ogp-preview](https://tool-nest.pages.dev/ogp-preview) |

---

## 技術スタック / Tech Stack

- **Next.js 16** — App Router、静的エクスポート (`output: "export"`)
- **TypeScript** — 全ファイル型付き
- **Tailwind CSS v4** — PostCSS 経由、設定はゼロコンフィグ
- **Vitest + React Testing Library** — テストファースト開発（360+ テスト）
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
日本語圏の開発者をターゲットに、各ツールページには説明・実装コード・FAQ・使用例を含めます。

**テストファースト / Test-first**
実装前にテストを書きます。コアロジックは純粋関数として切り出し、単体テスト可能な設計にします。

**教育的コード品質 / Educational Code Quality**
ソースコードは公開前提。他の開発者が読んで学べる・そのまま取り込める品質を目指します。

---

## ライセンス / License

[MIT](./LICENSE)
