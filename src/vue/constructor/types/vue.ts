import Vue from '../instance/Vue';
import { VNode } from '../../render-component-without-props/vdom/vnode';
type LifecycleHook = Function[] | null;
type LiftcycleEnum =
  | 'beforeCreate'
  | 'created'
  | 'beforeMount'
  | 'mounted'
  | 'beforeUpdate'
  | 'activated'
  | 'deactivated'
  | 'beforeDestroy'
  | 'destroyed'
  | 'errorCaptured'
export type ComponentLifecycle = Partial<Record<LiftcycleEnum, LifecycleHook>>


export type ComputedType = Record<string, (Function | ComputedObjectType)>
export type WatchType = Record<string, (Function | WatchObjectOptions)>
export interface BaseComponentOptions {
  el?: string
  data?: DefaultData
  props?: Props
  computed?: ComputedType
  watch?: WatchType
  methods?: Record<string, Function>
  render?: Function;

  name?: string;

  parent?: Vue

  _base?: any;
  _propKeys?: string[]
  propsData?: any
  _isComponent?: boolean
  _parentVnode?: VNode
}

export interface ComponentOptions extends BaseComponentOptions, ComponentLifecycle {}

/*  */
type DefaultData = object | ((this: any) => object);
export interface PropOptions {
  type?: any;
  required?: boolean;
  default: any;
  validator?: (val: any) => boolean;
}
type Props = string[] | Record<string, PropOptions>
export type ComputedObjectType = {
  get?: () => void;
  set?: (val?: any, oldVal?: any) => any;
  cache?: boolean
}
export interface WatchObjectOptions {
  deep?: boolean;
  immediate?: boolean;
  handler: WatchHandler
}
export type WatchHandler = (this: Vue, val: any, oldVal: any) => void;
