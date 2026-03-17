import { describe, it, expect } from 'vitest'
import { escapeHtml, unescapeHtml } from '../utils'

describe('escapeHtml', () => {
  it('escapes ampersand &', () => {
    expect(escapeHtml('&')).toBe('&amp;')
  })

  it('escapes less-than <', () => {
    expect(escapeHtml('<')).toBe('&lt;')
  })

  it('escapes greater-than >', () => {
    expect(escapeHtml('>')).toBe('&gt;')
  })

  it('escapes double quote "', () => {
    expect(escapeHtml('"')).toBe('&quot;')
  })

  it("escapes single quote '", () => {
    expect(escapeHtml("'")).toBe('&#39;')
  })

  it('escapes a combined HTML string', () => {
    expect(escapeHtml('<div class="foo">Hello & \'world\'</div>')).toBe(
      '&lt;div class=&quot;foo&quot;&gt;Hello &amp; &#39;world&#39;&lt;/div&gt;'
    )
  })

  it('returns empty string for empty input', () => {
    expect(escapeHtml('')).toBe('')
  })

  it('does not double-escape already escaped entities', () => {
    // The & in &amp; should itself be escaped again → &amp;amp;
    expect(escapeHtml('&amp;')).toBe('&amp;amp;')
  })
})

describe('unescapeHtml', () => {
  it('unescapes &lt; to <', () => {
    expect(unescapeHtml('&lt;')).toBe('<')
  })

  it('unescapes &amp; to &', () => {
    expect(unescapeHtml('&amp;')).toBe('&')
  })

  it('round-trips: escape then unescape returns original', () => {
    const original = '<div class="foo">Hello & \'world\'</div>'
    expect(unescapeHtml(escapeHtml(original))).toBe(original)
  })

  it('unescapes decimal numeric reference &#123; to {', () => {
    expect(unescapeHtml('&#123;')).toBe('{')
  })

  it('unescapes hex numeric reference &#x7B; to {', () => {
    expect(unescapeHtml('&#x7B;')).toBe('{')
  })

  it("unescapes &apos; to '", () => {
    expect(unescapeHtml('&apos;')).toBe("'")
  })

  it('returns empty string for empty input', () => {
    expect(unescapeHtml('')).toBe('')
  })
})
