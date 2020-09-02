import { VNode } from './vnode';
import { domApi } from './dom-api';
import { isPrimitive, isDef } from '../utils/is';

export function generatePatch() {
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
      createChildren(vnode, children)
    } else if (vnode.isComment) {
      vnode.elm = domApi.createComment(vnode.text)
    } else {
      vnode.elm = domApi.createTextNode(vnode.text)
    }
    // 将真实DOMvnode.elm插入到父节点
    insertVnode(parentEl, vnode.elm, refEl)

    return vnode.elm
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
        // TODO 更新VNode
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
          removeNode((oldVnode as VNode).elm)
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

const isTextInputType = type => [ 'text', 'number', 'password', 'search', 'email', 'tel', 'url '].indexOf(type) > -1
