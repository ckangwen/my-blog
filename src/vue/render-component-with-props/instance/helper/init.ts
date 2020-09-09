import Vue from '../Vue';
import { createElement } from '../../vdom/createElement';
import { ComponentOptions, ComputedType, WatchType } from '../../types/vue';
import { proxy, getData, defineComputed, createWatcher } from './state';
import { observe, defineReactive } from '../../observe/observer';
import { Watcher } from '../../observe/watcher';
import { mergeOptions, resolveConstructorOptions } from './options';
import { VueCtor } from '../../../constructor/instance/Vue';
import {
  isPlainObject,
  __DEV__,
  warn,
  hasOwn,
  isReserved,
  isReservedAttribute,
  hyphenate,
  isHTMLTag,
  noop,
  isDef
} from '../../utils';

/*  init  */
export function init(vm: Vue, options: ComponentOptions) {
  if (options && options._isComponent) {
    initInternalComponent(vm, options)
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor as VueCtor) || {},
      options,
      vm
    )
  }

  initLifecycle(vm)
  initRender(vm)
  initEvents(vm)
  initState(vm)
}

function initInternalComponent(vm, options: ComponentOptions) {
  /* 继承父级组件的options */
  const opts: ComponentOptions = vm.$options = Object.create(vm.constructor.options)
  opts.parent = options.parent

  const parentVnode = options._parentVnode

  const componentOptions = parentVnode.componentOptions
  /* 初始化option.propsData */
  opts.propsData = componentOptions.propsData
  // opts._parentListeners = vnodeComponentOptions.listeners

  // 记录组件名，在formatComponentName中使用
  opts._componentTag = componentOptions.tag
  if (options.render) {
    opts.render = options.render
  }
}

function initLifecycle(vm: Vue) {
  const options = vm.$options
  let parent = options.parent

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm
  vm.$children = []
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}

function initRender(vm: Vue) {
  vm._vnode = null
  vm.$createElement = (a, b, c) => createElement(vm, a, b, c)
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
  options.watch && initWatcher(vm, options.watch)
}

function initProps(vm: Vue, propsOptions: Pick<ComponentOptions, 'props'>['props']) {
  /* propsData保存的是通过父组件或用户传递的真实props数据 */
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  /* 缓存当前实例的所有props的key */
  const keys = vm.$options._propKeys = []
  /* 没有父节点则表示是根节点 */
  const isRoot = !vm.$parent

  for (const key in propsOptions) {
    keys.push(key)
    // TODO 校验props【validateProp(key, propsOptions, propsData, vm)】
    const value = propsData[key]

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

function initComputed(vm: Vue, computed: ComputedType) {
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
    /**
     * 因为方法在Vue示例中通过this调用
     * 所以方法的作用域绑定到vm实例
     * */
    vm[key] = typeof methods[key] !== 'function' ? noop : Function.prototype.bind.call(methods[key], vm)
  }
}

function initWatcher(vm: Vue, watch: WatchType) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
