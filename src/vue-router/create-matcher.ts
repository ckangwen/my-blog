import { RawLocation, Route, RouteConfig, RouteRecord, Location } from './types/router';
import { createRouteMap } from './create-route-map';
import { normalizeLocation } from './utils/location';
import { createRoute } from './utils/route';
import { fillParams } from './utils/params';
import { resolvePath } from './utils/path';

export type Matcher = {
  match: (raw: RawLocation, current?: Route, redirectedFrom?: Location) => Route;
  addRoutes?: (routes: RouteConfig) => void;
}

export function createMatcher (
  routes: Array<RouteConfig>,
  router: any
): Matcher {
  const { pathList, pathMap, nameMap } = createRouteMap(routes)

  const match = (raw, currentRoute, redirectedFrom) => {
    const location = normalizeLocation(raw, currentRoute, false, router)
    const { name } = location

    if (name) {
      const record = nameMap[name]
      if (!record) {
        return _createRoute(null, location)
      }
      const paramNames = (record.regex as any).keys
      .filter(key => !key.optional)
      .map(key => key.name)

      if (typeof location.params !== 'object') {
        location.params = {}
      }
      if (currentRoute && typeof currentRoute.params === 'object') {
        for (const key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key]
          }
        }
      }

      location.path = fillParams(record.path, location.params, `named route "${name}"`)
      return _createRoute(record, location, redirectedFrom)
    } else if (location.path) {
      location.params = {}
      for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i]
        const record = pathMap[path]
        if (matchRoute(record.regex, location.path, location.params)) {
          return _createRoute(record, location, redirectedFrom)
        }
      }
    }

    return _createRoute(null, location)
  }

  function _createRoute (
    record?: RouteRecord,
    location?: Location,
    redirectedFrom?: Location
  ): Route {
    if (record && record.redirect) {
      // return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      // return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match
  }
}


function matchRoute (
  regex: any,
  path: string,
  params: Object
): boolean {
  const m = decodeURI(path).match(regex)

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (let i = 1, len = m.length; i < len; ++i) {
    const key = regex.keys[i - 1]
    if (key) {
      // Fix #1994: using * with props: true generates a param named 0
      params[key.name || 'pathMatch'] = m[i]
    }
  }

  return true
}

function resolveRecordPath (path: string, record: RouteRecord): string {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}
