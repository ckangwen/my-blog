import { Dep } from './Dep';
import { def, hasOwn, isPlainObject, __DEV__, warn } from '../utils/utils';
import { isObject, isDef, isPrimitive } from '../utils/is';
import { arrayMethods } from './array';

export class Observer {
  value?: any;
  dep?: Dep;

  constructor(value: any) {
    this.value = value
    this.dep = new Dep()

    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      (value as any).__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  walk(obj: Object) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key)
    })
  }

  observeArray(items: any[]) {
    items.forEach(item => {
      observe(item)
    })
  }
}

export function observe(value: any) {
  if (!isObject(value)) return
  let ob: Observer
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value)
  ) {
    ob = new Observer(value)
  }

  return ob
}

export function defineReactive(
  obj: Object,
  key: string,
  val?: any,
  customSetter?: Function,
  shallow?: boolean // 如果设置为true，则不会对val进行响应式处理，即只对obj的key属性的值响应式处理
) {
  const dep = new Dep()
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  const getter = property && property.get
  const setter = property && property.set

  val = val ? val : obj[key]

  let childOb = !shallow && observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter  () {
      const value = getter ? getter.call(obj) : val
      /**
       * Dep.target存放的是该对象(obj)的监听者，如果没有被监听，就不需要进行订阅
       * 所谓订阅就是将Dep实例存入Watcher实例的deps中
       */
      if (Dep.target) {
        dep.subscribe()
        // 如果子属性也被设置为响应式数据了, 将子属性的Watcher收集到Dep中
        if (childOb) {
          childOb.dep.subscribe()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function  reactiveSetter  (newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (__DEV__ && customSetter) {
        customSetter()
      }
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }

      childOb = !shallow && observe(newVal)
      // 依赖变化后，触发更新，通知Dep类调用notify来触发所有Watcher对象的update方法更新对应视图
      dep.notify()
    }
  })
}

function dependArray(values: any[]) {
  values.forEach(value => {
    if (isObservable(value)) {
      value.__ob__.dep.depend()
    }

    if (Array.isArray(value)) dependArray(value)
  })
}

/* global api */

export function $set(target: any, key: string | number, val?: any) {
  if (__DEV__ && (!isDef(target) || isPrimitive(target))) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${target}`)
  }

  /** 传入的是一个数组，则在指定位置插入val */
  if (Array.isArray(target) && typeof key === 'number') {
    target.length = Math.max(target.length, key)
    /* 通过splice方法使得target数组能够检测到数据的变化 */
    target.splice(key, 1, val)
    return val
  }
  /** 如果是一个对象，且存在了这个key，则返回value */
  if ( typeof key === 'string' && hasOwn(target, key)) {
    target[key] = val
    return val
  }

  const ob = target.__ob__
  // TODO target不可以是vue实例的根数据对象
  /**
   * target._isVue = true，表示是一个vue实例
   * Vue 不允许在已经创建的实例上动态添加新的根级响应式属性(root-level reactive property)
   * */
  if (target._isVue) {
    __DEV__ && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }

  /** 如果不是响应式对象，则直接返回值 */
  if (!ob) {
    target[key] = val
    return val
  }

  /**
   * 如果是响应式对象，为其添加响应式对象，
   * 且由于对象新增了属性需要触发更新 */
  defineReactive(ob.value, key as string, val)
  ob.dep.notify()
  return val
}

export function $delete(target: any, key: string | number) {
  if (__DEV__ && (!isDef(target) || isPrimitive(target))) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${target}`)
  }

  if (Array.isArray(target) && typeof key === 'number') {
    target.splice(key, 1)
    return
  }

  if ( typeof key === 'string' && hasOwn(target, key)) {
    return
  }

  const ob = target.__ob__

  if (target._isVue) {
    __DEV__ && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return
  }

  delete target[key]
  ob && ob.dep.notify()
}

/*  helper */
function isObservable(value: any) {
  if (value && value.__ob__) {
    return true
  }
  return false
}