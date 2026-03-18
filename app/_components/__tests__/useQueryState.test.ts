import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useQueryState } from '../useQueryState'

const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useRouter: vi.fn(() => ({ replace: mockReplace })),
}))

import { useSearchParams } from 'next/navigation'

describe('useQueryState', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams())
  })

  it('クエリパラメータがない場合はデフォルト値を返す', () => {
    const { result } = renderHook(() => useQueryState('t', ''))
    expect(result.current[0]).toBe('')
  })

  it('クエリパラメータに値がある場合はその値を返す', () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('t=hello'))
    const { result } = renderHook(() => useQueryState('t', ''))
    expect(result.current[0]).toBe('hello')
  })

  it('setValue を呼ぶと router.replace が実行される', () => {
    const { result } = renderHook(() => useQueryState('t', ''))
    act(() => {
      result.current[1]('myvalue')
    })
    expect(mockReplace).toHaveBeenCalledOnce()
    const url: string = mockReplace.mock.calls[0][0] as string
    expect(url).toContain('t=myvalue')
  })

  it('空文字列を set するとキーが URL から除去される', () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('t=foo'))
    const { result } = renderHook(() => useQueryState('t', ''))
    act(() => {
      result.current[1]('')
    })
    const url: string = mockReplace.mock.calls[0][0] as string
    expect(url).not.toContain('t=')
  })

  it('他のクエリパラメータは保持される', () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('p=foo'))
    const { result } = renderHook(() => useQueryState('f', 'g'))
    act(() => {
      result.current[1]('gi')
    })
    const url: string = mockReplace.mock.calls[0][0] as string
    expect(url).toContain('p=foo')
    expect(url).toContain('f=gi')
  })
})
