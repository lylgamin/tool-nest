import { describe, it, expect } from 'vitest'
import { parseSemVer, compareSemVer, bumpVersion, satisfiesRange } from '../utils'

describe('parseSemVer', () => {
  it('標準フォーマットを正しくパースする', () => {
    expect(parseSemVer('1.2.3')).toEqual({ major: 1, minor: 2, patch: 3, pre: undefined })
  })

  it('v プレフィックスを無視する', () => {
    expect(parseSemVer('v2.0.0')).toEqual({ major: 2, minor: 0, patch: 0, pre: undefined })
  })

  it('pre-release 識別子をパースする', () => {
    expect(parseSemVer('1.0.0-alpha.1')).toEqual({ major: 1, minor: 0, patch: 0, pre: 'alpha.1' })
    expect(parseSemVer('2.3.4-beta')).toEqual({ major: 2, minor: 3, patch: 4, pre: 'beta' })
  })

  it('不正なフォーマットは null を返す', () => {
    expect(parseSemVer('1.2')).toBeNull()
    expect(parseSemVer('abc')).toBeNull()
    expect(parseSemVer('')).toBeNull()
    expect(parseSemVer('1.2.3.4')).toBeNull()
  })

  it('前後の空白を無視する', () => {
    expect(parseSemVer('  1.0.0  ')).toEqual({ major: 1, minor: 0, patch: 0, pre: undefined })
  })
})

describe('compareSemVer', () => {
  it('major バージョンで比較する', () => {
    expect(compareSemVer('2.0.0', '1.0.0')).toBe(1)
    expect(compareSemVer('1.0.0', '2.0.0')).toBe(-1)
  })

  it('minor バージョンで比較する', () => {
    expect(compareSemVer('1.2.0', '1.1.0')).toBe(1)
    expect(compareSemVer('1.1.0', '1.2.0')).toBe(-1)
  })

  it('patch バージョンで比較する', () => {
    expect(compareSemVer('1.0.2', '1.0.1')).toBe(1)
    expect(compareSemVer('1.0.1', '1.0.2')).toBe(-1)
  })

  it('等値は 0 を返す', () => {
    expect(compareSemVer('1.2.3', '1.2.3')).toBe(0)
  })

  it('pre-release なしは pre-release ありより大きい', () => {
    expect(compareSemVer('1.0.0', '1.0.0-alpha')).toBe(1)
    expect(compareSemVer('1.0.0-alpha', '1.0.0')).toBe(-1)
  })

  it('pre-release 同士は辞書順で比較する', () => {
    expect(compareSemVer('1.0.0-beta', '1.0.0-alpha')).toBe(1)
    expect(compareSemVer('1.0.0-alpha', '1.0.0-beta')).toBe(-1)
    expect(compareSemVer('1.0.0-alpha', '1.0.0-alpha')).toBe(0)
  })

  it('不正なバージョン文字列は 0 を返す', () => {
    expect(compareSemVer('invalid', '1.0.0')).toBe(0)
    expect(compareSemVer('1.0.0', 'invalid')).toBe(0)
  })
})

describe('bumpVersion', () => {
  it('major バンプ: minor/patch はゼロにリセット', () => {
    expect(bumpVersion('1.2.3', 'major')).toBe('2.0.0')
    expect(bumpVersion('0.0.1', 'major')).toBe('1.0.0')
  })

  it('minor バンプ: patch はゼロにリセット', () => {
    expect(bumpVersion('1.2.3', 'minor')).toBe('1.3.0')
    expect(bumpVersion('1.0.0', 'minor')).toBe('1.1.0')
  })

  it('patch バンプ', () => {
    expect(bumpVersion('1.2.3', 'patch')).toBe('1.2.4')
    expect(bumpVersion('0.0.0', 'patch')).toBe('0.0.1')
  })

  it('pre-release 付きバージョンのバンプは pre-release を除去する', () => {
    expect(bumpVersion('1.2.3-alpha', 'patch')).toBe('1.2.4')
    expect(bumpVersion('2.0.0-beta.1', 'major')).toBe('3.0.0')
  })

  it('不正なバージョンはそのまま返す', () => {
    expect(bumpVersion('invalid', 'patch')).toBe('invalid')
  })
})

describe('satisfiesRange', () => {
  describe('^ キャレット範囲', () => {
    it('^1.2.3: same major, >= minor/patch', () => {
      expect(satisfiesRange('1.2.3', '^1.2.3')).toBe(true)
      expect(satisfiesRange('1.9.9', '^1.2.3')).toBe(true)
      expect(satisfiesRange('1.2.2', '^1.2.3')).toBe(false)
      expect(satisfiesRange('2.0.0', '^1.2.3')).toBe(false)
      expect(satisfiesRange('0.9.9', '^1.2.3')).toBe(false)
    })
  })

  describe('~ チルダ範囲', () => {
    it('~1.2.3: same major/minor, >= patch', () => {
      expect(satisfiesRange('1.2.3', '~1.2.3')).toBe(true)
      expect(satisfiesRange('1.2.9', '~1.2.3')).toBe(true)
      expect(satisfiesRange('1.2.2', '~1.2.3')).toBe(false)
      expect(satisfiesRange('1.3.0', '~1.2.3')).toBe(false)
      expect(satisfiesRange('2.2.3', '~1.2.3')).toBe(false)
    })
  })

  describe('比較演算子', () => {
    it('>= 以上', () => {
      expect(satisfiesRange('1.2.3', '>=1.2.3')).toBe(true)
      expect(satisfiesRange('1.2.4', '>=1.2.3')).toBe(true)
      expect(satisfiesRange('1.2.2', '>=1.2.3')).toBe(false)
    })

    it('> より大きい', () => {
      expect(satisfiesRange('1.2.4', '>1.2.3')).toBe(true)
      expect(satisfiesRange('1.2.3', '>1.2.3')).toBe(false)
    })

    it('<= 以下', () => {
      expect(satisfiesRange('1.2.3', '<=1.2.3')).toBe(true)
      expect(satisfiesRange('1.2.2', '<=1.2.3')).toBe(true)
      expect(satisfiesRange('1.2.4', '<=1.2.3')).toBe(false)
    })

    it('< より小さい', () => {
      expect(satisfiesRange('1.2.2', '<1.2.3')).toBe(true)
      expect(satisfiesRange('1.2.3', '<1.2.3')).toBe(false)
    })

    it('= 完全一致', () => {
      expect(satisfiesRange('1.2.3', '=1.2.3')).toBe(true)
      expect(satisfiesRange('1.2.4', '=1.2.3')).toBe(false)
    })
  })

  describe('完全一致（演算子なし）', () => {
    it('バージョンが完全一致する場合 true', () => {
      expect(satisfiesRange('1.0.0', '1.0.0')).toBe(true)
      expect(satisfiesRange('1.0.1', '1.0.0')).toBe(false)
    })
  })

  it('不正なバージョンは false を返す', () => {
    expect(satisfiesRange('invalid', '^1.0.0')).toBe(false)
  })
})
