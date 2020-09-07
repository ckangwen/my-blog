import { VNodeData, VNodeChildren } from '../types/vnode';
import { isPrimitive, isDef } from '../utils/is';
import { createTextVNode, VNode, createEmptyVNode } from './vnode';
import { isHTMLTag } from '../../constructor/utils/utils';
export function createElement(
  tag?: string,
  data?: VNodeData,
  children?: VNodeChildren
): VNode {
  /* 没有传入data */
  if (Array.isArray(data) || isPrimitive(data)) {
    children = data
    data = undefined
  }

  if (!tag) return createTextVNode()

  children = normalizeChildren(children) as VNode[]

  let vnode
  if (typeof tag === 'string') {
    if (isHTMLTag(tag)) {
      vnode = new VNode({
        tag,
        data,
        children
      })
    } else {
      // TODO 全局组件
    }
  } else {
    // TODO component
  }

  if (isDef(vnode)) {
    return vnode
  } else {
    return createEmptyVNode()
  }
}

/**
 * 校验子组件是否符合规范
 */
function normalizeChildren(children: VNodeChildren) {
  return isPrimitive(children)
    ? [ createTextVNode(children) ]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}
/**
 * TODO 省略了合并相邻文本节点的过程
 */
function normalizeArrayChildren(children: VNodeChildren[], nestedIndex: string = '') {
  return children.map((child, i) => {
    if (!isDef(child) || typeof child === 'boolean') return null
    if (isPrimitive(child)) {
      return createTextVNode(child)
    } else if (Array.isArray(child)) {
      return normalizeArrayChildren(child, `${nestedIndex}_${i}`)
    } else {
      // TODO 如果是v-for的情况
      return child
    }
  })
}