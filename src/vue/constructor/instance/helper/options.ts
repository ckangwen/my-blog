import Vue, { VueCtor } from '../Vue';
import { ComponentOptions } from '../../types/vue';
import { hasSymbol } from '../../utils/utils';
import {
  hasOwn,
  extend,
  __DEV__,
  warn,
  LIFECYCLE_HOOKS,
  ASSET_TYPES,
  isPlainObject,
  camelize,
  toRawType
} from '../../utils';


function defaultStrategy(parentVal: any, childVal: any): any {
  return childVal === undefined
    ? parentVal
    : childVal
}

const strategies: any = {}
if (__DEV__) {
  strategies.el = strategies.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        `option "${key}" can only be used during instance ` +
        'creation with the `new` keyword.'
      )
    }
    return defaultStrategy(parent, child)
  }
}
strategies.data = function (parentVal: any, childVal: any, vm: any) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
}
LIFECYCLE_HOOKS.forEach(hook => {
  strategies[hook] = mergeHook
})
ASSET_TYPES.forEach(type => {
  strategies[type] = mergeAssset
})
strategies.watch = function (parentVal: Object, childVal: Object, vm: Vue, key: string) {
  if (!childVal) return Object.create(parentVal || null)
  if (__DEV__) {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = {}
  extend(ret, parentVal)
  for (const key in childVal) {
    let parent = ret[key]
    const child = childVal[key]
    if (parent && !Array.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child]
  }
  return ret
}

strategies.props =
strategies.methods =
strategies.computed =
strategies.inject = function (parentVal: Object, childVal: Object, vm: Vue, key: string) {
  if (childVal && __DEV__) {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = Object.create(null)
  extend(ret, parentVal)
  if (childVal) extend(ret, childVal)
  return ret
}
strategies.provide = mergeDataOrFn



function normalizeProps(options: ComponentOptions) {
  const { props } = options
  if (!props) return
  const res = {}
  let i, val, name
  // props选项数据有两种形式，一种是['a', 'b', 'c'],一种是{ a: { type: 'String', default: 'hahah' }}
  if (Array.isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }

  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val)
        ? val
        : { type: val }
    }
  }
  options.props = res
}

export function mergeOptions(parent?: ComponentOptions, child?: ComponentOptions, vm?: Vue): ComponentOptions {
  normalizeProps(child)

  if (child._base) {
    // if (child.extends) {
    //   parent = mergeOptions(parent, child.extends, vm)
    // }
    // if (child.mixins) {
    //   for (let i = 0, l = child.mixins.length; i < l; i++) {
    //     parent = mergeOptions(parent, child.mixins[i], vm)
    //   }
    // }
  }

  const options: ComponentOptions = {}

  Object.keys(parent).forEach(key => {
    if (parent[key]) {
      mergeField(key)
    }
  })
  Object.keys(child).forEach(key => {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  })

  function mergeField (key) {
    const strat = strategies[key] || defaultStrategy
    options[key] = strat(parent[key], child[key], vm, key)
  }

  return options
}

export function resolveConstructorOptions(Ctor: VueCtor) {
  let options = Ctor.options
  /* 当前函数是Vue的扩展子类 */
  if (Ctor.super) {
    // TODO Vue.extend()
  }
  return options
}
function resolveModifiedOptions (Ctor: any) {
  let modified
  const latest = Ctor.options
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = latest[key]
    }
  }
  return modified
}




/**
 * parentVal与childVal合并
 */
function mergeAssset(parentVal: Object, childVal: Object, vm: Vue, key: string) {
  const res = Object.create(parentVal || null)
  if (__DEV__) {
    return extend(res, childVal)
  }
  return res
}


function assertObjectType (name: string, value: any, vm: Vue) {
  if (!isPlainObject(value)) {
    warn(
      `Invalid value for option "${name}": expected an Object, ` +
      `but got ${toRawType(value)}.`,
      vm
    )
  }
}

function mergeHook(parentVal: Function[], childVal: Function[]) {
  const res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
  return res
    ? dedupeHooks(res)
    : res
}
function dedupeHooks(hooks) {
  const res = []
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i])
    }
  }
  return res
}

function mergeDataOrFn(parentVal: any, childVal: any, vm?: any) {
  if (!vm) {
    if (!childVal) return parentVal
    if (!parentVal) return childVal

    return function mergedDataFn() {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn() {
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

function mergeData(to: Object, from: Object) {
  if (!from) return to
  let key, toVal, fromVal

  const keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from)

  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    // in case the object is already observed...
    if (key === '__ob__') continue
    toVal = to[key]
    fromVal = from[key]
    if (!hasOwn(to, key)) {
      // $set(to, key, fromVal)
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal)
    }
  }
  return to
}