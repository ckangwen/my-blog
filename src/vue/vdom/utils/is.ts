export function isPrimitive (s: any): s is (string | number) {
  return typeof s === 'string' || typeof s === 'number'
}

export function isDef(c: any): boolean {
  return c !== undefined && c !== null
}

export function isVnode (vnode: any) {
  return vnode.tag !== undefined
}


export function isObject (obj): boolean {
  return obj !== null && typeof obj === 'object'
}

export function isPromise (val: any): boolean {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

export function isNative (Ctor: any): boolean {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
