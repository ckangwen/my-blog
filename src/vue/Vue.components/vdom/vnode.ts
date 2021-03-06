import { VNodeData, VNodeChildren } from '../types/vnode';

type VNodeCtorParams = {
  tag?: string;
  data?: VNodeData;
  children?: VNodeChildren;
  text?: string;
  elm?: Node;
  key?: string | number;
  context?: any;
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

  constructor({
    context,
    tag = '',
    data = {},
    children = [],
    text = '',
    elm,
  }: VNodeCtorParams) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.context = context
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