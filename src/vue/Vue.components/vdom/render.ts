import { VNode } from './vnode';
import { domApi } from './dom-api';
import { isPrimitive, isDef, isFunction } from '../utils';
import { Module } from '../types/patch-hook';

type ArraysOf<T> = {
  [K in keyof T]: Array<T[K]>;
}
type ModuleHooks = ArraysOf<Partial<Module>>
type HookEnums = keyof Module
type KeyToIndexMap = {[key: string]: number}

const hooks: Array<HookEnums> = ['create', 'update', 'remove', 'destroy', 'prepatch', 'post']
const emptyVNode = new VNode({})

export function generatePatch(modules: Module[]) {
  const cbs: ModuleHooks = {
    create: [],
    update: [],
    destroy: [],
    prepatch: [],
    remove: []
  }

  hooks.forEach(hook => {
    cbs[hook] = [];
    (modules || []).forEach(m => {
      const _hook = m[hook]
      if (isDef(_hook)) {
        (cbs[hook] as any[]).push(_hook)
      }
    })
  })

  function removeVNodes(vnodes: VNode[], startIdx: number, endIdx: number) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeNode(ch.elm)
          callPatchHook([cbs, (ch.data.hook || {})], 'destroy')
        } else {
          removeNode(ch.elm)
          callPatchHook([cbs, (ch.data.hook || {})], 'destroy')
        }
      }
    }
  }

  function addVNodes(parentEl: Node, before: Node, vnodes: VNode[], startIdx: number, endIdx: number, insertedVnodeQueue?: VNode[]) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]
      if (ch != null) {
        domApi.insertBefore(parentEl, createElm(ch), before)
      }
    }
  }

  function createChildren(vnode: VNode, children: VNode[]) {
    if (Array.isArray(children)) {
      children.forEach(child => {
        createElm(child, vnode.elm)
      })
    } else if (isPrimitive(vnode.text)) {
      // vnode作为父节点，将文本插入vnode.elm
      domApi.appendChild(vnode.elm, domApi.createTextNode(String(vnode.text)))
    }
  }
  function createElm(
    vnode: VNode,
    parentEl?: Node,
    refEl?: Node
  ): Node {
    let { data, tag } = vnode
    let children = vnode.children as VNode[]
    if (tag) {
      // 创建真实DOM
      vnode.elm = domApi.createElement(tag)
      // 创建子节点
      createChildren(vnode, children)
      /**
       * 调用create hook
       * 传递的参数为：空VNode和当前VNode
       * cbs是内部的回调，主要是完善DOM相关的属性，例如class、style、event等
       */
      if (data) {
        callPatchHook([cbs, (data.hook || {})], 'create', emptyVNode, vnode)
      }
    } else if (vnode.isComment) {
      vnode.elm = domApi.createComment(vnode.text)
    } else {
      vnode.elm = domApi.createTextNode(vnode.text)
    }
    // 将真实DOMvnode.elm插入到父节点
    insertVnode(parentEl, vnode.elm, refEl)

    return vnode.elm
  }

  /**
   * diff children
   */
  function updateChildren(
    parentEl: Node,
    oldCh: VNode[],
    newCh: VNode[],
    insertedVnodeQueue?: VNode[]
  ) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let newEndIdx = newCh.length - 1
    let oldStartVnode = oldCh[0]
    let newStartVnode = newCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndVnode = newCh[newEndIdx]

    let oldKeyToIdx: KeyToIndexMap | undefined
    let idxInOld: number
    let elmToMove: VNode
    let before: any

    // if (__DEV__) checkDuplicateKeys(newCh)

    // 直到oldCh或newCh其中有一个遍历结束为止
    // 最多处理一个节点，算法复杂度为O(n)
    while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // 如果进行比较的 4 个节点中存在空节点，为空的节点下标向中间推进，继续下个循环
      if (!isDef(oldStartVnode)) {  // oldvnode 首节点为null
        oldStartVnode = oldCh[++oldStartIdx]
      } else if (!isDef(oldEndVnode)) {  // oldvnode 尾节点为null
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (!isDef(newStartVnode)) {  // newvnode 首节点为null
        newStartVnode = newCh[++newStartIdx]
      } else if (!isDef(newEndVnode)) {  // oldvnode 尾节点为null
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {  // 当前比较的新旧节点的相同，直接调用 patchVnode，比较其子元素，然后下标向中间推进
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) { // 同上
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
        domApi.insertBefore(parentEl, oldStartVnode.elm!, domApi.nextSibling(oldEndVnode.elm!))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
        domApi.insertBefore(parentEl, oldEndVnode.elm!, oldStartVnode.elm!)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        // 创建 key 到 index 的映射
        if (!oldKeyToIdx) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        }

        // 如果下标不存在，说明这个节点是新创建的
        idxInOld = oldKeyToIdx[newStartVnode.key as string]
        if (!isDef(idxInOld)) { // 新增节点，插入到newStartVnode的前面
          domApi.insertBefore(parentEl, createElm(newStartVnode), oldStartVnode.elm!)
        } else {
          // 如果是已经存在的节点 找到需要移动位置的节点
          elmToMove = oldCh[idxInOld]
          // 虽然 key 相同了，但是 seletor 不相同，需要调用 createElm 来创建新的 dom 节点
          if (sameVnode(elmToMove, newStartVnode)) {
            domApi.insertBefore(parentEl, createElm(newStartVnode), oldStartVnode.elm!)
          } else {
            // 否则调用 patchVnode 对旧 vnode 做更新
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
            oldCh[idxInOld] = undefined as any
            domApi.insertBefore(parentEl, elmToMove.elm!, oldStartVnode.elm!)
          }
        }
      }
    }

    // 循环结束后，可能会存在两种情况
    // 1. oldCh 已经全部处理完成，而 newCh 还有新的节点，需要对剩下的每个项都创建新的 dom
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
        addVNodes(parentEl, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
      } else { // 2. newCh 已经全部处理完成，而 oldCh 还有旧的节点，需要将多余的节点移除
        removeVNodes(oldCh, oldStartIdx, oldEndIdx)
      }
    }
  }

  function patchVnode(
    oldVnode: VNode,
    vnode: VNode,
    insertedVnodeQueue?: VNode[]
  ) {
    if (oldVnode === vnode) return

    const elm = vnode.elm = oldVnode.elm
    const oldCh = oldVnode.children as VNode[]
    const ch = vnode.children as VNode[]

    const data = vnode.data || {}
    let dataHook = data.hook || {}

    callPatchHook(dataHook, 'prepatch')
    if (isPatchable(vnode)) {
      callPatchHook([cbs, dataHook], 'update', oldVnode, vnode)
    }

    if (vnode.tag) {
      if (oldCh && ch) {
        if (oldCh !== ch) {
          updateChildren(elm, oldCh, ch, insertedVnodeQueue)
        } else if (ch) {
          if (oldVnode.text) domApi.setTextContent(elm, '')
          addVNodes(elm, null, ch, 0, ch.length - 1)
        } else if (oldCh) {
          removeVNodes(oldCh, 0, oldCh.length - 1)
        } else if (oldVnode.text) {
          domApi.setTextContent(elm, '')
        }
      }
    } else if (oldVnode.text !== vnode.text) {
      domApi.setTextContent(elm, vnode.text)
    }

    callPatchHook(dataHook,'postpatch')
  }

  return function patch(
    oldVnode: VNode | Node,
    vnode: VNode,
  ) {
    if (!oldVnode) {
      createElm(vnode)
    } else {
      /**
       * 如果oldvnode存在，则会存在两种情况
       * 1. oldvnode是DOM
       * 2. oldvnode是更新前的vnode
       */
      const isRealElement = !!(oldVnode as any).nodeType
      if (!isRealElement && sameVnode(oldVnode as VNode, vnode)) {
        patchVnode(oldVnode as VNode, vnode)
      } else {
        if (isRealElement) {
          /**
           * 在Vue中，如果是oldVnode真实DOM，则表示是初次挂载
           * 根据真实DOM创建出VNode
           * */
          oldVnode = emptyNodeAt(oldVnode as Element)
        }

        /* 该vnode的DOM */
        const oldEl = (oldVnode as VNode).elm
        /* 该vnode的parent DOM */
        const parentEl = domApi.parentNode(oldEl)

        /* 更新vnode */
        createElm(
          vnode,
          parentEl,
          domApi.nextSibling(oldEl)
        )

        /* 删除oldvnode生成的DOM */
        if (parentEl) {
          removeVNodes([oldVnode as VNode], 0, 0)
        } else if ((oldVnode as VNode).tag) {
          // TODO oldVnode是一个VNode，在更新VNode后执行
        }
      }
    }

    return vnode.elm
  }
}


/********  DOM helper ********/
function insertVnode(parent: Node, el: Node, ref?: Node) {
  if (parent) {
    if (ref) {
      if (domApi.parentNode(ref) === parent) {
        domApi.insertBefore(parent, el, ref)
      }
    } else {
      domApi.appendChild(parent, el)
    }
  }
}
function removeNode(el: Node) {
  const parent = domApi.parentNode(el)
  if (parent) domApi.removeChild(parent, el)
}

/********  VNode helper ********/
function emptyNodeAt(elm: Element) {
  return new VNode({
    tag: domApi.tagName(elm),
    elm
  })
}

function sameVnode(a: VNode, b: VNode) {
  return (
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b)
  )
}
function sameInputType (a, b) {
  if (a.tag !== 'input') return true
  let i
  const typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type
  const typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

/********  others helper ********/
const callPatchHook = (context: Object | Object[], hook: HookEnums, ...args) => {
  if (Array.isArray(context)) {
    context.forEach(ctx => {
      callPatchHook(ctx, hook, ...args)
    })
  } else {
    let fn = context[hook]
    if (Array.isArray(fn)) {
      fn.forEach(f => {
        isFunction(f) && f(...args)
      })
    } else if (isFunction(fn)) {
      fn(...args)
    }
  }
}


const isTextInputType = type => [ 'text', 'number', 'password', 'search', 'email', 'tel', 'url '].indexOf(type) > -1

function isPatchable(vnode: VNode) {
  return vnode.tag
}

function createKeyToOldIdx (children: VNode[], beginIdx: number, endIdx: number): KeyToIndexMap {
  const map: KeyToIndexMap = {}
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i]?.key
    if (key !== undefined) {
      map[key] = i
    }
  }
  return map
}
