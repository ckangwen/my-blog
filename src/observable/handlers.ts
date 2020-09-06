import { rawToProxy, proxyToRaw } from './internals';
import { Raw, Key, Observable } from './types';
import { registerRunningReactionForOperation, hasRunningReaction } from './reactionRunner';
const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * 拦截可观察对象的get操作，以了解哪个反应使用了它们的属性
 */
function get(target: Raw, key: Key, receiver: Observable) {
  const result = Reflect.get(target, key)
  // register and save (observable.prop -> runningReaction)
  registerRunningReactionForOperation({ target, key, type: 'get' })
  const observableResult = rawToProxy.get(target)
  if (hasRunningReaction() && typeof observableResult === 'object' && observableResult !== null) {
    if (observableResult) return observableResult

    // none-configurable
  }
  return observableResult || result
}

/**
 * intercept set operations on observables to know when to trigger reactions
 */
function set(target: Raw, key: Key, value: any, receiver: Observable) {
  if (typeof value === 'object' && value !== null) {
    value = proxyToRaw.get(value) || value
  }
  const hasKey = hasOwnProperty.call(target, key)
  const oldValue = target[key]
  const result = Reflect.set(target, key, value, receiver)
  /**
   * key不是target的直接属性
   */
  if (target !== proxyToRaw.get(receiver)) {
    return result
  }

  if (!hasKey) {

  } else if (value !== oldValue) {

  }
  return result
}

function has(target, key) {
  const result = Reflect.has(target, key)
  // registerRunningReactionForOperation({ target, key, type: 'has' })
  return result
}
function ownKeys (target) {
  // registerRunningReactionForOperation({ target, type: 'iterate' })
  return Reflect.ownKeys(target)
}

export default {
  get
}