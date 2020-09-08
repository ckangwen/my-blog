import { VNode } from '../vdom/vnode';

export type PreHook = () => any
export type InitHook = (vnode: VNode, hydrating?: boolean) => any
export type CreateHook = (emptyVNode: VNode, vnode: VNode) => any
export type InsertHook = (vnode: VNode) => any
export type PrePatchHook = (oldVNode: VNode, vnode: VNode) => any
export type UpdateHook = (oldVNode: VNode, vnode: VNode) => any
export type PostPatchHook = (oldVNode: VNode, vnode: VNode) => any
export type DestroyHook = (vnode: VNode) => any
export type RemoveHook = (vnode: VNode, removeCallback: () => void) => any
export type PostHook = () => any


export interface ModuleHooks {
  pre?: PreHook
  init?: InitHook
  create?: CreateHook
  insert?: InsertHook
  prepatch?: PrePatchHook
  update?: UpdateHook
  destroy?: DestroyHook
  remove?: RemoveHook
  post?: PostHook
  postpatch?: PostPatchHook
}

export type Module = {
  pre?: Set<PreHook>
  init?: Set<InitHook>
  create?: Set<CreateHook>
  insert?: Set<InsertHook>
  update?: Set<UpdateHook>
  destroy?: Set<DestroyHook>
  remove?: Set<RemoveHook>
  post?: Set<PostHook>
  prepatch?: Set<PrePatchHook>
  postpatch?: Set<PostPatchHook>
}

export type ModuleHookEnum = keyof Module

export type ModuleHookSet = { [T in ModuleHookEnum]?: Set<ModuleHooks[T]> }
