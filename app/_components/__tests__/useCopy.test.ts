import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCopy, useStringCopy, useIndexedCopy } from '../useCopy'

// navigator.clipboard をモック
const writeText = vi.fn().mockResolvedValue(undefined)
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText },
  writable: true,
})

describe('useCopy', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    writeText.mockClear()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('copy() 呼び出し直後に copied が true になる', async () => {
    const { result } = renderHook(() => useCopy())
    await act(async () => {
      result.current.copy('hello')
    })
    expect(result.current.copied).toBe(true)
  })

  it('1500ms 後に copied が false に戻る', async () => {
    const { result } = renderHook(() => useCopy())
    await act(async () => {
      result.current.copy('hello')
    })
    expect(result.current.copied).toBe(true)
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(result.current.copied).toBe(false)
  })

  it('カスタム timeout が反映される', async () => {
    const { result } = renderHook(() => useCopy(3000))
    await act(async () => {
      result.current.copy('hello')
    })
    act(() => { vi.advanceTimersByTime(1500) })
    expect(result.current.copied).toBe(true)
    act(() => { vi.advanceTimersByTime(1500) })
    expect(result.current.copied).toBe(false)
  })

  it('clipboard.writeText に正しいテキストが渡される', async () => {
    const { result } = renderHook(() => useCopy())
    await act(async () => {
      result.current.copy('test-text')
    })
    expect(writeText).toHaveBeenCalledWith('test-text')
  })
})

describe('useStringCopy', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    writeText.mockClear()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('copy(key, text) 後に copiedKey が対象キーになる', async () => {
    const { result } = renderHook(() => useStringCopy())
    await act(async () => {
      result.current.copy('hex', '#ffffff')
    })
    expect(result.current.copiedKey).toBe('hex')
  })

  it('1500ms 後に copiedKey が null に戻る', async () => {
    const { result } = renderHook(() => useStringCopy())
    await act(async () => {
      result.current.copy('rgb', '255,255,255')
    })
    act(() => { vi.advanceTimersByTime(1500) })
    expect(result.current.copiedKey).toBeNull()
  })
})

describe('useIndexedCopy', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    writeText.mockClear()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('copy(idx, text) 後に copiedIdx が対象インデックスになる', async () => {
    const { result } = renderHook(() => useIndexedCopy())
    await act(async () => {
      result.current.copy(2, 'text')
    })
    expect(result.current.copiedIdx).toBe(2)
  })

  it('1500ms 後に copiedIdx が null に戻る', async () => {
    const { result } = renderHook(() => useIndexedCopy())
    await act(async () => {
      result.current.copy(0, 'text')
    })
    act(() => { vi.advanceTimersByTime(1500) })
    expect(result.current.copiedIdx).toBeNull()
  })

  it('別インデックスを連続コピーすると最新インデックスに更新される', async () => {
    const { result } = renderHook(() => useIndexedCopy())
    await act(async () => { result.current.copy(0, 'a') })
    await act(async () => { result.current.copy(3, 'b') })
    expect(result.current.copiedIdx).toBe(3)
  })
})
