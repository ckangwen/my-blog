import { ComponentOptions, ComputedType, WatchType, ExtendsApiOptions, GlobalComponentApiType } from '../types/vue';
import { resolveConstructorOptions, mergeOptions } from './helper/options';
import { VNode } from '../vdom/vnode';
import { Watcher } from '../observe/watcher';
import { patch } from '../vdom/patch';
import { WatcherOptions } from '../types/observe';
import { initGlobalAPI } from '../global-api/index';
import { init } from './helper/init';
import { On } from '../types/vnode';
import {
  __DEV__,
  warn,
  isObject,
  inBrowser,
  query,
  noop,
  remove
} from '../utils';

type EventsMap = {
  [key: string]: Function[]
}



export type VueCtor = {
  cid?: number;
  options?: ComponentOptions
  super?: Vue;
  extend?: (options: ExtendsApiOptions) => any
  component?: GlobalComponentApiType
}

let uid = 0
export default class Vue {
  static cid?: number
  static options?: ComponentOptions

  /* 静态属性 */
  _uid?: number | string
  _self?: Vue
  /** 实例是否已挂载 */
  _isMounted?: boolean
  /** 实例是否已销毁 */
  _isDestroyed?: boolean
  _isBeingDestroyed?: boolean
  /** 存储所有事件处理函数 */
  _events?: EventsMap
  _data?: Object
  _props?: Object
  _vnode?: VNode
  _watcher?: Watcher
  _watchers?: Watcher[]
  _computedWatchers?: any


  /* 实例属性 */
  $el?: any;
  $options?: ComponentOptions;
  /* 源自options.parent，通常指代当前组件实例的父组件实例，若是根组件则为空 */
  $parent?: Vue;
  $root?: Vue;
  $children?: Vue[];
  $data?: Record<string, any>;
  $props?: Record<string, any>;
  $vnode?: VNode;
  $createElement?: Function;
  $listeners?: On

  __patch__ = patch

  constructor(options: ComponentOptions) {
    this._init(options)
  }

  _init(options: ComponentOptions = {}) {
    const vm: Vue = this
    vm._uid = ++uid
    vm._self = vm
    init(vm, options)
  }

  _render() {
    const vm: Vue = this
    const { render } = vm.$options
    let vnode = render.call(vm, vm.$createElement)

    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    return vnode
  }

  _update(vnode: VNode, hydrating?: boolean) {
    const vm: Vue = this
    /* vnode记录当前DOM映射的VNode */
    const prevVnode = vm._vnode

    /** _vnode表示当前DOM所表示的VNode */
    vm._vnode = vnode

    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
  }

  $mount(el?: string | Element | undefined, hydrating?: boolean) {
    const vm: Vue = this
    el = el && inBrowser ? query(el) : undefined
    if (el === document.body || el === document.documentElement) {
      __DEV__ && warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      )
      return this
    }
    vm.$el = el

    let updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }

    new Watcher(vm, updateComponent, noop)
    vm._isMounted = true
  }

  $watch(expOrFn: string | Function, cb?: any, options?: WatcherOptions) {
    const vm: Vue = this
    if (isObject(cb)) {

    }

    options = options || {}

    options.user = true

    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch (e) {
        console.error(`callback for immediate watcher "${watcher.expression}"`, e)
      }
    }

    return function unwatchFn() {
      watcher.teardown()
    }
  }

  $destory() {
    const vm: Vue = this
    if (vm._isBeingDestroyed) return

    vm._isBeingDestroyed = true
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed) {
      remove(parent.$children, vm)
    }

    if (vm._watcher) {
      vm._watcher.teardown()
    }

    (vm._watchers || []).forEach(item => {
      item.teardown()
    })

    vm._isDestroyed = true
    vm.__patch__(vm._vnode, null)
  }
}


/* 初始化全局API */
initGlobalAPI(Vue)