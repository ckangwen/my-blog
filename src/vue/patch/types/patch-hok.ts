import { VNode } from '../vdom/vnode';

export type PreHook = () => any
export type InitHook = (vnode: VNode) => any
export type CreateHook = (emptyVNode: VNode, vnode: VNode) => any
export type InsertHook = (vnode: VNode) => any
export type PrePatchHook = (oldVNode: VNode, vnode: VNode) => any
export type UpdateHook = (oldVNode: VNode, vnode: VNode) => any
export type PostPatchHook = (oldVNode: VNode, vnode: VNode) => any
export type DestroyHook = (vnode: VNode) => any
export type RemoveHook = (vnode: VNode, removeCallback: () => void) => any
export type PostHook = () => any


export interface Hooks {
  init?: InitHook
  create?: CreateHook
  insert?: InsertHook
  prepatch?: PrePatchHook
  update?: UpdateHook
  postpatch?: PostPatchHook
  destroy?: DestroyHook
  remove?: RemoveHook
  post?: PostHook
}

export type Module = {
  prepatch?: PrePatchHook
  create?: CreateHook
  update?: UpdateHook
  destroy?: DestroyHook
  remove?: RemoveHook
  post?: PostHook
}
