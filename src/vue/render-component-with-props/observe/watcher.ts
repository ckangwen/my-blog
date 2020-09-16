import { __DEV__, noop, warn, remove } from '../utils/utils';
import { WatcherCotrOptions } from '../types/observe';
import { Dep, pushTarget, popTarget } from './Dep';
import { isObject } from '../utils/is';
import Vue from '../instance/Vue';


let uid = 0
export class Watcher {
  vm?: Vue;
  id?: number;
  cb?: Function;
  deep?: boolean;
  dirty?: boolean;
  user?: boolean;
  lazy?: boolean;
  sync?: boolean;
  active?: boolean;
  deps?: Dep[];
  newDeps?: Dep[];
  depIds?: Set<any>;
  newDepIds?: Set<any>;
  expression?: string;
  getter?: Function;
  before?(): Function;
  value?: any;

  constructor(
    vm: Vue,
    expOrFn: Function | string,
    cb: Function,
    options?: WatcherCotrOptions,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    this.cb = cb
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.id = ++uid
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.dirty = this.lazy
    this.active = true
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        __DEV__ && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }

    this.expression = __DEV__ ? String(expOrFn) : ''
    this.value = this.lazy ? undefined : this.get()
  }

  get() {
    pushTarget(this)
    const value = this.getter.call(this.vm, this.vm)
    if (this.deep) {
      // TODO traverse
    }
    popTarget()
    this.cleanupDeps()
    return value
  }

  cleanupDeps() {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      // 遍历deps，找出不在newDeps里的dep
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    // depIds
    let tmp: any = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = this.depIds
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  addDep(dep: Dep) {
    const id = dep.id
    /**
     * 在最新值获取完毕之后，newDepIds将会清空
     */
    if (!this.newDepIds.has(id)) { // 该依赖尚不存在，则添加
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  update() {
    // TODO 异步更新
    if (this.lazy) {
      this.dirty = true
    } else {
      this.run()
    }
  }

  run() {
    if (this.active) {
      /**
       * this.get()获取当前最新的值
       * 如果当前最新值与更新前的值(this.value)不一致，则需要更新this.value，并触发回调
       */
      const value = this.get()
      if (
        value !== this.value ||
        isObject(value)
      ) {
        const oldValue = this.value
        this.value = value
        this.cb.call(this.vm, value, oldValue)
      }
    }
  }

  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  depend() {
    let i = this.deps.length
    while (i--) {
      this.deps[i].subscribe()
    }
  }

  teardown() {
    if (this.active) {
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      this.deps.forEach(dep => {
        dep.removeSub(this)
      })
      this.active = false
    }
  }
}




/******** helper *******/
export const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
function parsePath(path: string) {
  if (bailRE.test(path)) return

  const segments = path.split('.')
  return function (obj: any) { // 调用obj.xx.xxx
    for(let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
