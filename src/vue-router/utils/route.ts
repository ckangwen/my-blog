import { RouteRecord, Location, Route } from '../types/router';
import { stringifyQuery as _stringifyQuery } from './query';
import { clone, isObjectEqual } from './helper';

export function createRoute(
  record: RouteRecord,
  location?: Location,
  redirectedFrom?: Location,
  router?: any
) {
  const stringifyQuery = router && router.options.stringifyQuery || _stringifyQuery
  let query: any = location.query || {}
  try {
    query = clone(query)
  } catch (e) {}

  const route: Route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : []
  }

  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery)
  }
  return Object.freeze(route)
}

export const START = createRoute(null, {
  path: '/'
})

function getFullPath(location: Location, stringifyQuery) {
  return (location.path || '/') + stringifyQuery(location.query) + location.hash
}
function formatMatch (record?: RouteRecord): RouteRecord[] {
  const res = []
  while (record) {
    res.unshift(record)
    record = record.parent
  }
  return res
}
