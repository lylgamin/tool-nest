import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PrivacyBanner from '../PrivacyBanner'

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

// next/link をモック
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) =>
    <a href={href} {...props}>{children}</a>,
}))

describe('PrivacyBanner', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('localStorage にキーがない状態でバナーが表示される', () => {
    render(<PrivacyBanner />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByText(/ブラウザ内で完結/)).toBeInTheDocument()
  })

  it('localStorage にキーがある状態でバナーが非表示になる', () => {
    localStorageMock.setItem('tool_nest_banner_v1', '1')
    render(<PrivacyBanner />)
    expect(screen.queryByRole('banner')).toBeNull()
  })

  it('閉じるボタン押下後にバナーが消え localStorage にキーが保存される', () => {
    render(<PrivacyBanner />)
    const closeBtn = screen.getByRole('button', { name: 'バナーを閉じる' })
    fireEvent.click(closeBtn)
    expect(screen.queryByRole('banner')).toBeNull()
    expect(localStorageMock.getItem('tool_nest_banner_v1')).toBe('1')
  })

  it('プライバシーポリシーリンクが /privacy を指す', () => {
    render(<PrivacyBanner />)
    const link = screen.getByRole('link', { name: 'プライバシーポリシー' })
    expect(link).toHaveAttribute('href', '/privacy')
  })
})
