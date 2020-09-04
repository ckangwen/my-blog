import { noop, isPlainObject } from '../../utils/utils';
import Vue from '../Vue';
import { pushTarget, popTarget, Dep } from '../../observe/Dep';

const sharedPropertyDefinition: PropertyDescriptor = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

/**
 * 在target上设置一个代理，实现通过访问target.key来访问target.sourceKey.key的目的
 */
export function proxy(target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition as any)
}

/*****  data  *****/
export function getData(data: Function, vm: Vue) {
  pushTarget()
  try {
    return data.call(vm, vm)
  } catch (e) {
    console.error(e);
    return {}
  } finally {
    popTarget()
  }
}


/******** Computed ********/

/******** computed ********/
export function defineComputed(target: any, key: string, userDef: any) {
  // 默认computed应该缓存
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key)
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get ?
      userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get) // 绑定getter的作用域?
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
function createComputedGetter(key: string) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      /**
       * 脏检测，在计算属性中的依赖发生变化时，dirty会变为true，
       * 在get的时候重新计算计算属性的输出值
       */
      if (watcher.dirty) {
        watcher.evaluate()
      }
      /** 收集依赖 */
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}


/******** Watcher ********/
function createWatcher (
  vm: Vue,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  /**
     watch: {
        name: {
          handler() {},
          deep: true
        }
    }
   */
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  /** 传入的是一个字符串，则从实例中调用该属性 */
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  // return vm.$watch && vm.$watch(expOrFn, handler, options)
}