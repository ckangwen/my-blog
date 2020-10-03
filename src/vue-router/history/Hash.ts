import { History } from './base';
import { getLocation } from '../utils/location';
import { cleanPath } from '../utils/path';
import { replaceState, pushState } from '../utils/pushstate';
import { RawLocation } from '../types/router';

export class HashHistory extends History {
  constructor(router: any, base?: string, fallback?: Function) {
    super(router, base)
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash()
  }

  setupListeners() {
    if (this.listeners.length > 0) {
      return
    }
    const router = this.router

    const handleRoutingEvent = () => {
      const current = this.current
      if (!ensureSlash()) {
        return
      }
      this.transitionTo(getHash(), route => {})
    }
    window.addEventListener(
      'popstate',
      handleRoutingEvent
    )
  }

  go (n: number) {
    window.history.go(n)
  }

  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(
      location,
      route => {
        pushHash(route.fullPath)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }

  ensureURL (push?: boolean) {
    const current = this.current.fullPath
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current)
    }
  }

  getCurrentLocation () {
    return getHash()
  }
}

function ensureSlash (): boolean {
  const path = getHash()
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path)
  return false
}


function checkFallback(base?: string) {
  const location = getLocation(base)
  if (!/^\/#/.test(location)) {
    window.location.replace(cleanPath(base + '/#' + location))
    return true
  }
}

export function getHash (): string {
  let href = window.location.href
  const index = href.indexOf('#')
  if (index < 0) return ''

  href = href.slice(index + 1)

  return href
}

function getUrl (path) {
  const href = window.location.href
  const i = href.indexOf('#')
  const base = i >= 0 ? href.slice(0, i) : href
  return `${base}#${path}`
}

function replaceHash (path) {
  replaceState(getUrl(path))
}

function pushHash (path) {
  pushState(getUrl(path))
}
