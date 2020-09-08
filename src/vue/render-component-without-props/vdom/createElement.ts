import { VNodeData, VNodeChildren } from '../types/vnode';
import { isPrimitive, isDef } from '../utils/is';
import { createTextVNode, VNode, createEmptyVNode } from './vnode';
import { isHTMLTag, hasOwn, camelize, capitalize, __DEV__, warn } from '../utils/utils';
import Vue from '../instance/Vue';
import { createComponent } from './createComponent';

export function createElement(
  context?: Vue,
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
        context,
        tag,
        data,
        children
      })
    } else {
      const components = context.$options.components
      let CompOptions = resolveGlobalComponents(components, tag)
      if (CompOptions) {
        vnode = createComponent(CompOptions, data, context, (children as VNode[]), tag)
      }
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
 * 省略了合并相邻文本节点的过程
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

function resolveGlobalComponents(components: any[], tag: string) {
  if (hasOwn(components, tag)) {
    return components[tag]
  }
  const camelizedId = camelize(tag)
  if (hasOwn(components, camelizedId)) return components[camelizedId]
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(components, PascalCaseId)) return components[PascalCaseId]

  if (__DEV__) {
    console.warn(
      'Failed to resolve component' +  ': ' + tag
    )
  }
}