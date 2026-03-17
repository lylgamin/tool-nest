import { describe, it, expect } from 'vitest'
import { generateGitignore, TEMPLATES } from '../utils'

describe('TEMPLATES', () => {
  it('8種類のテンプレートが定義されている', () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(6)
  })

  it('各テンプレートはid・label・contentを持つ', () => {
    TEMPLATES.forEach(t => {
      expect(t.id).toBeTruthy()
      expect(t.label).toBeTruthy()
      expect(t.content).toBeTruthy()
    })
  })
})

describe('generateGitignore', () => {
  it('選択したテンプレートの内容が含まれる', () => {
    const result = generateGitignore(['node'], false)
    expect(result).toContain('node_modules/')
    expect(result).toContain('Node.js')
  })

  it('複数テンプレートを結合', () => {
    const result = generateGitignore(['node', 'react'], false)
    expect(result).toContain('node_modules/')
    expect(result).toContain('.next/')
  })

  it('共通エントリを含める', () => {
    const result = generateGitignore(['node'], true)
    expect(result).toContain('.DS_Store')
    expect(result).toContain('共通')
  })

  it('選択なしで空文字', () => {
    const result = generateGitignore([], false)
    expect(result).toBe('')
  })

  it('Pythonテンプレートが含まれる', () => {
    const result = generateGitignore(['python'], false)
    expect(result).toContain('__pycache__/')
  })
})
