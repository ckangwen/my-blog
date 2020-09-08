import { VNodeData, VNodeChildren } from '../types/vnode';
import Vue from '../instance/Vue';
import { VueCtor } from '../instance/Vue';

type ComponentOptions = {
  Ctor?: VueCtor
  tag?: string
  children?: VNode[]
  parent?: Vue
}

type VNodeCtorParams = {
  tag?: string;
  data?: VNodeData;
  children?: VNodeChildren;
  text?: string;
  elm?: Node;
  key?: string | number;
  context?: any;
  componentOptions?: ComponentOptions
}


export class VNode {
  tag?: string;
  data?: VNodeData;
  children?: VNodeChildren;
  text?: string;
  elm?: Node;
  key?: string | number;
  context?: any;
  isComment?: boolean;
  componentOptions?: ComponentOptions;
  componentInstance?: Vue;
  parent?: VNode;

  constructor({
    context,
    tag = '',
    data = {},
    children = [],
    text = '',
    elm,
    componentOptions = {}
  }: VNodeCtorParams) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.context = context
    this.componentOptions = componentOptions
    this.componentInstance = undefined
  }
}

export function createTextVNode(text = '') {
  return new VNode({ text })
}

export function createEmptyVNode(text = '') {
  let vnode = new VNode({ text })
  vnode.isComment = true
  return vnode
}