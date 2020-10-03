import { inBrowser } from '../../vue/constructor/utils/utils';
import { Route, RawLocation, RouteRecord } from '../types/router';
import { START } from '../utils/route';
import { resolveAsyncComponents } from '../utils/resolve-components';
import { runQueue } from '../utils/async';
import { isError, createNavigationRedirectedError } from '../utils/error';

export class History {
  router: any
  base: string
  current: Route
  pending?: Route
  cb: Function
  ready: boolean
  readyCbs: Function[]
  readyErrorCbs: Function[]
  errorCbs: Function[]
  listeners: Function[]
  cleanupListeners: Function

  // push (loc: RawLocation, onComplete?: Function, onAbort?: Function) => void
  // replace: (
  //   loc: RawLocation,
  //   onComplete?: Function,
  //   onAbort?: Function
  // ) => void
  // ensureURL: (push?: boolean) => void

  constructor(router: any, base: string) {
    this.router = router
    this.base = normalizeBase(base)
    this.current = START
    this.pending = null
    this.ready = false
    this.readyCbs = []
    this.readyErrorCbs = []
    this.errorCbs = []
    this.listeners = []
  }

  setupListeners() {}
  getCurrentLocation() {}
  go (n: number) {}
  push (loc: RawLocation, onComplete?: Function, onAbort?: Function) {}
  replace (
    loc: RawLocation,
    onComplete?: Function,
    onAbort?: Function
  ) {}
  ensureURL (push?: boolean) {}


  listen (cb: Function) {
    this.cb = cb
  }

  onReady (cb: Function, errorCb?: Function) {
    if (this.ready) {
      cb()
    } else {
      this.readyCbs.push(cb)
      if (errorCb) {
        this.readyErrorCbs.push(errorCb)
      }
    }
  }
  onError (errorCb: Function) {
    this.errorCbs.push(errorCb)
  }

  transitionTo(
    location: RawLocation,
    onComplete?: Function,
    onAbort?: Function
  ) {
    let route = this.router.match(location, this.current)
    const prev = this.current

    this.confirmTransition(
      route,
      () => {
        this.updateRoute(route)
        onComplete && onComplete(route)
        this.ensureURL()
        this.router.afterHooks.forEach(hook => {
          hook && hook(route, prev)
        })

        // fire ready cbs once
        if (!this.ready) {
          this.ready = true
          this.readyCbs.forEach(cb => {
            cb(route)
          })
        }
      },
      err => {
        if (onAbort) {
          onAbort(err)
        }
      }
    )
  }

  confirmTransition(route: Route, onComplete: Function, onAbort?: Function) {
    const current = this.current
    this.pending = route
    const abort = (err) => {
      onAbort && onAbort(err)
    }
    const { updated, deactivated, activated } = resolveQueue(
      this.current.matched,
      route.matched
    )
    const queue = [].concat(resolveAsyncComponents(activated))

    const iterator = (hook: any, next) => {
      try {
        // to from next
        hook(route, current, (to: any) => {
          if (to === false) {
            // next(false) -> abort navigation, ensure current URL
            this.ensureURL(true)
            console.log('abort navigation');
            // abort(createNavigationAbortedError(current, route))
          } else if (isError(to)) {
            this.ensureURL(true)
            abort(to)
          } else if (
            typeof to === 'string' ||
            (typeof to === 'object' &&
              (typeof to.path === 'string' || typeof to.name === 'string'))
          ) {
            // next('/') or next({ path: '/' }) -> redirect
            abort(createNavigationRedirectedError(current, route))
            if (typeof to === 'object' && to.replace) {
              this.replace(to)
            } else {
              this.push(to)
            }
          } else {
            // confirm transition and pass on the value
            next(to)
          }
        })
      } catch (e) {
        abort(e)
      }
    }

    runQueue(queue, iterator, () => {
      const postEnterCbs = []
      const queue = [].concat(this.router.resolveHooks)
      runQueue(queue, iterator, () => {
        if (this.pending !== route) {
          // return abort(createNavigationCancelledError(current, route))
        }
        this.pending = null
        onComplete(route)
        // if (this.router.app) {
        //   this.router.app.$nextTick(() => {
        //     postEnterCbs.forEach(cb => {
        //       cb()
        //     })
        //   })
        // }
      })
    })
  }

  updateRoute (route: Route) {
    this.current = route
    this.cb && this.cb(route)
  }

  teardown () {
    // clean up event listeners
    // https://github.com/vuejs/vue-router/issues/2341
    this.listeners.forEach(cleanupListener => {
      cleanupListener()
    })
    this.listeners = []

    // reset current history route
    // https://github.com/vuejs/vue-router/issues/3294
    this.current = START
    this.pending = null
  }
}

/*   helper   */
function normalizeBase (base?: string): string {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      const baseEl = document.querySelector('base')
      base = (baseEl && baseEl.getAttribute('href')) || '/'
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '')
    } else {
      base = '/'
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current: RouteRecord[],
  next: RouteRecord[]
){
  let i
  const max = Math.max(current.length, next.length)
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}