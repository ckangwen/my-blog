import { isNative } from './is';
export function remove(arr: any[], item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function cached (fn) {
  const cache = Object.create(null)
  return function cachedFn (str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

export function noop() {}

const toString = Object.prototype.toString
const OBJECT_STRING = '[object Object]'
export function isPlainObject (obj): boolean {
  return toString.call(obj) === OBJECT_STRING
}


const camelizeRE = /-(\w)/g
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)

export const extend = <T extends object, U extends object>(
  a: T,
  b: U
): T & U => {
  for (const key in b) {
    ;(a as any)[key] = b[key]
  }
  return a as any
}

export const no = () => false

export const capitalize = cached((str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

export const emptyObject = Object.freeze({})

const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})

/**
 * Check if a string starts with $ or _
 */
export function isReserved (str: string): boolean {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}

export function toObject (arr: any[]): Object {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

export function toArray (list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
  const ret: Array<any> = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

export function toNumber (val: string): number | string {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

export const __DEV__ = process.env.NODE_ENV !== 'production'

export const isReservedAttribute = key => [ 'key', 'ref', 'slot', 'slot-scope', 'is' ].indexOf(key) > -1

const HTMLTag = [
  'html',    'body',    'base',
  'head',    'link',    'meta',
  'style',   'title',   'address',
  'article', 'aside',   'footer',
  'header',  'h1',      'h2',
  'h3',      'h4',      'h5',
  'h6',      'hgroup',  'nav',
  'section', 'div',     'dd',
  'dl',      'dt',      'figcaption',
  'figure',  'picture', 'hr',
  'img',     'li',      'main',
  'ol',      'p',       'pre',
  'ul',    'blockquote', 'iframe',  'tfoot',
  'a',        'b',          'abbr',    'bdi',     'bdo',
  'br',       'cite',       'code',    'data',    'dfn',
  'em',       'i',          'kbd',     'mark',    'q',
  'rp',       'rt',         'rtc',     'ruby',    's',
  'samp',     'small',      'span',    'strong',  'sub',
  'sup',      'time',       'u',       'var',     'wbr',
  'area',     'audio',      'map',     'track',   'video',
  'embed',    'object',     'param',   'source',  'canvas',
  'script',   'noscript',   'del',     'ins',     'caption',
  'col',      'colgroup',   'table',   'thead',   'tbody',
  'td',       'th',         'tr',      'button',  'datalist',
  'fieldset', 'form',       'input',   'label',   'legend',
  'meter',    'optgroup',   'option',  'output',  'progress',
  'select',   'textarea',   'details', 'dialog',  'menu',
  'menuitem', 'summary',    'content', 'element', 'shadow',
  'template'
]

export const isHTMLTag = tag => {
  return HTMLTag.indexOf(tag) > -1
}

export const inBrowser = typeof window !== 'undefined'

export function query (el: string | Element): Element {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected) {
      __DEV__ && warn(
        'Cannot find element: ' + el
      )
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}


export let warn: Function = noop

const formatComponentName = vm => {
  if (vm.$root === vm) {
    return 'root instance'
  }
  const name = vm._isVue
    ? vm.$options.name || vm.$options._componentTag
    : vm.name
  return name ? `component ${name}` : `anonymous component`
}

if (__DEV__) {
  const hasConsole = typeof console !== undefined
  const formatLocation = str => {
    if (str === 'anonymous component') {
      str += ` - use the "name" option for better debugging messages.`
    }
    return `(found in ${str})`
  }
  warn = (msg, vm) => {
    if (hasConsole) {
      console.warn('[Vue warn]: ' + msg + (
        vm ? formatLocation(formatComponentName(vm)) : ''
      ) )
    }
  }
}

export const isBuiltInTag = (key: string) => [ 'slot', 'component' ].indexOf(key) > -1

const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

export function validateComponentName (name: string) {
  if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    )
  }
  if (isBuiltInTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    )
  }
}

export const hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)

export function toRawType (value: any): string {
  return Object.prototype.toString.call(value).slice(8, -1)
}
