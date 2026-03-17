export type HttpStatusCode = {
  code: number
  name: string
  nameJa: string
  description: string
  category: '1xx' | '2xx' | '3xx' | '4xx' | '5xx'
}

export const HTTP_STATUS_CODES: HttpStatusCode[] = [
  // 1xx Informational
  { code: 100, name: 'Continue', nameJa: '継続', description: 'クライアントはリクエストの続きを送信してください。', category: '1xx' },
  { code: 101, name: 'Switching Protocols', nameJa: 'プロトコル切替', description: 'サーバーがプロトコルを切り替えます（WebSocketなど）。', category: '1xx' },
  // 2xx Success
  { code: 200, name: 'OK', nameJa: '成功', description: 'リクエストが成功しました。', category: '2xx' },
  { code: 201, name: 'Created', nameJa: '作成済み', description: 'リソースが作成されました。POST後のレスポンスによく使われます。', category: '2xx' },
  { code: 204, name: 'No Content', nameJa: 'コンテンツなし', description: '成功しましたが返すコンテンツがありません。DELETEやPATCHの応答に使われます。', category: '2xx' },
  { code: 206, name: 'Partial Content', nameJa: '部分的コンテンツ', description: '範囲指定リクエスト（Range ヘッダー）への部分的なレスポンスです。', category: '2xx' },
  // 3xx Redirection
  { code: 301, name: 'Moved Permanently', nameJa: '恒久的移動', description: 'URLが恒久的に変更されました。SEOの観点からリダイレクトに推奨されます。', category: '3xx' },
  { code: 302, name: 'Found', nameJa: '一時的移動', description: 'URLが一時的に変更されました。リダイレクト先を維持したい場合に使います。', category: '3xx' },
  { code: 304, name: 'Not Modified', nameJa: '変更なし', description: 'キャッシュが有効です。If-None-Matchなどの条件付きGETで使われます。', category: '3xx' },
  { code: 307, name: 'Temporary Redirect', nameJa: '一時的リダイレクト', description: '一時的なリダイレクト。302と異なりメソッドが変更されません。', category: '3xx' },
  { code: 308, name: 'Permanent Redirect', nameJa: '恒久的リダイレクト', description: '恒久的なリダイレクト。301と異なりメソッドが変更されません。', category: '3xx' },
  // 4xx Client Errors
  { code: 400, name: 'Bad Request', nameJa: '不正リクエスト', description: 'リクエストの構文が正しくありません。入力値のバリデーションエラーなどに使います。', category: '4xx' },
  { code: 401, name: 'Unauthorized', nameJa: '未認証', description: '認証が必要です。ログインしていない場合などに返します。', category: '4xx' },
  { code: 403, name: 'Forbidden', nameJa: '禁止', description: 'アクセスが拒否されました。認証済みでも権限がない場合に返します。', category: '4xx' },
  { code: 404, name: 'Not Found', nameJa: '未検出', description: 'リソースが見つかりません。URLが間違っている場合などに返します。', category: '4xx' },
  { code: 405, name: 'Method Not Allowed', nameJa: 'メソッド不許可', description: '許可されていないHTTPメソッドです。', category: '4xx' },
  { code: 409, name: 'Conflict', nameJa: '競合', description: 'リソースの競合が発生しました。重複登録などに使います。', category: '4xx' },
  { code: 410, name: 'Gone', nameJa: '消滅', description: 'リソースが恒久的に削除されました。404との違いは削除が確定していること。', category: '4xx' },
  { code: 422, name: 'Unprocessable Entity', nameJa: '処理不可能なエンティティ', description: 'バリデーションエラー。構文は正しいが意味的に処理できない場合に使います。', category: '4xx' },
  { code: 429, name: 'Too Many Requests', nameJa: 'リクエスト過多', description: 'レートリミットを超えました。Retry-Afterヘッダーで再試行時間を示します。', category: '4xx' },
  // 5xx Server Errors
  { code: 500, name: 'Internal Server Error', nameJa: 'サーバー内部エラー', description: 'サーバー内部でエラーが発生しました。汎用的なサーバーエラーです。', category: '5xx' },
  { code: 501, name: 'Not Implemented', nameJa: '未実装', description: 'サーバーがリクエストメソッドをサポートしていません。', category: '5xx' },
  { code: 502, name: 'Bad Gateway', nameJa: '不正なゲートウェイ', description: 'プロキシやゲートウェイが不正なレスポンスを受け取りました。', category: '5xx' },
  { code: 503, name: 'Service Unavailable', nameJa: 'サービス利用不可', description: 'サーバーが一時的に利用できません。メンテナンス中やオーバーロードの場合に返します。', category: '5xx' },
  { code: 504, name: 'Gateway Timeout', nameJa: 'ゲートウェイタイムアウト', description: 'ゲートウェイがタイムアウトしました。', category: '5xx' },
]

export function searchHttpStatus(query: string): HttpStatusCode[] {
  if (!query) return HTTP_STATUS_CODES
  const q = query.toLowerCase()
  return HTTP_STATUS_CODES.filter(s =>
    s.code.toString().includes(q) ||
    s.name.toLowerCase().includes(q) ||
    s.nameJa.includes(q) ||
    s.description.includes(q)
  )
}

export function groupByCategory(codes: HttpStatusCode[]): Record<string, HttpStatusCode[]> {
  return codes.reduce<Record<string, HttpStatusCode[]>>((acc, code) => {
    if (!acc[code.category]) acc[code.category] = []
    acc[code.category].push(code)
    return acc
  }, {})
}
