(function () {
    'use strict';

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
            var _b = _a.tag, tag = _b === void 0 ? '' : _b, _c = _a.data, data = _c === void 0 ? {} : _c, _d = _a.children, children = _d === void 0 ? [] : _d, _e = _a.text, text = _e === void 0 ? '' : _e, elm = _a.elm;
            this.tag = tag;
            this.data = data;
            this.children = children;
            this.text = text;
            this.elm = elm;
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
    function isObject(obj) {
        return obj !== null && typeof obj === 'object';
    }
    function isNative(Ctor) {
        return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
    }
    function isFunction(obj) {
        return typeof obj === 'function';
    }

    function cached(fn) {
        var cache = Object.create(null);
        return function cachedFn(str) {
            var hit = cache[str];
            return hit || (cache[str] = fn(str));
        };
    }
    var camelizeRE = /-(\w)/g;
    var camelize = function (str) {
        return str.replace(camelizeRE, function (_, c) { return (c ? c.toUpperCase() : ''); });
    };
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
    function toObject(arr) {
        var res = {};
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                extend(res, arr[i]);
            }
        }
        return res;
    }
    var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) &&
        typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

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
                callPatchHook([cbs, dataHook], 'update');
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

    function createElement$1(tag, data, children) {
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
    var vnode = createElement$1('div', {
        class: 'hello',
        style: { color: 'red' }
    }, [
        createElement$1('p', {}, 'hello world'),
        'welcome'
    ]);
    patch(el, vnode);

}());
