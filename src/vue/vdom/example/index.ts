import { patch } from '../vdom/patch';
import { VNode } from '../vdom/vnode';
import { createElement } from '../vdom/createElement';

const el = document.querySelector('#app')
const vnode = createElement('div', {}, [
  createElement('p', {}, 'hello world'),
  'welcome'
])

patch(el, vnode)