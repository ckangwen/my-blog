import { HashHistory } from './history/Hash';
import { createMatcher } from './create-matcher';
import { RawLocation, Route } from './types/router';
export class VueRouter {
  app: any
  apps: Array<any>
  options: any
  history: HashHistory;
  matcher: any

  constructor(options = {} as any) {
    this.app = null
    this.apps = []
    this.options = options
    this.matcher = createMatcher(options.routes || [], this)
    this.history = new HashHistory(this, options.base)
  }

  match (raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {
    return this.matcher.match(raw, current, redirectedFrom)
  }
}