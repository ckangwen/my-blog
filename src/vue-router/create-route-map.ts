import { pathToRegexp } from 'path-to-regexp'
import { RouteConfig, RouteRecord } from './types/router';
import { Dictionary } from './types/helper';
import { cleanPath } from './utils/path';

export function createRouteMap(
  routes: RouteConfig[],
  oldPathList: string[] = [],
  oldPathMap: Dictionary<RouteRecord> = Object.create(null),
  oldNameMap: Dictionary<RouteRecord> = Object.create(null),
) {
  const pathList = oldPathList
  const pathMap = oldPathMap
  const nameMap = oldNameMap

  routes.forEach(route => {
    addRouteRecord(pathList, pathMap, nameMap, route)
  })

  // 确保通配符路由总是在最后
  let index = pathList.indexOf('*')
  if (index > -1) {
    pathList.push(
      pathList.splice(index, 1)[0]
    )
  }

  return {
    pathList,
    pathMap,
    nameMap
  }
}

function addRouteRecord(
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>,
  route: RouteConfig,
  parent?: RouteRecord,
  matchAs?: string
) {
  const { path, name, component, components, redirect, meta = {}, props } = route
  const normalizedPath = normalizePath(path, parent, false)

  const routeRecord: RouteRecord = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath),
    components: components || { default: component },
    instances: {},
    name,
    parent,
    matchAs,
    redirect,
    meta,
    props: props == null
      ? {}
      : components
        ? props
        : ({ default: props } as any)
  }

  if (route.children) {
    // TODO
  }

  if (!pathMap[path]) {
    pathList.push(path)
    pathMap[path] = routeRecord
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = routeRecord
    }
  }


}

function normalizePath(path: string, parent: RouteRecord, strict?: boolean) {
  if (!strict) path = path.replace(/\/$/, '')
  if (path[0] === '/') return path
  if (parent == null) return path
  return cleanPath(`${parent.path}/${path}`)
}

function compileRouteRegex(
  path: string,
) {
  const regex = pathToRegexp(path, [])
  return regex
}