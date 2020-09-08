import { VNodeData } from '../types/vnode';
import Vue from '../instance/Vue';
import { VNode } from './vnode';
import { __DEV__, warn } from '../utils/utils';
import { isObject } from '../../constructor/utils/is';
import { ModuleHooks } from '../types/patch-hook';
import { ComponentOptions } from '../../constructor/types/vue';


const componentVNodeHooks: ModuleHooks = {
  init(vnode: VNode, hydrating: boolean) {
    /* 生成组件实例 */
    const child = vnode.componentInstance = createComponentInstance(vnode, vnode.componentOptions.parent, vnode.componentOptions.Ctor)
    /* 渲染为真实DOM */
    child.$mount(hydrating ? (vnode.elm as Element) : undefined, hydrating)
  },
  prepatch(oldVnode: VNode, vnode: VNode) {
    const options = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    child.$options._parentVnode = vnode
    // update vm's placeholder node without re-render
    child.$vnode = vnode

    if (child._vnode) { // update child tree's parent
    child._vnode.parent = vnode
    }
  },
  destroy(vnode: VNode) {
    const { componentInstance } = vnode
    if (!componentInstance._isDestroyed) {
      componentInstance.$destory()
    }
  }
}

export function createComponent(
  Ctor?: any,
  data: VNodeData = {},
  context?: Vue,
  children?: VNode[],
  tag?: string
) {
  if (!Ctor) return

  /* 根类，因为它拥有比较全面的api */
  const baseCtor = context.$options._base

  /**
   * 若Ctor是一个对象，则利用Vue.extend将其扩展为Vue子类
   * 适用于注册局部组件的情况，直接将组件的选项(options)传入
   */
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  /* 如果在此阶段Ctor依旧不是一个函数，则表示组件定义有误 */
  if (typeof Ctor !== 'function') {
    if (__DEV__) warn(`Invalid Component definition: ${String(Ctor)}`, context)
    return
  }

  /* 调用生成组件的必要的hook，在渲染vnode的过程中调用 */
  installComponentHooks(data)

  /* 记录组件名，用于生成组件tag */
  const name = Ctor.options.name || tag

  const vnode = new VNode({
    context,
    data,
    tag: `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    componentOptions: {
      parent: context,
      Ctor,
      tag,
      children
    }
  })

  return vnode
}

/**
 * 将内部hook与外部hook都合并到Set中
 * 外部hook：
 * h('div', {
 *   key: 'key',
 *   hook: {
 *     init() {}
 *   }
 * })
 */
function installComponentHooks(data: VNodeData) {
  const hooks = data.hook || (data.hook = {})
  for(const key in componentVNodeHooks) {
    const hook = componentVNodeHooks[key]
    if (!hooks[key]) {
      hooks[key] = new Set()
    }
    hooks[key].add(hook)
  }
}


function createComponentInstance(
  vnode: VNode,
  parent: any,
  Ctor
): Vue {
  const options: ComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }

  return new Ctor(options)
}