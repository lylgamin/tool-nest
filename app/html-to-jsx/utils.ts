export type ConvertResult = { ok: true; output: string } | { ok: false; error: string }

const ATTR_MAP: Record<string, string> = {
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  minlength: 'minLength',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  rowspan: 'rowSpan',
  colspan: 'colSpan',
  usemap: 'useMap',
  frameborder: 'frameBorder',
  contenteditable: 'contentEditable',
  crossorigin: 'crossOrigin',
  accesskey: 'accessKey',
  enctype: 'encType',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  bgcolor: 'bgColor',
  novalidate: 'noValidate',
  allowfullscreen: 'allowFullScreen',
}

const VOID_ELEMENTS = new Set([
  'area','base','br','col','embed','hr','img','input',
  'link','meta','param','source','track','wbr',
])

function convertAttrName(name: string): string {
  const lower = name.toLowerCase()
  if (ATTR_MAP[lower]) return ATTR_MAP[lower]
  // onclick → onClick
  if (/^on[a-z]/.test(lower)) return 'on' + name[2].toUpperCase() + name.slice(3)
  return name
}

function convertStyleValue(raw: string): string {
  const props = raw.split(';').flatMap(decl => {
    const idx = decl.indexOf(':')
    if (idx < 0) return []
    const prop = decl.slice(0, idx).trim()
    const val = decl.slice(idx + 1).trim()
    if (!prop || !val) return []
    const jsProp = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    const jsVal = /^\d/.test(val) && !val.endsWith('px') && !val.endsWith('%') && !val.endsWith('em')
      ? val
      : `'${val.replace(/'/g, "\\'")}'`
    return [`${jsProp}: ${jsVal}`]
  })
  return `{{ ${props.join(', ')} }}`
}

function convertAttrs(rawAttrs: string): string {
  return rawAttrs.replace(
    /\s+([a-zA-Z][a-zA-Z0-9\-:.]*)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]*)))?/g,
    (_m: string, name: string, dq?: string, sq?: string, bare?: string) => {
      const jsxName = convertAttrName(name)
      const val = dq !== undefined ? dq : sq !== undefined ? sq : bare
      if (val === undefined) return ` ${jsxName}`
      if (name.toLowerCase() === 'style') return ` ${jsxName}=${convertStyleValue(val)}`
      return ` ${jsxName}="${val}"`
    },
  )
}

export function htmlToJsx(html: string): ConvertResult {
  if (!html.trim()) return { ok: false, error: '入力が空です' }
  try {
    // open tags
    let out = html.replace(
      /<([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^>]*?)?)(\/?)>/g,
      (_m: string, tag: string, attrs: string, slash: string) => {
        const jsxAttrs = convertAttrs(attrs)
        const isVoid = VOID_ELEMENTS.has(tag.toLowerCase())
        const close = isVoid || slash ? ' />' : '>'
        return `<${tag}${jsxAttrs}${close}`
      },
    )
    return { ok: true, output: out }
  } catch (e) {
    return { ok: false, error: `変換エラー: ${String(e)}` }
  }
}

export function jsxToHtml(jsx: string): ConvertResult {
  if (!jsx.trim()) return { ok: false, error: '入力が空です' }
  try {
    const reverseMap: Record<string, string> = Object.fromEntries(
      Object.entries(ATTR_MAP).map(([html, jsx]) => [jsx, html]),
    )
    let out = jsx
    // className → class, htmlFor → for, etc.
    out = out.replace(
      /\s+([a-zA-Z][a-zA-Z0-9]*)(?:=(?:\{([^}]*)\}|"([^"]*)"|'([^']*)'))?/g,
      (_m: string, name: string, brace?: string, dq?: string, sq?: string) => {
        const htmlName = reverseMap[name] ?? (
          /^on[A-Z]/.test(name) ? 'on' + name[2].toLowerCase() + name.slice(3) : name
        )
        if (brace !== undefined) {
          // style={{ ... }} → style="..."
          if (name === 'style') {
            const css = brace.replace(/\{\{?|\}\}?/g, '').trim()
              .replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
              .replace(/:\s*/g, ': ').replace(/,\s*/g, '; ')
              .replace(/'/g, '')
            return ` style="${css}"`
          }
          return ` ${htmlName}={${brace}}`
        }
        const val = dq !== undefined ? dq : sq
        if (val === undefined) return ` ${htmlName}`
        return ` ${htmlName}="${val}"`
      },
    )
    // self-closing void → bare
    VOID_ELEMENTS.forEach(el => {
      out = out.replace(new RegExp(`<(${el})(\\s[^/]*?)\\s*/>`, 'gi'), (_m: string, t: string, a: string) => `<${t}${a}>`)
    })
    return { ok: true, output: out }
  } catch (e) {
    return { ok: false, error: `変換エラー: ${String(e)}` }
  }
}
