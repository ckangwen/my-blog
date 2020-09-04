import Vue from '../instance/Vue';
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



export interface BaseComponentOptions {
  el?: string
  data?: DefaultData
  props?: Props
  computed?: Record<string, (Function | ComputedObjectType)>
  watch?: Record<string, (Function | WatchObjectOptions)>
  methods?: Record<string, Function>
  render?: Function;

  name?: string;

  _base?: any;
  _propKeys?: string[]
  propsData?: any
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
