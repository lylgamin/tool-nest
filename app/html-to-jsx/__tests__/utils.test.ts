import { describe, it, expect } from 'vitest'
import { htmlToJsx, jsxToHtml } from '../utils'

describe('htmlToJsx', () => {
  it('class → className', () => {
    const r = htmlToJsx('<div class="foo">bar</div>')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).toContain('className="foo"')
  })

  it('for → htmlFor', () => {
    const r = htmlToJsx('<label for="name">Name</label>')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).toContain('htmlFor="name"')
  })

  it('onclick → onClick', () => {
    const r = htmlToJsx('<button onclick="fn()">click</button>')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).toContain('onClick="fn()"')
  })

  it('style string → style object', () => {
    const r = htmlToJsx('<div style="color: red; font-size: 14px"></div>')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.output).toContain('style={{')
      expect(r.output).toContain('color:')
      expect(r.output).toContain('fontSize:')
    }
  })

  it('void element gets self-closing', () => {
    const r = htmlToJsx('<br>')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).toContain('<br />')
  })

  it('<input> → <input />', () => {
    const r = htmlToJsx('<input type="text" value="hello">')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).toContain('<input')
    if (r.ok) expect(r.output).toContain('/>')
  })

  it('empty input returns error', () => {
    const r = htmlToJsx('   ')
    expect(r.ok).toBe(false)
  })

  it('tabindex → tabIndex', () => {
    const r = htmlToJsx('<div tabindex="0"></div>')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).toContain('tabIndex="0"')
  })
})

describe('jsxToHtml', () => {
  it('className → class', () => {
    const r = jsxToHtml('<div className="foo">bar</div>')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).toContain('class="foo"')
  })

  it('htmlFor → for', () => {
    const r = jsxToHtml('<label htmlFor="name">Name</label>')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).toContain('for="name"')
  })

  it('onClick → onclick', () => {
    const r = jsxToHtml('<button onClick="fn()">click</button>')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.output).toContain('onclick="fn()"')
  })

  it('empty input returns error', () => {
    const r = jsxToHtml('   ')
    expect(r.ok).toBe(false)
  })
})
