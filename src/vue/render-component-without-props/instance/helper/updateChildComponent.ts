export function updateChildComponent(
  vm,
  parentVnode,
  renderChildren
) {
  vm.$options._parentVnode = parentVnode
  // update vm's placeholder node without re-render
  vm.$vnode = parentVnode

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode
  }
  vm.$options._renderChildren = renderChildren
}