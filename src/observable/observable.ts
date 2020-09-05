import { proxyToRaw, rawToProxy } from './internals';
import { Raw } from './types';
import baseHandlers from './handlers'
import { storeObservable } from './store';
export function observable(obj: Raw = {}) {
  if (proxyToRaw.has(obj)) return obj

  return rawToProxy.get(obj) || createObservable(obj)
}

function createObservable<T extends Raw>(raw: T): T {
  //
  const handlers = baseHandlers
  const observable = new Proxy<Raw>(raw, handlers)

  rawToProxy.set(raw, observable)
  proxyToRaw.set(observable, raw)

  /**
   * 建立一个映射
   * 原始值 -> 存储这个原始值的各个key收集到依赖函数的Map
   */
  storeObservable(raw)
  return observable as  T
}