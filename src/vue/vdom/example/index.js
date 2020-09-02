(function () {
  'use strict';

  var VNode = /** @class */ (function () {
      function VNode(_a) {
          var tag = _a.tag, data = _a.data, children = _a.children, text = _a.text, elm = _a.elm, context = _a.context;
          this.tag = tag;
          this.data = data;
          this.children = children;
          this.text = text;
          this.elm = elm;
          this.context = context;
      }
      return VNode;
  }());
  function createTextVNode(text) {
      if (text === void 0) { text = ''; }
      return new VNode({ text: text });
  }
  function createEmptyVNode(text) {
      if (text === void 0) { text = ''; }
      var vnode = new VNode({ text: text });
      vnode.isComment = true;
      return vnode;
  }

  function createElement(tagName) {
      return document.createElement(tagName);
  }
  function createTextNode(text) {
      return document.createTextNode(text);
  }
  function createComment(text) {
      return document.createComment(text);
  }
  function insertBefore(parentNode, newNode, referenceNode) {
      parentNode.insertBefore(newNode, referenceNode);
  }
  function removeChild(node, child) {
      node.removeChild(child);
  }
  function appendChild(node, child) {
      node.appendChild(child);
  }
  function parentNode(node) {
      return node.parentNode;
  }
  function nextSibling(node) {
      return node.nextSibling;
  }
  function tagName(elm) {
      return elm.tagName;
  }
  function setTextContent(node, text) {
      node.textContent = text;
  }
  function getTextContent(node) {
      return node.textContent;
  }
  function isElement(node) {
      return node.nodeType === 1;
  }
  function isText(node) {
      return node.nodeType === 3;
  }
  function isComment(node) {
      return node.nodeType === 8;
  }
  var domApi = {
      createElement: createElement,
      createTextNode: createTextNode,
      createComment: createComment,
      insertBefore: insertBefore,
      removeChild: removeChild,
      appendChild: appendChild,
      parentNode: parentNode,
      nextSibling: nextSibling,
      tagName: tagName,
      setTextContent: setTextContent,
      getTextContent: getTextContent,
      isElement: isElement,
      isText: isText,
      isComment: isComment,
  };

  function isPrimitive(s) {
      return typeof s === 'string' || typeof s === 'number';
  }
  function isDef(c) {
      return c !== undefined && c !== null;
  }

  function generatePatch() {
      function createChildren(vnode, children) {
          if (Array.isArray(children)) {
              children.forEach(function (child) {
                  createElm(child, vnode.elm);
              });
          }
          else if (isPrimitive(vnode.text)) {
              // vnode作为父节点，将文本插入vnode.elm
              domApi.appendChild(vnode.elm, domApi.createTextNode(String(vnode.text)));
          }
      }
      function createElm(vnode, parentEl, refEl) {
          var data = vnode.data, tag = vnode.tag;
          var children = vnode.children;
          if (tag) {
              // 创建真实DOM
              vnode.elm = domApi.createElement(tag);
              createChildren(vnode, children);
          }
          else if (vnode.isComment) {
              vnode.elm = domApi.createComment(vnode.text);
          }
          else {
              vnode.elm = domApi.createTextNode(vnode.text);
          }
          // 将真实DOMvnode.elm插入到父节点
          insertVnode(parentEl, vnode.elm, refEl);
          return vnode.elm;
      }
      return function patch(oldVnode, vnode) {
          if (!oldVnode) {
              createElm(vnode);
          }
          else {
              /**
               * 如果oldvnode存在，则会存在两种情况
               * 1. oldvnode是DOM
               * 2. oldvnode是更新前的vnode
               */
              var isRealElement = !!oldVnode.nodeType;
              if (!isRealElement && sameVnode(oldVnode, vnode)) ;
              else {
                  if (isRealElement) {
                      /* 根据真实DOM创建出VNode */
                      oldVnode = emptyNodeAt(oldVnode);
                  }
                  /* 该vnode的DOM */
                  var oldEl = oldVnode.elm;
                  /* 该vnode的parent DOM */
                  var parentEl = domApi.parentNode(oldEl);
                  /* 更新vnode */
                  createElm(vnode, parentEl, domApi.nextSibling(oldEl));
                  console.log(vnode);
                  /* 删除oldvnode生成的DOM */
                  if (parentEl) {
                      removeNode(oldVnode.elm);
                  }
                  else if (oldVnode.tag) ;
              }
          }
          return vnode.elm;
      };
  }
  /********  DOM helper ********/
  function insertVnode(parent, el, ref) {
      if (parent) {
          if (ref) {
              if (domApi.parentNode(ref) === parent) {
                  domApi.insertBefore(parent, el, ref);
              }
          }
          else {
              domApi.appendChild(parent, el);
          }
      }
  }
  function removeNode(el) {
      var parent = domApi.parentNode(el);
      if (parent)
          domApi.removeChild(parent, el);
  }
  /********  VNode helper ********/
  function emptyNodeAt(elm) {
      return new VNode({
          tag: domApi.tagName(elm),
          elm: elm
      });
  }
  function sameVnode(a, b) {
      return (a.tag === b.tag &&
          a.isComment === b.isComment &&
          isDef(a.data) === isDef(b.data) &&
          sameInputType(a, b));
  }
  function sameInputType(a, b) {
      if (a.tag !== 'input')
          return true;
      var i;
      var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
      var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
      return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB);
  }
  var isTextInputType = function (type) { return ['text', 'number', 'password', 'search', 'email', 'tel', 'url '].indexOf(type) > -1; };

  var patch = generatePatch();

  function createElement$1(tag, data, children) {
      /* 没有传入data */
      if (Array.isArray(data) || isPrimitive(data)) {
          children = data;
          data = undefined;
      }
      if (!tag)
          return createTextVNode();
      children = normalizeChildren(children);
      console.log(children);
      var vnode;
      if (typeof tag === 'string') {
          vnode = new VNode({
              tag: tag,
              data: data,
              children: children
          });
      }
      if (isDef(vnode)) {
          return vnode;
      }
      else {
          return createEmptyVNode();
      }
  }
  /**
   * 校验子组件是否符合规范
   */
  function normalizeChildren(children) {
      return isPrimitive(children)
          ? [createTextVNode(children)]
          : Array.isArray(children)
              ? normalizeArrayChildren(children)
              : undefined;
  }
  /**
   * TODO 省略了合并相邻文本节点的过程
   */
  function normalizeArrayChildren(children, nestedIndex) {
      return children.map(function (child, i) {
          if (!isDef(child) || typeof child === 'boolean')
              return null;
          if (isPrimitive(child)) {
              return createTextVNode(child);
          }
          else if (Array.isArray(child)) {
              return normalizeArrayChildren(child);
          }
          else {
              // TODO 如果是v-for的情况
              return child;
          }
      });
  }

  var el = document.querySelector('#app');
  var vnode = createElement$1('div', {}, [
      createElement$1('span', {}, 'hello world'),
      'welcome'
  ]);
  patch(el, vnode);

}());
