import * as CSS from 'csstype'
import { VNode } from '../vdom/vnode';
import { ModuleHookSet } from './patch-hook';
import { Props } from './vue';

export type CSSPropertiesKeys = keyof CSS.Properties
export type CssBodyDeclaration = {
  [x in CSSPropertiesKeys]?: string | number
}

type Key = string | number

type String2StringType = Record<string, string>
// on
type NativeOn = {
  [N in keyof HTMLElementEventMap]?: (e: HTMLElementEventMap[N]) => void
}
export type On = NativeOn & {
  [event: string]: EventListener
}
type VNodeStyle = CssBodyDeclaration

interface _VNodeData {
  key: Key;
  class: any;
  tag: string;
  style: string | String2StringType | String2StringType[];
  props: Props;
  attrs: Record<string, any>;
  on: On
  normalizedStyle: VNodeStyle
  hook: ModuleHookSet
}
export type VNodeData = Partial<_VNodeData>

export type VNodeChildren = VNode | VNode[] | string | boolean | string[] | (VNode | string)[] |null