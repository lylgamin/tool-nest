import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRecentTools, recordRecentTool } from '../useRecentTools'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true })

describe('recordRecentTool', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('記録したツールが先頭に来る', () => {
    recordRecentTool('json-formatter')
    const stored = JSON.parse(localStorageMock.getItem('tool_nest_recent')!)
    expect(stored[0]).toBe('json-formatter')
  })

  it('新しいツールは既存リストの先頭に追加される', () => {
    recordRecentTool('base64')
    recordRecentTool('jwt-decoder')
    const stored = JSON.parse(localStorageMock.getItem('tool_nest_recent')!)
    expect(stored[0]).toBe('jwt-decoder')
    expect(stored[1]).toBe('base64')
  })

  it('重複IDは除去されて先頭に移動する', () => {
    recordRecentTool('base64')
    recordRecentTool('jwt-decoder')
    recordRecentTool('base64')
    const stored = JSON.parse(localStorageMock.getItem('tool_nest_recent')!)
    expect(stored).toEqual(['base64', 'jwt-decoder'])
  })

  it('6件を超えると古いエントリが除去される', () => {
    ;['a', 'b', 'c', 'd', 'e', 'f', 'g'].forEach(recordRecentTool)
    const stored = JSON.parse(localStorageMock.getItem('tool_nest_recent')!)
    expect(stored).toHaveLength(6)
    expect(stored[0]).toBe('g')
    expect(stored).not.toContain('a')
  })
})

describe('useRecentTools', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('LocalStorage が空なら空配列を返す', () => {
    const { result } = renderHook(() => useRecentTools())
    expect(result.current).toEqual([])
  })

  it('LocalStorage に保存済みのIDリストを復元する', async () => {
    localStorageMock.setItem('tool_nest_recent', JSON.stringify(['base64', 'hash']))
    const { result } = renderHook(() => useRecentTools())
    await act(async () => {})
    expect(result.current).toEqual(['base64', 'hash'])
  })
})
