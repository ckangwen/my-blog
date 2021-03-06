import { VNodeData, On } from '../types/vnode';
import Vue from '../instance/Vue';
import { VNode } from './vnode';
import { __DEV__, warn, isObject } from '../utils';
import { ModuleHooks } from '../types/patch-hook';
import { ComponentOptions } from '../types/vue';
import { extractPropsFromVNodeData } from './helper/extra-props';


const componentVNodeHooks: ModuleHooks = {
  init(vnode: VNode, hydrating: boolean) {
    /* 生成组件实例 */
    const child = vnode.componentInstance = createComponentInstance(vnode, vnode.componentOptions.parent, vnode.componentOptions.Ctor)
    /* 渲染为真实DOM */
    debugger
    child.$mount(hydrating ? (vnode.elm as Element) : undefined, hydrating)
  },
  prepatch(oldVnode: VNode, vnode: VNode) {
    /* 这里的children指代的是插槽 */
    const { listeners, propsData, children } = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    child.$options._parentVnode = vnode
    // update vm's placeholder node without re-render
    child.$vnode = vnode

    /* _props存储的props的键值对, _props将会被代理到vm上 */
    if (propsData && child.$options.props) {
      const props = child._props
      const propKeys = child.$options._propKeys || []
      Object.keys(propKeys).forEach(key => {
        props[key] = propsData[key]
      })
    }

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
  vnodeData: VNodeData = {},
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

  /* vnodeData.props作为用户传递的数据，Ctor.options.props作为组件接收的数据 */
  const propsData = extractPropsFromVNodeData(vnodeData, Ctor, tag)
  // TODO data.on，组件事件


  /* 调用生成组件的必要的hook，在渲染vnode的过程中调用 */
  installComponentHooks(vnodeData)

  /* 记录组件名，用于生成组件tag */
  const name = Ctor.options.name || tag

  const vnode = new VNode({
    context,
    data: vnodeData,
    tag: `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    componentOptions: {
      parent: context,
      Ctor,
      tag,
      children,
      propsData
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