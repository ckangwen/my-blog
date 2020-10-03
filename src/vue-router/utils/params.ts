import { compile } from 'path-to-regexp'
import { warn } from './helper';
import { Dictionary } from '../types/helper';

const regexpCompileCache: {
  [key: string]: Function
} = Object.create(null)

export function fillParams (
  path: string,
  params?: Dictionary<any>,
  routeMsg?: string
): string {
  params = params || {}
  try {
    const filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = compile(path))

    // Fix #2505 resolving asterisk routes { name: 'not-found', params: { pathMatch: '/not-found' }}
    // and fix #3106 so that you can work with location descriptor object having params.pathMatch equal to empty string
    if (typeof params.pathMatch === 'string') params[0] = params.pathMatch

    return filler(params, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof params.pathMatch !== 'string') {
        warn(`missing param for ${routeMsg}: ${e.message}`)
      }
    }
    return ''
  } finally {
    // delete the 0 if it was added
    delete params[0]
  }
}
