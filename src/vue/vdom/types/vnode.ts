import { VNode } from '../vdom/vnode';
type Key = string | number

type String2StringType = Record<string, string>
// on
type NativeOn = {
  [N in keyof HTMLElementEventMap]?: (e: HTMLElementEventMap[N]) => void
}
type On = NativeOn & {
  [event: string]: EventListener
}


interface _VNodeData {
  key: Key;
  class: any;
  tag: string;
  style: string | String2StringType | String2StringType[];
  props: Record<string, any>;
  attrs: Record<string, any>;
  on: On
}
export type VNodeData = Partial<_VNodeData>

export type VNodeChildren = VNode | VNode[] | string | boolean | string[] | (VNode | string)[] |null