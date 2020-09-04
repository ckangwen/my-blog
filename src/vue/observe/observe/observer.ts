import { Dep } from './Dep';
import { def, hasOwn, isPlainObject, __DEV__ } from '../utils/utils';
import { isObject } from '../utils/is';
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


function isObservable(value: any) {
  if (value && value.__ob__) {
    return true
  }
  return false
}