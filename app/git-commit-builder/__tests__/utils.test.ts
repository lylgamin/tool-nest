import { describe, it, expect } from 'vitest'
import { buildCommitMessage, validateSubject, COMMIT_TYPES } from '../utils'

describe('buildCommitMessage', () => {
  it('基本メッセージを生成', () => {
    const msg = buildCommitMessage({ type: 'feat', scope: '', breaking: false, subject: 'add login', body: '', footer: '' })
    expect(msg).toBe('feat: add login')
  })

  it('スコープ付き', () => {
    const msg = buildCommitMessage({ type: 'fix', scope: 'auth', breaking: false, subject: 'fix token', body: '', footer: '' })
    expect(msg).toBe('fix(auth): fix token')
  })

  it('ブレーキングチェンジ付き', () => {
    const msg = buildCommitMessage({ type: 'feat', scope: '', breaking: true, subject: 'drop v1 API', body: '', footer: '' })
    expect(msg).toContain('feat!: drop v1 API')
    expect(msg).toContain('BREAKING CHANGE:')
  })

  it('ボディ付き', () => {
    const msg = buildCommitMessage({ type: 'docs', scope: '', breaking: false, subject: 'update README', body: 'Added examples.', footer: '' })
    expect(msg).toContain('docs: update README')
    expect(msg).toContain('Added examples.')
  })

  it('type/subjectが空なら空文字', () => {
    expect(buildCommitMessage({ type: '', scope: '', breaking: false, subject: '', body: '', footer: '' })).toBe('')
    expect(buildCommitMessage({ type: 'feat', scope: '', breaking: false, subject: '', body: '', footer: '' })).toBe('')
  })
})

describe('validateSubject', () => {
  it('正常なタイトルはnull', () => {
    expect(validateSubject('add new feature')).toBeNull()
  })

  it('空タイトルはエラー', () => {
    expect(validateSubject('')).toBeTruthy()
  })

  it('73文字以上はエラー', () => {
    expect(validateSubject('a'.repeat(73))).toBeTruthy()
  })

  it('末尾ピリオドはエラー', () => {
    expect(validateSubject('add feature.')).toBeTruthy()
  })
})

describe('COMMIT_TYPES', () => {
  it('11種類のタイプが定義されている', () => {
    expect(COMMIT_TYPES).toHaveLength(11)
  })

  it('featが含まれる', () => {
    expect(COMMIT_TYPES.find(t => t.value === 'feat')).toBeTruthy()
  })
})
