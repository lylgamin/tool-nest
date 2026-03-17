export type CommitType = {
  value: string
  label: string
  description: string
  emoji: string
}

export const COMMIT_TYPES: CommitType[] = [
  { value: 'feat',     label: 'feat',     description: '新機能の追加',             emoji: '✨' },
  { value: 'fix',      label: 'fix',      description: 'バグ修正',                 emoji: '🐛' },
  { value: 'docs',     label: 'docs',     description: 'ドキュメントのみの変更',   emoji: '📝' },
  { value: 'style',    label: 'style',    description: 'コードの意味に影響しない変更（空白・フォーマット等）', emoji: '💄' },
  { value: 'refactor', label: 'refactor', description: 'バグ修正でも機能追加でもないコード変更', emoji: '♻️' },
  { value: 'perf',     label: 'perf',     description: 'パフォーマンス改善',       emoji: '⚡' },
  { value: 'test',     label: 'test',     description: 'テストの追加・修正',       emoji: '✅' },
  { value: 'build',    label: 'build',    description: 'ビルドシステム・外部依存の変更', emoji: '📦' },
  { value: 'ci',       label: 'ci',       description: 'CI設定・スクリプトの変更', emoji: '🔧' },
  { value: 'chore',    label: 'chore',    description: 'その他のメンテナンス作業', emoji: '🔨' },
  { value: 'revert',   label: 'revert',   description: '過去のコミットへの差し戻し', emoji: '⏪' },
]

export interface CommitFields {
  type: string
  scope: string
  breaking: boolean
  subject: string
  body: string
  footer: string
}

export function buildCommitMessage(fields: CommitFields): string {
  const { type, scope, breaking, subject, body, footer } = fields
  if (!type || !subject.trim()) return ''

  const scopePart = scope.trim() ? `(${scope.trim()})` : ''
  const breakingMark = breaking ? '!' : ''
  const header = `${type}${scopePart}${breakingMark}: ${subject.trim()}`

  const parts = [header]
  if (body.trim()) parts.push('', body.trim())
  if (breaking && !footer.toLowerCase().includes('breaking change')) {
    const breakingFooter = footer.trim()
      ? `BREAKING CHANGE: ${footer.trim()}`
      : 'BREAKING CHANGE: '
    parts.push('', breakingFooter)
  } else if (footer.trim()) {
    parts.push('', footer.trim())
  }

  return parts.join('\n')
}

export function validateSubject(subject: string): string | null {
  if (!subject.trim()) return 'タイトルは必須です'
  if (subject.length > 72) return `タイトルは72文字以内にしてください（現在: ${subject.length}文字）`
  if (/[.。]$/.test(subject)) return 'タイトルの末尾にピリオドは不要です'
  return null
}
