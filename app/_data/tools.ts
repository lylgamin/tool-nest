export type Category = {
  id: string
  label: string
  icon: string
  count: number
  description: string
}

export type Tool = {
  id: string
  title: string
  description: string
  category: string
  href: string
  ready: boolean
}

export const CATEGORIES: Category[] = [
  {
    id: "text",
    label: "テキスト",
    icon: "Tt",
    count: 5,
    description: "文字数カウント・正規表現・テキスト差分など文字列処理ツール",
  },
  {
    id: "encode",
    label: "エンコード",
    icon: "{}",
    count: 9,
    description: "Base64・URLエンコード・HTMLエスケープなどエンコード変換ツール",
  },
  {
    id: "format",
    label: "フォーマット",
    icon: "<>",
    count: 5,
    description: "JSON・SQL・JSONPathなどデータ整形ツール",
  },
  {
    id: "convert",
    label: "変換",
    icon: "⇄",
    count: 12,
    description: "ケース変換・日時変換・進数変換などあらゆる変換ツール",
  },
  {
    id: "generate",
    label: "生成",
    icon: "✦",
    count: 7,
    description: "UUID・ハッシュ・パスワード・QRコードなど生成ツール",
  },
  {
    id: "calc",
    label: "計算",
    icon: "#",
    count: 13,
    description: "営業日計算・Byte変換・消費税・割合計算など計算ツール",
  },
  {
    id: "ref",
    label: "リファレンス",
    icon: "?",
    count: 3,
    description: "HTTPステータスコード・ポート番号・OGPプレビューなどリファレンスツール",
  },
]

export const TOOLS: Tool[] = [
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
    description:
      "西暦（グレゴリオ暦）と和暦（令和・平成・昭和・大正・明治）を相互変換。元号境界を正確に処理。",
    category: "convert",
    href: "/wareki",
    ready: true,
  },
  {
    id: "japan-holidays",
    title: "日本の祝日計算",
    description:
      "指定した年の祝日一覧を計算します。ハッピーマンデー・振替休日・国民の祝日に対応。",
    category: "calc",
    href: "/japan-holidays",
    ready: true,
  },
  {
    id: "business-days",
    title: "営業日計算",
    description:
      "期間の営業日数を計算します。祝日リスト貼り付け・土曜除外オプション付き。",
    category: "calc",
    href: "/business-days",
    ready: true,
  },
  {
    id: "rokujukkanshi",
    title: "六十干支計算",
    description:
      "西暦を入力すると十干・十二支の組み合わせ（六十干支）と読みを表示。60年サイクル一覧付き。",
    category: "convert",
    href: "/rokujukkanshi",
    ready: true,
  },
  {
    id: "timezone",
    title: "タイムゾーン変換",
    description:
      "日時を入力してUTC・JST・EST・PST等8タイムゾーンに一括変換。Intl.DateTimeFormat使用。",
    category: "convert",
    href: "/timezone",
    ready: true,
  },
  {
    id: "day-of-year",
    title: "経過日数・週数計算",
    description:
      "日付を入力すると年間の経過日数・残り日数・進捗・ISO週番号を計算します。",
    category: "calc",
    href: "/day-of-year",
    ready: true,
  },
  {
    id: "regex-tester",
    title: "正規表現テスター",
    description:
      "正規表現パターンとテスト対象テキストを入力し、マッチ結果をリアルタイム確認。g/i/mフラグ・キャプチャグループに対応。",
    category: "text",
    href: "/regex-tester",
    ready: true,
  },
  {
    id: "jwt-decoder",
    title: "JWTデコーダー",
    description:
      "JWT（JSON Web Token）のヘッダー・ペイロードをデコードして表示。expクレームの期限確認付き。署名検証なし。",
    category: "encode",
    href: "/jwt-decoder",
    ready: true,
  },
  {
    id: "http-status",
    title: "HTTPステータスコード一覧",
    description:
      "HTTPステータスコードの意味・用途を日本語で解説。コード番号やキーワードで検索・カテゴリフィルタ対応。",
    category: "ref",
    href: "/http-status",
    ready: true,
  },
  {
    id: "number-base",
    title: "進数変換",
    description:
      "10進・2進・8進・16進を相互に変換。ビット演算や組み込みデバッグに。",
    category: "convert",
    href: "/number-base",
    ready: true,
  },
  {
    id: "url-parser",
    title: "URLパーサー",
    description:
      "URLをプロトコル・ホスト・パス・クエリパラメータに分解して表示。デバッグに便利。",
    category: "encode",
    href: "/url-parser",
    ready: true,
  },
  {
    id: "byte-converter",
    title: "Byte単位変換",
    description:
      "B・KB・MB・GB・TB を相互変換。SI（10進）と IEC（2進・1024）の両方に対応。",
    category: "calc",
    href: "/byte-converter",
    ready: true,
  },
  {
    id: "cron-parser",
    title: "cron式パーサー",
    description:
      "cron式を入力すると日本語で意味を解説し、次回実行時刻を5件表示。よく使うプリセット付き。",
    category: "calc",
    href: "/cron-parser",
    ready: true,
  },
  {
    id: "date-diff",
    title: "日時差分計算",
    description:
      "2つの日時の差を日・時間・分・秒・年月日で計算。デプロイ間隔やプロジェクト期間の確認に。",
    category: "calc",
    href: "/date-diff",
    ready: true,
  },
  {
    id: "password-generator",
    title: "パスワード生成",
    description:
      "大文字・小文字・数字・記号の組み合わせでランダムパスワードを生成。強度（エントロピー）表示付き。",
    category: "generate",
    href: "/password-generator",
    ready: true,
  },
  {
    id: "html-to-jsx",
    title: "HTML ↔ JSX 変換",
    description:
      "HTMLをReact用JSXに変換します。class→className、for→htmlFor、onclick→onClick、style文字列→オブジェクトなどを自動変換。",
    category: "convert",
    href: "/html-to-jsx",
    ready: true,
  },
  {
    id: "sql-formatter",
    title: "SQLフォーマッター",
    description:
      "SQLをキーワード大文字化・インデント整形・圧縮できます。SELECT/FROM/WHERE/JOIN等の主要句を自動改行。",
    category: "format",
    href: "/sql-formatter",
    ready: true,
  },
  {
    id: "contrast-checker",
    title: "コントラスト比チェッカー",
    description:
      "テキスト色と背景色のコントラスト比を計算し、WCAG 2.1のAA・AAAレベルを満たすか判定します。カラーピッカー付き。",
    category: "calc",
    href: "/contrast-checker",
    ready: true,
  },
  {
    id: "csv-json",
    title: "CSV ↔ JSON 変換",
    description:
      "CSVとJSONを双方向に変換。CSVヘッダーをキーとしたJSONオブジェクト配列に変換し、テーブルプレビューを表示します。",
    category: "convert",
    href: "/csv-json",
    ready: true,
  },
  {
    id: "json-to-ts",
    title: "JSON → TypeScript型生成",
    description:
      "JSONオブジェクトからTypeScriptのinterface・type定義を自動生成します。型名指定・interface/type切替対応。",
    category: "convert",
    href: "/json-to-ts",
    ready: true,
  },
  {
    id: "git-commit-builder",
    title: "Gitコミットメッセージ生成",
    description:
      "Conventional Commits形式のコミットメッセージをGUIで作成。feat/fix/docs等11種のタイプ、スコープ、BREAKING CHANGE対応。",
    category: "generate",
    href: "/git-commit-builder",
    ready: true,
  },
  {
    id: "gitignore-generator",
    title: ".gitignore生成",
    description:
      "Node.js/Python/Java/React/Go/Rust/Terraform/Unityなど8テンプレートから選択して.gitignoreを生成。ダウンロードボタン付き。",
    category: "generate",
    href: "/gitignore-generator",
    ready: true,
  },
  {
    id: "qr-generator",
    title: "QRコード生成",
    description:
      "テキスト・URLからQRコードを生成。SVG・PNG形式でダウンロード可能。サイズ200/300/400px選択対応。",
    category: "generate",
    href: "/qr-generator",
    ready: true,
  },
  {
    id: "curl-to-fetch",
    title: "curl → Fetch / Axios / Python変換",
    description:
      "curlコマンドをFetch API・Axios・Python requestsのコードに変換。-X/-H/-d/-uオプション対応。サンプル付き。",
    category: "convert",
    href: "/curl-to-fetch",
    ready: true,
  },
  {
    id: "ogp-preview",
    title: "OGPメタタグ プレビュー",
    description:
      "OGPのmetaタグを入力してTwitter/X・Slackでの見え方をリアルタイムシミュレート。metaタグのHTML生成付き。",
    category: "ref",
    href: "/ogp-preview",
    ready: true,
  },
  {
    id: "text-diff",
    title: "テキスト差分ツール",
    description:
      "2つのテキストを行単位で比較し、追加・削除された行をハイライト表示します。LCSアルゴリズム使用。",
    category: "text",
    href: "/text-diff",
    ready: true,
  },
  {
    id: "char-code",
    title: "文字コード変換",
    description:
      "文字のUnicodeコードポイント・UTF-8バイト列・HTML実体参照を表示。U+XXXX形式からの逆引きも可能。",
    category: "encode",
    href: "/char-code",
    ready: true,
  },
  {
    id: "json-path",
    title: "JSONパスクエリ",
    description:
      "JSONPath式（$.foo.bar・$..key・[*]など）でJSONデータをクエリ・デバッグできます。外部ライブラリ不使用。",
    category: "format",
    href: "/json-path",
    ready: true,
  },
  {
    id: "password-strength",
    title: "パスワード強度チェック",
    description:
      "パスワードのエントロピー（bits）・文字集合・強度スコアを計算。改善提案と解読時間の目安を表示。",
    category: "calc",
    href: "/password-strength",
    ready: true,
  },
  {
    id: "color-converter",
    title: "カラーコード変換",
    description:
      "HEX・RGB・HSL・HSVカラーコードを相互に変換。カラーピッカーで直感的に色を選択できます。",
    category: "convert",
    href: "/color-converter",
    ready: true,
  },
  {
    id: "text-to-table",
    title: "テキスト → Markdown Table",
    description:
      "CSVやTSVをMarkdownのテーブル形式に変換。1行目をヘッダーとして自動認識し、セル内の | をエスケープします。",
    category: "text",
    href: "/text-to-table",
    ready: true,
  },
  {
    id: "text-lines",
    title: "テキスト行操作",
    description:
      "テキストの行を重複削除・ソート・逆順・番号付け・空行削除・トリムで整形。ログやリストの整理に便利。",
    category: "text",
    href: "/text-lines",
    ready: true,
  },
  {
    id: "string-escape",
    title: "文字列エスケープ変換",
    description:
      "JS・JSON・Python・SQLの文字列エスケープ／アンエスケープを変換。\\n・\\t・クォートなどの特殊文字を正確に処理。",
    category: "encode",
    href: "/string-escape",
    ready: true,
  },
  {
    id: "image-to-base64",
    title: "画像 → Base64変換",
    description:
      "画像ファイルをBase64エンコードしてData URI形式に変換。PNG・JPEG・GIF・WebP・SVG対応。ドラッグ＆ドロップ可。",
    category: "encode",
    href: "/image-to-base64",
    ready: true,
  },
  {
    id: "json-schema",
    title: "JSON スキーマ生成",
    description:
      "JSONオブジェクトからJSON Schema（draft-07）を自動生成。型・required・propertiesを再帰的に推論します。",
    category: "format",
    href: "/json-schema",
    ready: true,
  },
  {
    id: "json-diff",
    title: "JSON Diff",
    description:
      "2つのJSONオブジェクトを比較してキーパス単位の差分を表示。追加・削除・変更・未変更を色分けします。",
    category: "format",
    href: "/json-diff",
    ready: true,
  },
  {
    id: "unit-converter",
    title: "単位変換",
    description:
      "長さ・重量・温度・速度・面積の単位を相互変換。メートル法・ヤードポンド法・温度（℃・℉・K）に対応。",
    category: "calc",
    href: "/unit-converter",
    ready: true,
  },
  {
    id: "bitwise-calculator",
    title: "ビット演算計算機",
    description:
      "AND・OR・XOR・NOT・LSHIFT・RSHIFTのビット演算を2進/8進/10進/16進で計算。32bit符号なし整数対応。",
    category: "calc",
    href: "/bitwise-calculator",
    ready: true,
  },
  {
    id: "semver",
    title: "Semantic Version 比較",
    description:
      "semverのバージョン比較・バンプ（major/minor/patch）・レンジ（^/~/>=/<）の判定ができます。",
    category: "calc",
    href: "/semver",
    ready: true,
  },
  {
    id: "csp-generator",
    title: "CSPジェネレーター",
    description:
      "Content Security Policyヘッダーを10ディレクティブのGUIで生成・編集。既存CSPのインポート・パース機能付き。",
    category: "generate",
    href: "/csp-generator",
    ready: true,
  },
  {
    id: "tax-calculator",
    title: "消費税計算",
    description:
      "税抜き価格から税込み価格、税込み価格から税抜き価格を計算。消費税10%・軽減税率8%・端数処理（切り捨て/切り上げ/四捨五入）に対応。",
    category: "calc",
    href: "/tax-calculator",
    ready: true,
  },
  {
    id: "percentage-calculator",
    title: "割合・パーセント計算",
    description:
      "割合計算・増減率計算・逆算など4パターンに対応。消費増税・割引率・達成率など業務でよく使うパーセント計算を手軽に。",
    category: "calc",
    href: "/percentage-calculator",
    ready: true,
  },
  {
    id: "port-numbers",
    title: "ポート番号一覧",
    description:
      "TCP/UDPポート番号の用途を検索できます。Well-Known（0-1023）・Registered（1024-49151）の主要サービスをキーワード・カテゴリで絞り込み。",
    category: "ref",
    href: "/port-numbers",
    ready: true,
  },
]
