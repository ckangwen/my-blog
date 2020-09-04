import { ComponentOptions } from '../types/vue';
import { resolveConstructorOptions, mergeOptions } from './helper/options';
import { VNode } from '../vdom/vnode';
import { createElement } from '../vdom/createElement';
import { Watcher } from '../observe/watcher';
import { isPlainObject, __DEV__, warn, hasOwn, isReserved, isReservedAttribute, hyphenate, isHTMLTag, noop, inBrowser, query } from '../utils/utils';
import { proxy, getData, defineComputed } from './helper/state';
import { observe, defineReactive } from '../observe/observer';
import { isDef } from '../utils/is';
import { patch } from '../vdom/patch';

type EventsMap = {
  [key : string]: Function[]
}

export type VueCtor = {
  cid?: number;
  options?: ComponentOptions
  super?: Vue;
}

let uid = 0
export default class Vue {
  static cid?: number;
  static options?: ComponentOptions

  /* 静态属性 */
  _uid?: number | string;
  _self?: Vue;
  /** 实例是否已挂载 */
  _isMounted?: boolean;
  /** 实例是否已销毁 */
  _isDestroyed?: boolean;
  _isBeingDestroyed?: boolean;
  /** 存储所有事件处理函数 */
  _events?: EventsMap;
  _data?: Object;
  _props?: Object;
  _vnode?: VNode;
  _watchers?: Watcher[]
  _computedWatchers?: any


  /* 实例属性 */
  $el?: any;
  $options?: ComponentOptions;
  $parent?: Vue;
  $root?: Vue;
  $children?: Vue[];
  $data?: Record<string, any>;
  $props?: Record<string, any>;
  $vnode?: VNode;
  $createElement?: Function;

  __patch__ = patch

  _init(options: ComponentOptions) {
    const vm: Vue = this
    vm._uid = ++uid
    vm._self = vm

    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor as VueCtor) || {},
      options,
      vm
    )

    initLifecycle(vm)
    initRender(vm)
    initEvents(vm)
    initState(vm)
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

  $mount(el?: string | Element, hydrating?: boolean) {
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

  constructor(options: ComponentOptions) {
    this._init(options)
  }
}

/*  init  */
function initLifecycle(vm: Vue) {
  const options = vm.$options
  vm.$children = []
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}
function initRender(vm: Vue) {
  vm._vnode = null
  vm.$createElement = (a, b,c) => createElement(vm, a, b, c)
}
function initEvents(vm: Vue) {
  vm._events = Object.create(null)
}
function initState(vm: Vue) {
  vm._watchers = []
  const options = vm.$options
  if (options.props) initProps(vm, options.props)
  options.methods && initMethods(vm, options.methods)
  if (options.data) {
    initData(vm)
  } else {
    observe(vm._data = {})
  }
  options.computed && initComputed(vm, options.computed)
  // options.watch && initWatcher(vm, options.watch)
}


function initProps(vm: Vue, propsOptions: Pick<ComponentOptions, 'props'>['props']) {
  /* propsData保存的是通过父组件或用户传递的真实props数据 */
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  /* 缓存当前实例的所有props的key */
  const keys = vm.$options._propKeys = []
  /* 没有父节点则表示是根节点 */
  const isRoot = !vm.$parent

  for(const key in propsOptions) {
    keys.push(key)
    // TODO 校验props
    const value = propsOptions[key]

    if (__DEV__) {
      const hyphenatedKey = hyphenate(key)
      /* 是否是保留字段 */
      if (isReservedAttribute(hyphenatedKey) || isHTMLTag(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }

      defineReactive(props, key, value, () => {
        if (!isRoot) {
          /* 由于父组件重新渲染的时候会重写prop的值，所以应该直接使用prop来作为一个data或者计算属性的依赖 */
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } else {
      defineReactive(props, key, value)
    }

    if (!(key in vm)) {
      // 访问vm[key] 等同于 访问vm._props[key]
      proxy(vm, '_props', key)
    }
  }
}
function initData(vm: Vue) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}

  if (!isPlainObject(data)) {
    data = {}
    __DEV__ && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }

  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods

  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (__DEV__) {
      /* 保证data中的key不与props中的key重复，props优先 */
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    // 如果props有与data同名的方法，给出警告
    if (props && hasOwn(props, key)) {
      __DEV__ && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) { // 不是保留字段
      /* 将data的属性代理到vm实例上 */
      proxy(vm, `_data`, key)
    }
  }

  observe(data)
}

const computedWatcherOptions = { lazy: true }
function initComputed(vm: Vue, computed: Object) {
  const watchers = vm._computedWatchers = Object.create(null)
  for (const key in computed) {
    const userDef = computed[key]
    /** computed可能是一个function也可能是getter + setter */
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (__DEV__ && !isDef(getter)) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    /**
     * 为计算属性创建一个内部的监视器Watcher，保存在vm实例的_computedWatchers
     * 这里的computedWatcherOptions参数传递了一个lazy为true，会使得watch实例的dirty为true
     * */
    watchers[key] = new Watcher(
      vm,
      getter || noop,
      noop,
      computedWatcherOptions
    )

    /**
     * 组件正在定义的计算属性已经定义在现有组件的原型上则不会进行重复定义
     * */
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (__DEV__) {
      /** 与data或props发生命名冲突 */
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
function initMethods(vm: Vue, methods: Object) {
  const props = vm.$options.props
  for (const key in methods) {
    if (__DEV__) {
      /* method不是一个function */
      if (typeof methods[key] !== 'function') {
        warn(
          `Method "${key}" has type "${typeof methods[key]}" in the component definition. ` +
          `Did you reference the function correctly?`,
          vm
        )
      }
      /* 与props发生命名冲突 */
      if (props && hasOwn(props, key)) {
        warn(
          `Method "${key}" has already been defined as a prop.`,
          vm
        )
      }
      /* 方法名不符合规范 */
      if ((key in vm) && isReserved(key)) {
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
          `Avoid defining component methods that start with _ or $.`
        )
      }
    }
    /* 方法的作用域绑定到vm实例 */
    vm[key] = typeof methods[key] !== 'function' ? noop : Function.prototype.bind.call(methods[key], vm)
  }
}
// function initWatcher(vm: Vue, watch: Object) {
//   for (const key in watch) {
//     const handler = watch[key]
//     if (Array.isArray(handler)) {
//       for (let i = 0; i < handler.length; i++) {
//         createWatcher(vm, key, handler[i])
//       }
//     } else {
//       createWatcher(vm, key, handler)
//     }
//   }
// }
