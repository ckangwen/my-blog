(function () {
  'use strict';

  function isPrimitive(s) {
      return typeof s === 'string' || typeof s === 'number';
  }
  function isDef(c) {
      return c !== undefined && c !== null;
  }
  function isObject(obj) {
      return obj !== null && typeof obj === 'object';
  }
  function isNative(Ctor) {
      return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
  }
  function isFunction(obj) {
      return typeof obj === 'function';
  }

  function remove(arr, item) {
      if (arr.length) {
          var index = arr.indexOf(item);
          if (index > -1) {
              return arr.splice(index, 1);
          }
      }
  }
  function cached(fn) {
      var cache = Object.create(null);
      return function cachedFn(str) {
          var hit = cache[str];
          return hit || (cache[str] = fn(str));
      };
  }
  function noop() { }
  var toString = Object.prototype.toString;
  var OBJECT_STRING = '[object Object]';
  function isPlainObject(obj) {
      return toString.call(obj) === OBJECT_STRING;
  }
  var camelizeRE = /-(\w)/g;
  var camelize = function (str) {
      return str.replace(camelizeRE, function (_, c) { return (c ? c.toUpperCase() : ''); });
  };
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasOwn = function (val, key) { return hasOwnProperty.call(val, key); };
  var extend = function (a, b) {
      for (var key in b) {
          a[key] = b[key];
      }
      return a;
  };
  var emptyObject = Object.freeze({});
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cached(function (str) {
      return str.replace(hyphenateRE, '-$1').toLowerCase();
  });
  /**
   * Check if a string starts with $ or _
   */
  function isReserved(str) {
      var c = (str + '').charCodeAt(0);
      return c === 0x24 || c === 0x5F;
  }
  function toObject(arr) {
      var res = {};
      for (var i = 0; i < arr.length; i++) {
          if (arr[i]) {
              extend(res, arr[i]);
          }
      }
      return res;
  }
  function def(obj, key, val, enumerable) {
      Object.defineProperty(obj, key, {
          value: val,
          enumerable: !!enumerable,
          writable: true,
          configurable: true
      });
  }
  var __DEV__ = "development" !== 'production';
  var isReservedAttribute = function (key) { return ['key', 'ref', 'slot', 'slot-scope', 'is'].indexOf(key) > -1; };
  var HTMLTag = [
      'html', 'body', 'base',
      'head', 'link', 'meta',
      'style', 'title', 'address',
      'article', 'aside', 'footer',
      'header', 'h1', 'h2',
      'h3', 'h4', 'h5',
      'h6', 'hgroup', 'nav',
      'section', 'div', 'dd',
      'dl', 'dt', 'figcaption',
      'figure', 'picture', 'hr',
      'img', 'li', 'main',
      'ol', 'p', 'pre',
      'ul', 'blockquote', 'iframe', 'tfoot',
      'a', 'b', 'abbr', 'bdi', 'bdo',
      'br', 'cite', 'code', 'data', 'dfn',
      'em', 'i', 'kbd', 'mark', 'q',
      'rp', 'rt', 'rtc', 'ruby', 's',
      'samp', 'small', 'span', 'strong', 'sub',
      'sup', 'time', 'u', 'var', 'wbr',
      'area', 'audio', 'map', 'track', 'video',
      'embed', 'object', 'param', 'source', 'canvas',
      'script', 'noscript', 'del', 'ins', 'caption',
      'col', 'colgroup', 'table', 'thead', 'tbody',
      'td', 'th', 'tr', 'button', 'datalist',
      'fieldset', 'form', 'input', 'label', 'legend',
      'meter', 'optgroup', 'option', 'output', 'progress',
      'select', 'textarea', 'details', 'dialog', 'menu',
      'menuitem', 'summary', 'content', 'element', 'shadow',
      'template'
  ];
  var isHTMLTag = function (tag) {
      return HTMLTag.indexOf(tag) > -1;
  };
  var inBrowser = typeof window !== 'undefined';
  function query(el) {
      if (typeof el === 'string') {
          var selected = document.querySelector(el);
          if (!selected) {
               warn('Cannot find element: ' + el);
              return document.createElement('div');
          }
          return selected;
      }
      else {
          return el;
      }
  }
  var warn = noop;
  var formatComponentName = function (vm) {
      if (vm.$root === vm) {
          return 'root instance';
      }
      var name = vm._isVue
          ? vm.$options.name || vm.$options._componentTag
          : vm.name;
      return name ? "component " + name : "anonymous component";
  };
  {
      var hasConsole_1 = typeof console !== undefined;
      var formatLocation_1 = function (str) {
          if (str === 'anonymous component') {
              str += " - use the \"name\" option for better debugging messages.";
          }
          return "(found in " + str + ")";
      };
      warn = function (msg, vm) {
          if (hasConsole_1) {
              console.warn('[Vue warn]: ' + msg + (vm ? formatLocation_1(formatComponentName(vm)) : ''));
          }
      };
  }
  var isBuiltInTag = function (key) { return ['slot', 'component'].indexOf(key) > -1; };
  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
  function validateComponentName(name) {
      if (!new RegExp("^[a-zA-Z][\\-\\.0-9_" + unicodeRegExp.source + "]*$").test(name)) {
          warn('Invalid component name: "' + name + '". Component names ' +
              'should conform to valid custom element name in html5 specification.');
      }
      if (isBuiltInTag(name)) {
          warn('Do not use built-in or reserved HTML elements as component ' +
              'id: ' + name);
      }
  }
  var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) &&
      typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);
  function toRawType(value) {
      return Object.prototype.toString.call(value).slice(8, -1);
  }

  var LIFECYCLE_HOOKS = [
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeDestroy',
      'destroyed',
      'activated',
      'deactivated',
      'errorCaptured',
      'serverPrefetch'
  ];
  var ASSET_TYPES = [
      'component',
      'directive',
      'filter'
  ];

  function defaultStrategy(parentVal, childVal) {
      return childVal === undefined
          ? parentVal
          : childVal;
  }
  var strategies = {};
  {
      strategies.el = strategies.propsData = function (parent, child, vm, key) {
          if (!vm) {
              warn("option \"" + key + "\" can only be used during instance " +
                  'creation with the `new` keyword.');
          }
          return defaultStrategy(parent, child);
      };
  }
  strategies.data = function (parentVal, childVal, vm) {
      if (!vm) {
          if (childVal && typeof childVal !== 'function') {
               warn('The "data" option should be a function ' +
                  'that returns a per-instance value in component ' +
                  'definitions.', vm);
              return parentVal;
          }
          return mergeDataOrFn(parentVal, childVal);
      }
      return mergeDataOrFn(parentVal, childVal, vm);
  };
  LIFECYCLE_HOOKS.forEach(function (hook) {
      strategies[hook] = mergeHook;
  });
  ASSET_TYPES.forEach(function (type) {
      strategies[type] = mergeAssset;
  });
  strategies.watch = function (parentVal, childVal, vm, key) {
      if (!childVal)
          return Object.create(parentVal || null);
      {
          assertObjectType(key, childVal, vm);
      }
      if (!parentVal)
          return childVal;
      var ret = {};
      extend(ret, parentVal);
      for (var key_1 in childVal) {
          var parent = ret[key_1];
          var child = childVal[key_1];
          if (parent && !Array.isArray(parent)) {
              parent = [parent];
          }
          ret[key_1] = parent
              ? parent.concat(child)
              : Array.isArray(child) ? child : [child];
      }
      return ret;
  };
  strategies.props =
      strategies.methods =
          strategies.computed =
              strategies.inject = function (parentVal, childVal, vm, key) {
                  if (childVal && __DEV__) {
                      assertObjectType(key, childVal, vm);
                  }
                  if (!parentVal)
                      return childVal;
                  var ret = Object.create(null);
                  extend(ret, parentVal);
                  if (childVal)
                      extend(ret, childVal);
                  return ret;
              };
  strategies.provide = mergeDataOrFn;
  function normalizeProps(options) {
      var props = options.props;
      if (!props)
          return;
      var res = {};
      var i, val, name;
      // props选项数据有两种形式，一种是['a', 'b', 'c'],一种是{ a: { type: 'String', default: 'hahah' }}
      if (Array.isArray(props)) {
          i = props.length;
          while (i--) {
              val = props[i];
              if (typeof val === 'string') {
                  name = camelize(val);
                  res[name] = { type: null };
              }
              else {
                  warn('props must be strings when using array syntax.');
              }
          }
      }
      else if (isPlainObject(props)) {
          for (var key in props) {
              val = props[key];
              name = camelize(key);
              res[name] = isPlainObject(val)
                  ? val
                  : { type: val };
          }
      }
      options.props = res;
  }
  function mergeOptions(parent, child, vm) {
      normalizeProps(child);
      if (child._base) ;
      var options = {};
      Object.keys(parent).forEach(function (key) {
          if (parent[key]) {
              mergeField(key);
          }
      });
      Object.keys(child).forEach(function (key) {
          if (!hasOwn(parent, key)) {
              mergeField(key);
          }
      });
      function mergeField(key) {
          var strat = strategies[key] || defaultStrategy;
          options[key] = strat(parent[key], child[key], vm, key);
      }
      return options;
  }
  function resolveConstructorOptions(Ctor) {
      var options = Ctor.options;
      /* 当前函数是Vue的扩展子类 */
      if (Ctor.super) {
          var superOptions = resolveConstructorOptions(Ctor.super);
          var cachedSuperOptions = Ctor.superOptions;
          if (superOptions !== cachedSuperOptions) {
              Ctor.superOptions = superOptions;
              // check if there are any late-modified/attached options (#4976)
              var modifiedOptions = resolveModifiedOptions(Ctor);
              // update base extend options
              if (modifiedOptions) {
                  extend(Ctor.extendOptions, modifiedOptions);
              }
              options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
              if (options.name) {
                  options.components[options.name] = Ctor;
              }
          }
      }
      return options;
  }
  function resolveModifiedOptions(Ctor) {
      var modified;
      var latest = Ctor.options;
      var sealed = Ctor.sealedOptions;
      for (var key in latest) {
          if (latest[key] !== sealed[key]) {
              if (!modified)
                  modified = {};
              modified[key] = latest[key];
          }
      }
      return modified;
  }
  /**
   * parentVal与childVal合并
   */
  function mergeAssset(parentVal, childVal, vm, key) {
      var res = Object.create(parentVal || null);
      {
          return extend(res, childVal);
      }
      return res;
  }
  function assertObjectType(name, value, vm) {
      if (!isPlainObject(value)) {
          warn("Invalid value for option \"" + name + "\": expected an Object, " +
              ("but got " + toRawType(value) + "."), vm);
      }
  }
  function mergeHook(parentVal, childVal) {
      var res = childVal
          ? parentVal
              ? parentVal.concat(childVal)
              : Array.isArray(childVal)
                  ? childVal
                  : [childVal]
          : parentVal;
      return res
          ? dedupeHooks(res)
          : res;
  }
  function dedupeHooks(hooks) {
      var res = [];
      for (var i = 0; i < hooks.length; i++) {
          if (res.indexOf(hooks[i]) === -1) {
              res.push(hooks[i]);
          }
      }
      return res;
  }
  function mergeDataOrFn(parentVal, childVal, vm) {
      if (!vm) {
          if (!childVal)
              return parentVal;
          if (!parentVal)
              return childVal;
          return function mergedDataFn() {
              return mergeData(typeof childVal === 'function' ? childVal.call(this, this) : childVal, typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal);
          };
      }
      else {
          return function mergedInstanceDataFn() {
              var instanceData = typeof childVal === 'function'
                  ? childVal.call(vm, vm)
                  : childVal;
              var defaultData = typeof parentVal === 'function'
                  ? parentVal.call(vm, vm)
                  : parentVal;
              if (instanceData) {
                  return mergeData(instanceData, defaultData);
              }
              else {
                  return defaultData;
              }
          };
      }
  }
  function mergeData(to, from) {
      if (!from)
          return to;
      var key, toVal, fromVal;
      var keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from);
      for (var i = 0; i < keys.length; i++) {
          key = keys[i];
          // in case the object is already observed...
          if (key === '__ob__')
              continue;
          toVal = to[key];
          fromVal = from[key];
          if (!hasOwn(to, key)) ;
          else if (toVal !== fromVal &&
              isPlainObject(toVal) &&
              isPlainObject(fromVal)) {
              mergeData(toVal, fromVal);
          }
      }
      return to;
  }

  var uid = 0;
  var Dep = /** @class */ (function () {
      function Dep() {
          this.id = ++uid;
          this.subs = [];
      }
      Dep.prototype.addSub = function (sub) {
          this.subs.push(sub);
      };
      Dep.prototype.removeSub = function (sub) {
          remove(this.subs, sub);
      };
      /** 将自身(Dep)添加到Watcher */
      Dep.prototype.subscribe = function () {
          if (Dep.target) {
              Dep.target.addDep(this);
          }
      };
      /**
       * 依赖的对象发生了变化，通知依赖进行更新
       * 遍历Watcher实例数组，调用update方法
       * */
      Dep.prototype.notify = function () {
          var subs = this.subs.slice();
          for (var i = 0, l = subs.length; i < l; i++) {
              subs[i].update();
          }
      };
      return Dep;
  }());
  Dep.target = null;
  function pushTarget(target) {
      Dep.target = target;
  }
  function popTarget() {
      Dep.target = null;
  }

  var uid$1 = 0;
  var Watcher = /** @class */ (function () {
      function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
          this.vm = vm;
          this.cb = cb;
          this.deps = [];
          this.newDeps = [];
          this.depIds = new Set();
          this.newDepIds = new Set();
          this.id = ++uid$1;
          if (isRenderWatcher) {
              vm._watcher = this;
          }
          this.active = true;
          if (typeof expOrFn === 'function') {
              this.getter = expOrFn;
          }
          else {
              this.getter = parsePath(expOrFn);
              if (!this.getter) {
                  this.getter = noop;
                   warn("Failed watching path: \"" + expOrFn + "\" " +
                      'Watcher only accepts simple dot-delimited paths. ' +
                      'For full control, use a function instead.', vm);
              }
          }
          this.expression =  String(expOrFn) ;
          this.value = this.get();
      }
      Watcher.prototype.get = function () {
          pushTarget(this);
          var value = this.getter.call(this.vm, this.vm);
          if (this.deep) ;
          popTarget();
          this.cleanupDeps();
          return value;
      };
      Watcher.prototype.cleanupDeps = function () {
          var i = this.deps.length;
          while (i--) {
              var dep = this.deps[i];
              // 遍历deps，找出不在newDeps里的dep
              if (!this.newDepIds.has(dep.id)) {
                  dep.removeSub(this);
              }
          }
          // depIds
          var tmp = this.depIds;
          this.depIds = this.newDepIds;
          this.newDepIds = this.depIds;
          this.newDepIds.clear();
          tmp = this.deps;
          this.deps = this.newDeps;
          this.newDeps = tmp;
          this.newDeps.length = 0;
      };
      Watcher.prototype.addDep = function (dep) {
          var id = dep.id;
          /**
           * 在最新值获取完毕之后，newDepIds将会清空
           */
          if (!this.newDepIds.has(id)) { // 该依赖尚不存在，则添加
              this.newDepIds.add(id);
              this.newDeps.push(dep);
              if (!this.depIds.has(id)) {
                  dep.addSub(this);
              }
          }
      };
      Watcher.prototype.update = function () {
          // queueWatcher(this)
          this.run();
      };
      Watcher.prototype.run = function () {
          if (this.active) {
              /**
               * this.get()获取当前最新的值
               * 如果当前最新值与更新前的值(this.value)不一致，则需要更新this.value，并触发回调
               */
              var value = this.get();
              if (value !== this.value ||
                  isObject(value)) {
                  var oldValue = this.value;
                  this.value = value;
                  this.cb.call(this.vm, value, oldValue);
              }
          }
      };
      Watcher.prototype.teardown = function () {
          var _this = this;
          if (this.active) {
              if (!this.vm._isBeingDestroyed) {
                  remove(this.vm._watchers, this);
              }
              this.deps.forEach(function (dep) {
                  dep.removeSub(_this);
              });
              this.active = false;
          }
      };
      return Watcher;
  }());
  /******** helper *******/
  var unicodeRegExp$1 = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
  var bailRE = new RegExp("[^" + unicodeRegExp$1.source + ".$_\\d]");
  function parsePath(path) {
      if (bailRE.test(path))
          return;
      var segments = path.split('.');
      return function (obj) {
          for (var i = 0; i < segments.length; i++) {
              if (!obj)
                  return;
              obj = obj[segments[i]];
          }
          return obj;
      };
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
      return r;
  }

  var VNode = /** @class */ (function () {
      function VNode(_a) {
          var context = _a.context, _b = _a.tag, tag = _b === void 0 ? '' : _b, _c = _a.data, data = _c === void 0 ? {} : _c, _d = _a.children, children = _d === void 0 ? [] : _d, _e = _a.text, text = _e === void 0 ? '' : _e, elm = _a.elm;
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

  var hooks = ['create', 'update', 'remove', 'destroy', 'prepatch', 'post'];
  var emptyVNode = new VNode({});
  function generatePatch(modules) {
      var cbs = {
          create: [],
          update: [],
          destroy: [],
          prepatch: [],
          remove: []
      };
      hooks.forEach(function (hook) {
          cbs[hook] = [];
          (modules || []).forEach(function (m) {
              var _hook = m[hook];
              if (isDef(_hook)) {
                  cbs[hook].push(_hook);
              }
          });
      });
      function removeVNodes(vnodes, startIdx, endIdx) {
          for (; startIdx <= endIdx; ++startIdx) {
              var ch = vnodes[startIdx];
              if (isDef(ch)) {
                  if (isDef(ch.tag)) {
                      removeNode(ch.elm);
                      callPatchHook([cbs, (ch.data.hook || {})], 'destroy');
                  }
                  else {
                      removeNode(ch.elm);
                      callPatchHook([cbs, (ch.data.hook || {})], 'destroy');
                  }
              }
          }
      }
      function addVNodes(parentEl, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
          for (; startIdx <= endIdx; ++startIdx) {
              var ch = vnodes[startIdx];
              if (ch != null) {
                  domApi.insertBefore(parentEl, createElm(ch), before);
              }
          }
      }
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
              // 创建子节点
              createChildren(vnode, children);
              /**
               * 调用create hook
               * 传递的参数为：空VNode和当前VNode
               * cbs是内部的回调，主要是完善DOM相关的属性，例如class、style、event等
               */
              if (data) {
                  callPatchHook([cbs, (data.hook || {})], 'create', emptyVNode, vnode);
              }
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
      /**
       * diff children
       */
      function updateChildren(parentEl, oldCh, newCh, insertedVnodeQueue) {
          var oldStartIdx = 0;
          var newStartIdx = 0;
          var oldEndIdx = oldCh.length - 1;
          var newEndIdx = newCh.length - 1;
          var oldStartVnode = oldCh[0];
          var newStartVnode = newCh[0];
          var oldEndVnode = oldCh[oldEndIdx];
          var newEndVnode = newCh[newEndIdx];
          var oldKeyToIdx;
          var idxInOld;
          var elmToMove;
          var before;
          // if (__DEV__) checkDuplicateKeys(newCh)
          // 直到oldCh或newCh其中有一个遍历结束为止
          // 最多处理一个节点，算法复杂度为O(n)
          while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
              // 如果进行比较的 4 个节点中存在空节点，为空的节点下标向中间推进，继续下个循环
              if (!isDef(oldStartVnode)) { // oldvnode 首节点为null
                  oldStartVnode = oldCh[++oldStartIdx];
              }
              else if (!isDef(oldEndVnode)) { // oldvnode 尾节点为null
                  oldEndVnode = oldCh[--oldEndIdx];
              }
              else if (!isDef(newStartVnode)) { // newvnode 首节点为null
                  newStartVnode = newCh[++newStartIdx];
              }
              else if (!isDef(newEndVnode)) { // oldvnode 尾节点为null
                  newEndVnode = newCh[--newEndIdx];
              }
              else if (sameVnode(oldStartVnode, newStartVnode)) { // 当前比较的新旧节点的相同，直接调用 patchVnode，比较其子元素，然后下标向中间推进
                  patchVnode(oldStartVnode, newStartVnode);
                  oldStartVnode = oldCh[++oldStartIdx];
                  newStartVnode = newCh[++newStartIdx];
              }
              else if (sameVnode(oldEndVnode, newEndVnode)) { // 同上
                  patchVnode(oldEndVnode, newEndVnode);
                  oldEndVnode = oldCh[--oldEndIdx];
                  newEndVnode = newCh[--newEndIdx];
              }
              else if (sameVnode(oldStartVnode, newEndVnode)) { // vnode moved right
                  patchVnode(oldStartVnode, newEndVnode);
                  domApi.insertBefore(parentEl, oldStartVnode.elm, domApi.nextSibling(oldEndVnode.elm));
                  oldStartVnode = oldCh[++oldStartIdx];
                  newEndVnode = newCh[--newEndIdx];
              }
              else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
                  patchVnode(oldEndVnode, newStartVnode);
                  domApi.insertBefore(parentEl, oldEndVnode.elm, oldStartVnode.elm);
                  oldEndVnode = oldCh[--oldEndIdx];
                  newStartVnode = newCh[++newStartIdx];
              }
              else {
                  // 创建 key 到 index 的映射
                  if (!oldKeyToIdx) {
                      oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                  }
                  // 如果下标不存在，说明这个节点是新创建的
                  idxInOld = oldKeyToIdx[newStartVnode.key];
                  if (!isDef(idxInOld)) { // 新增节点，插入到newStartVnode的前面
                      domApi.insertBefore(parentEl, createElm(newStartVnode), oldStartVnode.elm);
                  }
                  else {
                      // 如果是已经存在的节点 找到需要移动位置的节点
                      elmToMove = oldCh[idxInOld];
                      // 虽然 key 相同了，但是 seletor 不相同，需要调用 createElm 来创建新的 dom 节点
                      if (sameVnode(elmToMove, newStartVnode)) {
                          domApi.insertBefore(parentEl, createElm(newStartVnode), oldStartVnode.elm);
                      }
                      else {
                          // 否则调用 patchVnode 对旧 vnode 做更新
                          patchVnode(elmToMove, newStartVnode);
                          oldCh[idxInOld] = undefined;
                          domApi.insertBefore(parentEl, elmToMove.elm, oldStartVnode.elm);
                      }
                  }
              }
          }
          // 循环结束后，可能会存在两种情况
          // 1. oldCh 已经全部处理完成，而 newCh 还有新的节点，需要对剩下的每个项都创建新的 dom
          if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
              if (oldStartIdx > oldEndIdx) {
                  before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
                  addVNodes(parentEl, before, newCh, newStartIdx, newEndIdx);
              }
              else { // 2. newCh 已经全部处理完成，而 oldCh 还有旧的节点，需要将多余的节点移除
                  removeVNodes(oldCh, oldStartIdx, oldEndIdx);
              }
          }
      }
      function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
          if (oldVnode === vnode)
              return;
          var elm = vnode.elm = oldVnode.elm;
          var oldCh = oldVnode.children;
          var ch = vnode.children;
          var data = vnode.data || {};
          var dataHook = data.hook || {};
          callPatchHook(dataHook, 'prepatch');
          if (isPatchable(vnode)) {
              callPatchHook([cbs, dataHook], 'update', oldVnode, vnode);
          }
          if (vnode.tag) {
              if (oldCh && ch) {
                  if (oldCh !== ch) {
                      updateChildren(elm, oldCh, ch);
                  }
                  else if (ch) {
                      if (oldVnode.text)
                          domApi.setTextContent(elm, '');
                      addVNodes(elm, null, ch, 0, ch.length - 1);
                  }
                  else if (oldCh) {
                      removeVNodes(oldCh, 0, oldCh.length - 1);
                  }
                  else if (oldVnode.text) {
                      domApi.setTextContent(elm, '');
                  }
              }
          }
          else if (oldVnode.text !== vnode.text) {
              domApi.setTextContent(elm, vnode.text);
          }
          callPatchHook(dataHook, 'postpatch');
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
              if (!isRealElement && sameVnode(oldVnode, vnode)) {
                  patchVnode(oldVnode, vnode);
              }
              else {
                  if (isRealElement) {
                      /**
                       * 在Vue中，如果是oldVnode真实DOM，则表示是初次挂载
                       * 根据真实DOM创建出VNode
                       * */
                      oldVnode = emptyNodeAt(oldVnode);
                  }
                  /* 该vnode的DOM */
                  var oldEl = oldVnode.elm;
                  /* 该vnode的parent DOM */
                  var parentEl = domApi.parentNode(oldEl);
                  /* 更新vnode */
                  createElm(vnode, parentEl, domApi.nextSibling(oldEl));
                  /* 删除oldvnode生成的DOM */
                  if (parentEl) {
                      removeVNodes([oldVnode], 0, 0);
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
  /********  others helper ********/
  var callPatchHook = function (context, hook) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) {
          args[_i - 2] = arguments[_i];
      }
      if (Array.isArray(context)) {
          context.forEach(function (ctx) {
              callPatchHook.apply(void 0, __spreadArrays([ctx, hook], args));
          });
      }
      else {
          var fn = context[hook];
          if (Array.isArray(fn)) {
              fn.forEach(function (f) {
                  isFunction(f) && f.apply(void 0, args);
              });
          }
          else if (isFunction(fn)) {
              fn.apply(void 0, args);
          }
      }
  };
  var isTextInputType = function (type) { return ['text', 'number', 'password', 'search', 'email', 'tel', 'url '].indexOf(type) > -1; };
  function isPatchable(vnode) {
      return vnode.tag;
  }
  function createKeyToOldIdx(children, beginIdx, endIdx) {
      var _a;
      var map = {};
      for (var i = beginIdx; i <= endIdx; ++i) {
          var key = (_a = children[i]) === null || _a === void 0 ? void 0 : _a.key;
          if (key !== undefined) {
              map[key] = i;
          }
      }
      return map;
  }

  function updateAttrs(oldVnode, vnode) {
      var _a, _b, _c, _d;
      if (!isDef((_a = oldVnode.data) === null || _a === void 0 ? void 0 : _a.attrs) && !isDef((_b = vnode.data) === null || _b === void 0 ? void 0 : _b.attrs))
          return;
      var oldAttrs = ((_c = oldVnode.data) === null || _c === void 0 ? void 0 : _c.attrs) || {};
      var attrs = ((_d = vnode.data) === null || _d === void 0 ? void 0 : _d.attrs) || {};
      var el = vnode.elm;
      if (oldAttrs === attrs)
          return;
      var key, cur, old;
      // 遍历新节点的attrs
      for (key in attrs) {
          cur = attrs[key];
          old = oldAttrs[key];
          // 如果前后两个属性值不一致，则更新为新的属性值
          if (old !== cur) {
              setAttr(el, key, cur);
          }
      }
      // 遍历旧节点的oldAttrs
      for (key in oldAttrs) {
          // 如果旧节点中的属性未在新节点中定义，则移除
          if (!isDef(attrs[key])) {
              if (!isEnumeratedAttr(key)) {
                  el.removeAttribute(key);
              }
          }
      }
  }
  var attrs = {
      create: updateAttrs,
      update: updateAttrs
  };
  /********** attribute helper  **********/
  function setAttr(el, key, value) {
      if (el.tagName.indexOf('-') > -1) {
          baseSetAttr(el, key, value);
      }
      else if (isBooleanAttr(key)) {
          if (isFalsyAttrValue(value)) {
              el.removeAttribute(key);
          }
          else {
              value = key === 'allowfullscreen' && el.tagName === 'EMBED'
                  ? 'true'
                  : key;
              el.setAttribute(key, value);
          }
      }
      else if (isEnumeratedAttr(key)) {
          el.setAttribute(key, convertEnumeratedValue(key, value));
      }
      else {
          baseSetAttr(el, key, value);
      }
  }
  function baseSetAttr(el, key, value) {
      if (isFalsyAttrValue(value)) {
          el.removeAttribute(key);
      }
      else {
          el.setAttribute(key, value);
      }
  }
  /********* ********/
  var isBooleanAttr = function (key) { return [
      'allowfullscreen', 'async', 'autofocus',
      'autoplay', 'checked', 'compact',
      'controls', 'declare', 'default',
      'defaultchecked', 'defaultmuted', 'defaultselected',
      'defer', 'disabled', 'enabled',
      'formnovalidate', 'hidden', 'indeterminate',
      'inert', 'ismap', 'itemscope',
      'loop', 'multiple', 'muted',
      'nohref', 'noresize', 'noshade',
      'novalidate', 'nowrap', 'open',
      'pauseonexit', 'readonly', 'required',
      'reversed', 'scoped', 'seamless',
      'selected', 'sortable', 'translate',
      'truespeed', 'typemustmatch', 'visible'
  ].indexOf(key) > -1; };
  var isFalsyAttrValue = function (val) { return val === false || !isDef(val); };
  var isEnumeratedAttr = function (a) { return ['contenteditable', 'draggable', 'spellcheck'].indexOf(a) > -1; };
  var isValidContentEditableValue = function (a) { return ['events', 'caret', 'typing', 'plaintext-only'].indexOf(a) > -1; };
  var convertEnumeratedValue = function (key, value) {
      return isFalsyAttrValue(value) || value === 'false'
          ? 'false'
          : key === 'contenteditable' && isValidContentEditableValue(value)
              ? value
              : 'true';
  };

  function updateClass(oldVnode, vnode) {
      var el = vnode.elm;
      var data = vnode.data;
      var oldData = oldVnode.data;
      if (!isDef(data.class) && (!isDef(oldData) || (!isDef(oldData.class)))) {
          return;
      }
      var cls = stringifyClass(data.class);
      el.setAttribute('class', cls);
  }
  var clz = {
      create: updateClass,
      update: updateClass
  };
  /********  class helper ********/
  function stringifyClass(value) {
      if (Array.isArray(value)) {
          return stringifyArray(value);
      }
      if (isObject(value)) {
          return stringifyObject(value);
      }
      if (typeof value === 'string') {
          return value;
      }
      return '';
  }
  function stringifyArray(value) {
      var res = '';
      var stringified;
      for (var i = 0, l = value.length; i < l; i++) {
          if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
              if (res)
                  res += ' ';
              res += stringified;
          }
      }
      return res;
  }
  function stringifyObject(value) {
      var res = '';
      for (var key in value) {
          if (value[key]) {
              if (res)
                  res += ' ';
              res += key;
          }
      }
      return res;
  }

  function updateEventListeners(oldVnode, vnode) {
      var _a, _b, _c;
      if (!oldVnode && !vnode)
          return;
      if (!isDef(oldVnode.data.on) && !isDef((_a = vnode.data) === null || _a === void 0 ? void 0 : _a.on))
          return;
      var oldOn = ((_b = oldVnode.data) === null || _b === void 0 ? void 0 : _b.on) || {};
      var on = ((_c = vnode.data) === null || _c === void 0 ? void 0 : _c.on) || {};
      var oldElm = oldVnode.elm;
      var elm = vnode.elm;
      var name, listener;
      if (!on) {
          for (name in oldOn) {
              listener = oldOn[name];
              oldElm.removeEventListener(name, listener, false);
          }
      }
      else { // 存在新的事件监听器对象
          for (name in on) { // 添加监听器，存在于on但是不存在与oldOn
              if (!oldOn[name]) {
                  listener = on[name];
                  elm.addEventListener(name, listener, false);
              }
          }
          for (name in oldOn) { // 移除oldOn上不存在于on上的监听器
              listener = oldOn[name];
              if (!on[name]) {
                  oldElm.removeEventListener(name, listener, false);
              }
          }
      }
  }
  var events = {
      create: updateEventListeners,
      update: updateEventListeners,
      destroy: updateEventListeners
  };

  function updateStyle(oldVnode, vnode) {
      var data = vnode.data;
      var oldData = oldVnode.data;
      var oldStyle = oldData.normalizedStyle || {};
      if (!isDef(data.style) && !isDef(oldData.style))
          return;
      var el = vnode.elm;
      var newStyle = normalizeStyleBinding(vnode.data.style) || {};
      /* 记录之前的style */
      vnode.data.normalizedStyle = newStyle;
      var name, cur;
      for (name in oldStyle) {
          if (!isDef(newStyle[name])) {
              setProp(el, name, '');
          }
      }
      for (name in newStyle) {
          cur = newStyle[name];
          if (cur !== oldStyle[name]) {
              setProp(el, name, cur == null ? '' : cur);
          }
      }
  }
  var styles = {
      create: updateStyle,
      update: updateStyle
  };
  /*******  style helper *******/
  var cssVarRE = /^--/;
  var importantRE = /\s*!important$/;
  var setProp = function (el, name, val) {
      /* istanbul ignore if */
      if (cssVarRE.test(name)) {
          el.style.setProperty(name, val);
      }
      else if (importantRE.test(val)) {
          el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
      }
      else {
          var normalizedName = normalize(name);
          if (Array.isArray(val)) {
              for (var i = 0, len = val.length; i < len; i++) {
                  el.style[normalizedName] = val[i];
              }
          }
          else {
              el.style[normalizedName] = val;
          }
      }
  };
  var vendorNames = ['Webkit', 'Moz', 'ms'];
  var emptyStyle;
  var normalize = cached(function (prop) {
      emptyStyle = emptyStyle || document.createElement('div').style;
      prop = camelize(prop);
      if (prop !== 'filter' && (prop in emptyStyle)) {
          return prop;
      }
      var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
      for (var i = 0; i < vendorNames.length; i++) {
          var name = vendorNames[i] + capName;
          if (name in emptyStyle) {
              return name;
          }
      }
  });
  function normalizeStyleBinding(bindingStyle) {
      if (Array.isArray(bindingStyle)) {
          return toObject(bindingStyle);
      }
      if (typeof bindingStyle === 'string') {
          return parseStyleText(bindingStyle);
      }
      return bindingStyle;
  }
  var parseStyleText = function (cssText) {
      var res = {};
      var listDelimiter = /;(?![^(]*\))/g;
      var propertyDelimiter = /:(.+)/;
      cssText.split(listDelimiter).forEach(function (item) {
          if (item) {
              var tmp = item.split(propertyDelimiter);
              tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
          }
      });
      return res;
  };

  var modules = [
      attrs,
      clz,
      events,
      styles
  ];

  var patch = generatePatch(__spreadArrays(modules));

  function initExtend(Vue) {
      Vue.cid = 0;
      var cid = 1;
      Vue.extend = function (extendOptions) {
          if (extendOptions === void 0) { extendOptions = {}; }
          var Super = this;
          var name = extendOptions.name || Super.options.name;
          var Sub = extendClass(Super, Super.prototype, function (key) {
              return __spreadArrays(['extend', 'mixin', 'use'], ASSET_TYPES).indexOf(key) > -1;
          });
          Sub.super = Super;
          Sub.cid = ++cid;
          Sub.options = mergeOptions(Super.options || {}, extendOptions);
          Sub.superOptions = Super.options;
          Sub.extendOptions = extendOptions;
          return Sub;
      };
  }
  /* helper */
  var defaultValidatePropKeyFn = function (val) { return true; };
  function extendClass(Super, proto, some, before) {
      if (some === void 0) { some = defaultValidatePropKeyFn; }
      function VueComponent() {
          typeof before === 'function' && before.bind(this)();
          if (proto && proto.constructor) {
              return proto.constructor.apply(this, arguments);
          }
          else {
              return Super.apply(this, arguments);
          }
      }
      VueComponent.prototype = Object.create(Super.prototype);
      VueComponent.prototype.constructor = VueComponent;
      if (proto) {
          for (var key in proto) {
              if (hasOwn(proto, key)) {
                  if (some(key)) {
                      VueComponent.prototype[key] = proto[key];
                  }
              }
          }
      }
      return VueComponent;
  }

  function initAssetRegisters(Vue) {
      ASSET_TYPES.forEach(function (type) {
          Vue[type] = function (id, definition) {
              if (!definition)
                  return this.options[type + 's'][id];
              if ( type === 'component') {
                  validateComponentName(id);
              }
              if (type === 'component' && isPlainObject(definition)) {
                  definition.name = definition.name || id;
                  definition = this.options._base.extend(definition);
              }
              if (type === 'directive' && typeof definition === 'function') {
                  definition = { bind: definition, update: definition };
              }
              this.options[type + 's'][id] = definition;
              return definition;
          };
      });
  }

  function initGlobalAPI(Vue) {
      Vue.options = Object.create(null);
      ASSET_TYPES.forEach(function (type) {
          Vue.options[type + 's'] = Object.create(null);
      });
      Vue.options._base = Vue;
      initExtend(Vue);
      initAssetRegisters(Vue);
  }

  function createElement$1(context, tag, data, children) {
      /* 没有传入data */
      if (Array.isArray(data) || isPrimitive(data)) {
          children = data;
          data = undefined;
      }
      if (!tag)
          return createTextVNode();
      children = normalizeChildren(children);
      var vnode;
      if (typeof tag === 'string') {
          if (isHTMLTag(tag)) {
              vnode = new VNode({
                  context: context,
                  tag: tag,
                  data: data,
                  children: children
              });
          }
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
   * 省略了合并相邻文本节点的过程
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

  var sharedPropertyDefinition = {
      enumerable: true,
      configurable: true,
      get: noop,
      set: noop
  };
  /**
   * 在target上设置一个代理，实现通过访问target.key来访问target.sourceKey.key的目的
   */
  function proxy(target, sourceKey, key) {
      sharedPropertyDefinition.get = function proxyGetter() {
          return this[sourceKey][key];
      };
      sharedPropertyDefinition.set = function proxySetter(val) {
          this[sourceKey][key] = val;
      };
      Object.defineProperty(target, key, sharedPropertyDefinition);
  }
  /*****  data  *****/
  function getData(data, vm) {
      pushTarget();
      try {
          return data.call(vm, vm);
      }
      catch (e) {
          console.error(e);
          return {};
      }
      finally {
          popTarget();
      }
  }
  /******** Computed ********/
  function defineComputed(target, key, userDef) {
      // 默认computed应该缓存
      if (typeof userDef === 'function') {
          sharedPropertyDefinition.get = createComputedGetter(key);
          sharedPropertyDefinition.set = noop;
      }
      else {
          sharedPropertyDefinition.get = userDef.get ?
              userDef.cache !== false
                  ? createComputedGetter(key)
                  : createGetterInvoker(userDef.get) // 绑定getter的作用域?
              : noop;
          sharedPropertyDefinition.set = userDef.set || noop;
      }
      Object.defineProperty(target, key, sharedPropertyDefinition);
  }
  function createComputedGetter(key) {
      return function computedGetter() {
          var watcher = this._computedWatchers && this._computedWatchers[key];
          if (watcher) {
              /**
               * 脏检测，在计算属性中的依赖发生变化时，dirty会变为true，
               * 在get的时候重新计算计算属性的输出值
               */
              if (watcher.dirty) {
                  watcher.evaluate();
              }
              /** 收集依赖 */
              if (Dep.target) {
                  watcher.depend();
              }
              return watcher.value;
          }
      };
  }
  function createGetterInvoker(fn) {
      return function computedGetter() {
          return fn.call(this, this);
      };
  }
  /******** Watcher ********/
  function createWatcher(vm, expOrFn, handler, options) {
      /**
         watch: {
            name: {
              handler() {},
              deep: true
            }
        }
       */
      if (isPlainObject(handler)) {
          handler = handler.handler;
      }
      /** 传入的是一个字符串，则从实例中调用该属性 */
      if (typeof handler === 'string') {
          handler = vm[handler];
      }
      // return vm.$watch && vm.$watch(expOrFn, handler, options)
  }

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);
  var methodsToPatch = [
      'push',
      'pop',
      'shift',
      'unshift',
      'splice',
      'sort',
      'reverse'
  ];
  methodsToPatch.forEach(function (method) {
      def(arrayMethods, method, function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          var result = arrayMethods[method].apply(this, args);
          // 获取到Observer实例
          var ob = this.__ob__;
          var inserted;
          // 对于新增的内容也要进行响应式转换，否则会出现修改数据时无法触发消息的问题
          switch (method) {
              case 'push':
              case 'unshift':
                  inserted = args;
                  break;
              case 'splice':
                  inserted = args.slice(2);
                  break;
          }
          if (inserted)
              ob.observeArray(inserted);
          ob.dep.notify(); // 数组改变之后，向依赖发送消息
          return result;
      });
  });

  var Observer = /** @class */ (function () {
      function Observer(value) {
          this.value = value;
          this.dep = new Dep();
          def(value, '__ob__', this);
          if (Array.isArray(value)) {
              value.__proto__ = arrayMethods;
              this.observeArray(value);
          }
          else {
              this.walk(value);
          }
      }
      Observer.prototype.walk = function (obj) {
          Object.keys(obj).forEach(function (key) {
              defineReactive(obj, key);
          });
      };
      Observer.prototype.observeArray = function (items) {
          items.forEach(function (item) {
              observe(item);
          });
      };
      return Observer;
  }());
  function observe(value) {
      if (!isObject(value))
          return;
      var ob;
      if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
          ob = value.__ob__;
      }
      else if ((Array.isArray(value) || isPlainObject(value)) &&
          Object.isExtensible(value)) {
          ob = new Observer(value);
      }
      return ob;
  }
  function defineReactive(obj, key, val, customSetter, shallow // 如果设置为true，则不会对val进行响应式处理，即只对obj的key属性的值响应式处理
  ) {
      var dep = new Dep();
      var property = Object.getOwnPropertyDescriptor(obj, key);
      if (property && property.configurable === false) {
          return;
      }
      var getter = property && property.get;
      var setter = property && property.set;
      val = val ? val : obj[key];
      var childOb = !shallow && observe(val);
      Object.defineProperty(obj, key, {
          enumerable: true,
          configurable: true,
          get: function reactiveGetter() {
              var value = getter ? getter.call(obj) : val;
              /**
               * Dep.target存放的是该对象(obj)的监听者，如果没有被监听，就不需要进行订阅
               * 所谓订阅就是将Dep实例存入Watcher实例的deps中
               */
              if (Dep.target) {
                  dep.subscribe();
                  // 如果子属性也被设置为响应式数据了, 将子属性的Watcher收集到Dep中
                  if (childOb) {
                      childOb.dep.subscribe();
                      if (Array.isArray(value)) {
                          dependArray(value);
                      }
                  }
              }
              return value;
          },
          set: function reactiveSetter(newVal) {
              var value = getter ? getter.call(obj) : val;
              if (newVal === value || (newVal !== newVal && value !== value)) {
                  return;
              }
              if ( customSetter) {
                  customSetter();
              }
              if (getter && !setter)
                  return;
              if (setter) {
                  setter.call(obj, newVal);
              }
              else {
                  val = newVal;
              }
              childOb = !shallow && observe(newVal);
              // 依赖变化后，触发更新，通知Dep类调用notify来触发所有Watcher对象的update方法更新对应视图
              dep.notify();
          }
      });
  }
  function dependArray(values) {
      values.forEach(function (value) {
          if (isObservable(value)) {
              value.__ob__.dep.depend();
          }
          if (Array.isArray(value))
              dependArray(value);
      });
  }
  /*  helper */
  function isObservable(value) {
      if (value && value.__ob__) {
          return true;
      }
      return false;
  }

  /*  init  */
  function init(vm) {
      initLifecycle(vm);
      initRender(vm);
      initEvents(vm);
      initState(vm);
  }
  function initLifecycle(vm) {
      var options = vm.$options;
      vm.$children = [];
      vm._isMounted = false;
      vm._isDestroyed = false;
      vm._isBeingDestroyed = false;
  }
  function initRender(vm) {
      vm._vnode = null;
      vm.$createElement = function (a, b, c) { return createElement$1(vm, a, b, c); };
  }
  function initEvents(vm) {
      vm._events = Object.create(null);
  }
  function initState(vm) {
      vm._watchers = [];
      var options = vm.$options;
      if (options.props)
          initProps(vm, options.props);
      options.methods && initMethods(vm, options.methods);
      if (options.data) {
          initData(vm);
      }
      else {
          observe(vm._data = {});
      }
      options.computed && initComputed(vm, options.computed);
      options.watch && initWatcher(vm, options.watch);
  }
  function initProps(vm, propsOptions) {
      /* propsData保存的是通过父组件或用户传递的真实props数据 */
      var propsData = vm.$options.propsData || {};
      var props = vm._props = {};
      /* 缓存当前实例的所有props的key */
      var keys = vm.$options._propKeys = [];
      /* 没有父节点则表示是根节点 */
      var isRoot = !vm.$parent;
      var _loop_1 = function (key) {
          keys.push(key);
          // TODO 校验props【validateProp(key, propsOptions, propsData, vm)】
          var value = propsOptions[key];
          {
              var hyphenatedKey = hyphenate(key);
              /* 是否是保留字段 */
              if (isReservedAttribute(hyphenatedKey) || isHTMLTag(hyphenatedKey)) {
                  warn("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop.", vm);
              }
              defineReactive(props, key, value, function () {
                  if (!isRoot) {
                      /* 由于父组件重新渲染的时候会重写prop的值，所以应该直接使用prop来作为一个data或者计算属性的依赖 */
                      warn("Avoid mutating a prop directly since the value will be " +
                          "overwritten whenever the parent component re-renders. " +
                          "Instead, use a data or computed property based on the prop's " +
                          ("value. Prop being mutated: \"" + key + "\""), vm);
                  }
              });
          }
          if (!(key in vm)) {
              // 访问vm[key] 等同于 访问vm._props[key]
              proxy(vm, '_props', key);
          }
      };
      for (var key in propsOptions) {
          _loop_1(key);
      }
  }
  function initData(vm) {
      var data = vm.$options.data;
      data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};
      if (!isPlainObject(data)) {
          data = {};
           warn('data functions should return an object:\n' +
              'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
      }
      var keys = Object.keys(data);
      var props = vm.$options.props;
      var methods = vm.$options.methods;
      var i = keys.length;
      while (i--) {
          var key = keys[i];
          {
              /* 保证data中的key不与props中的key重复，props优先 */
              if (methods && hasOwn(methods, key)) {
                  warn("Method \"" + key + "\" has already been defined as a data property.", vm);
              }
          }
          // 如果props有与data同名的方法，给出警告
          if (props && hasOwn(props, key)) {
               warn("The data property \"" + key + "\" is already declared as a prop. " +
                  "Use prop default value instead.", vm);
          }
          else if (!isReserved(key)) { // 不是保留字段
              /* 将data的属性代理到vm实例上 */
              proxy(vm, "_data", key);
          }
      }
      observe(data);
  }
  var computedWatcherOptions = { lazy: true };
  function initComputed(vm, computed) {
      var watchers = vm._computedWatchers = Object.create(null);
      for (var key in computed) {
          var userDef = computed[key];
          /** computed可能是一个function也可能是getter + setter */
          var getter = typeof userDef === 'function' ? userDef : userDef.get;
          if ( !isDef(getter)) {
              warn("Getter is missing for computed property \"" + key + "\".", vm);
          }
          /**
           * 为计算属性创建一个内部的监视器Watcher，保存在vm实例的_computedWatchers
           * 这里的computedWatcherOptions参数传递了一个lazy为true，会使得watch实例的dirty为true
           * */
          watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
          /**
           * 组件正在定义的计算属性已经定义在现有组件的原型上则不会进行重复定义
           * */
          if (!(key in vm)) {
              defineComputed(vm, key, userDef);
          }
          else {
              /** 与data或props发生命名冲突 */
              if (key in vm.$data) {
                  warn("The computed property \"" + key + "\" is already defined in data.", vm);
              }
              else if (vm.$options.props && key in vm.$options.props) {
                  warn("The computed property \"" + key + "\" is already defined as a prop.", vm);
              }
          }
      }
  }
  function initMethods(vm, methods) {
      var props = vm.$options.props;
      for (var key in methods) {
          {
              /* method不是一个function */
              if (typeof methods[key] !== 'function') {
                  warn("Method \"" + key + "\" has type \"" + typeof methods[key] + "\" in the component definition. " +
                      "Did you reference the function correctly?", vm);
              }
              /* 与props发生命名冲突 */
              if (props && hasOwn(props, key)) {
                  warn("Method \"" + key + "\" has already been defined as a prop.", vm);
              }
              /* 方法名不符合规范 */
              if ((key in vm) && isReserved(key)) {
                  warn("Method \"" + key + "\" conflicts with an existing Vue instance method. " +
                      "Avoid defining component methods that start with _ or $.");
              }
          }
          /**
           * 因为方法在Vue示例中通过this调用
           * 所以方法的作用域绑定到vm实例
           * */
          vm[key] = typeof methods[key] !== 'function' ? noop : Function.prototype.bind.call(methods[key], vm);
      }
  }
  function initWatcher(vm, watch) {
      for (var key in watch) {
          var handler = watch[key];
          if (Array.isArray(handler)) {
              for (var i = 0; i < handler.length; i++) {
                  createWatcher(vm, key, handler[i]);
              }
          }
          else {
              createWatcher(vm, key, handler);
          }
      }
  }

  var uid$2 = 0;
  var Vue = /** @class */ (function () {
      function Vue(options) {
          this.__patch__ = patch;
          this._init(options);
      }
      Vue.prototype._init = function (options) {
          if (options === void 0) { options = {}; }
          var vm = this;
          vm._uid = ++uid$2;
          vm._self = vm;
          vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor) || {}, options, vm);
          init(vm);
      };
      Vue.prototype._render = function () {
          var vm = this;
          var render = vm.$options.render;
          var vnode = render.call(vm, vm.$createElement);
          if (Array.isArray(vnode) && vnode.length === 1) {
              vnode = vnode[0];
          }
          return vnode;
      };
      Vue.prototype._update = function (vnode, hydrating) {
          var vm = this;
          var prevVnode = vm._vnode;
          /** _vnode表示当前DOM所表示的VNode */
          vm._vnode = vnode;
          if (!prevVnode) {
              // initial render
              vm.$el = vm.__patch__(vm.$el, vnode);
          }
          else {
              // updates
              vm.$el = vm.__patch__(prevVnode, vnode);
          }
      };
      Vue.prototype.$mount = function (el, hydrating) {
          var vm = this;
          el = el && inBrowser ? query(el) : undefined;
          if (el === document.body || el === document.documentElement) {
               warn("Do not mount Vue to <html> or <body> - mount to normal elements instead.");
              return this;
          }
          vm.$el = el;
          var updateComponent = function () {
              vm._update(vm._render(), hydrating);
          };
          new Watcher(vm, updateComponent, noop);
          vm._isMounted = true;
      };
      Vue.prototype.$watch = function (expOrFn, cb, options) {
          var vm = this;
          options = options || {};
          options.user = true;
          var watcher = new Watcher(vm, expOrFn, cb, options);
          if (options.immediate) {
              try {
                  cb.call(vm, watcher.value);
              }
              catch (e) {
                  console.error("callback for immediate watcher \"" + watcher.expression + "\"", e);
              }
          }
          return function unwatchFn() {
              watcher.teardown();
          };
      };
      return Vue;
  }());
  /* 初始化全局API */
  initGlobalAPI(Vue);

  var Comp = Vue.component('hello-text', {
      data: function () {
          return {
              text: 'hello'
          };
      },
      render: function (h) {
          var text = this.text;
          return (h('span', text));
      }
  });
  var vm = new Comp();
  vm.$mount('#app');
  console.log(vm);

}());
