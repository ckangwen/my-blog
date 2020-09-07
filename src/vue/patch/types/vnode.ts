import * as CSS from 'csstype'
import { VNode } from '../vdom/vnode';
import { Module } from './patch-hook';

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
type On = NativeOn & {
  [event: string]: EventListener
}
type VNodeStyle = CssBodyDeclaration

interface _VNodeData {
  key: Key;
  class: any;
  tag: string;
  style: string | String2StringType | String2StringType[];
  props: Record<string, any>;
  attrs: Record<string, any>;
  on: On
  normalizedStyle: VNodeStyle
  hook: Partial<Module>
}
export type VNodeData = Partial<_VNodeData>

export type VNodeChildren = VNode | VNode[] | string | boolean | string[] | (VNode | string)[] |null