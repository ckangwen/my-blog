import { RouteRecord } from '../types/router';
export function flatten (arr: any[]): any[] {
  return Array.prototype.concat.apply([], arr)
}

export function resolveAsyncComponents(matched: RouteRecord[]) {
  return (to, from, next) => {
    let hasAsync = false
    let pending = 0
    let error = null

    if (!hasAsync) next()
  }
}

function once (fn) {
  let called = false
  return function (...args) {
    if (called) return
    called = true
    return fn.apply(this, args)
  }
}
