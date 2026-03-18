import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalInput } from '../useLocalInput'

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

describe('useLocalInput', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('初期値は defaultValue になる', () => {
    const { result } = renderHook(() => useLocalInput('test-tool', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('LocalStorage に既存値があれば復元される', async () => {
    localStorageMock.setItem('tool_nest_input_test-tool', 'saved value')
    const { result } = renderHook(() => useLocalInput('test-tool'))
    // useEffect は非同期なので act で待つ
    await act(async () => {})
    expect(result.current[0]).toBe('saved value')
  })

  it('set() で値を更新すると LocalStorage にも保存される', () => {
    const { result } = renderHook(() => useLocalInput('test-tool'))
    act(() => {
      result.current[1]('new value')
    })
    expect(result.current[0]).toBe('new value')
    expect(localStorageMock.getItem('tool_nest_input_test-tool')).toBe('new value')
  })

  it('clear() で値がリセットされ LocalStorage からも削除される', () => {
    const { result } = renderHook(() => useLocalInput('test-tool', 'default'))
    act(() => { result.current[1]('some input') })
    act(() => { result.current[2]() })
    expect(result.current[0]).toBe('default')
    expect(localStorageMock.getItem('tool_nest_input_test-tool')).toBeNull()
  })

  it('キーが異なると別々に保存される', () => {
    const { result: a } = renderHook(() => useLocalInput('tool-a'))
    const { result: b } = renderHook(() => useLocalInput('tool-b'))
    act(() => { a.current[1]('value-a') })
    act(() => { b.current[1]('value-b') })
    expect(localStorageMock.getItem('tool_nest_input_tool-a')).toBe('value-a')
    expect(localStorageMock.getItem('tool_nest_input_tool-b')).toBe('value-b')
  })
})
