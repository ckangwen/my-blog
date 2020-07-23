var MyVue = (function () {
  'use strict';

  const isNode = node => node.nodeType === 1;

  const isTextNode = node => node.nodeType === 3;

  const isDirective = attr => attr.indexOf('v-') === 0;

  const isObject = obj =>
    Object.prototype.toString.call(obj) === '[object Object]';

  // TODO subs里有多个重复值
  class Dep {
    constructor() {
      this.subs = new Set([]);
    }

    addSub(sub) {
      this.subs.add(sub);
    }
    removeSub(sub) {
      remove(this.subs, sub);
    }
    depend() {
      const target = Dep.target;
      if (target) {
        this.addSub(target);
      }
    }
    notify() {
      Array.from(this.subs).forEach(item => {
        item.update();
      });
    }
  }

  Dep.target = null;

  function remove(arr, item) {
    // if (arr.length) {
    //   const index = arr.indexOf(item);
    //   if (index > -1) {
    //     return arr.splice(index, 1);
    //   }
    // }
    if (arr.has(item)) {
      arr.delete(item);
    }
  }

  const Observer = obj => {
    const dep = new Dep();
    return new Proxy(obj, {
      get: function(target, key, receiver) {
        // 如果订阅者存在，直接添加订阅
        dep.depend();
        return Reflect.get(target, key, receiver);
      },
      set: function(target, key, value, receiver) {
        if (Reflect.get(receiver, key) === value) return;
        const res = Reflect.set(target, key, observify(value), receiver);
        dep.notify();
        return res;
      }
    });
  };

  /**
   * 将对象转为监听对象
   * @param {*} obj 要监听的对象
   */
  function observify(obj) {
    if (!isObject(obj)) {
      return obj;
    }

    // 深度监听
    Object.keys(obj).forEach(key => {
      obj[key] = observify(obj[key]);
    });

    return Observer(obj);
  }

  class Watcher {
    constructor(vm, expOrFn, cb) {
      this.vm = vm;
      // 读取expOrFn，触发了getter，这样就会收集依赖，从window中读取一个依赖并添加到Dep中
      this.getter = parsePath(expOrFn);
      this.cb = cb;
      this.value = this.get();
    }

    get() {
      Dep.target = this;
      // 将this赋值给window.target然后再读一下值，去触发getter
      // 这样就可以把this主动添加到expOrFn的Dep中
      let value = this.getter.call(this.vm, this.vm);
      Dep.target = undefined;
      return value;
    }

    update() {
      const oldVal = this.value;
      this.value = this.get();
      this.cb(this.vm, this.value, oldVal);
    }
  }

  const bailRE = /[^/w.$]/;

  /**
   * 解析路径
   * @param path
   */
  function parsePath(path) {
    if (!bailRE.test(path)) return;
    const segments = path.split(".");
    return function(obj) {
      for (let i = 0; i < segments.length; i++) {
        if (!obj) return;
        obj = obj[segments[i]];
      }
      return obj;
    };
  }

  const reg = /{{(.*)}}/;
  class Compile {
    constructor(el, vm) {
      this.el = document.querySelector(el);
      this.vm = vm;
      this.fragment = null;
      this.init();
    }

    init() {
      if (!this.el) throw new Error("element not exist");
      this.fragment = nodeToFragment(this.el);
      this.compileElement(this.fragment);
      this.el.appendChild(this.fragment);
    }

    compileElement(el) {
      const childNodes = el.childNodes;
      Array.prototype.slice.call(childNodes).forEach(node => {
        const text = node.textContent;
        if (isNode(node)) {
          const attrs = node.attributes;
          Array.prototype.forEach.call(attrs, attr => {
            const attrName = attr.name;
            if (isDirective(attrName)) {
              const exp = attr.value;
              if (attrName === "v-model") {
                const propValue = this.vm.data[exp];
                node.value = propValue;
                this.vm.$watch(`data.${exp}`, (_, val) => {
                  node.value = val;
                });

                node.addEventListener("input", e => {
                  const newValue = e.target.value;
                  if (newValue === propValue) return;

                  this.vm.data[exp] = newValue;
                });
              }
            }
          });
        } else if (isTextNode(node) && reg.test(text)) {
          const exp = (reg.exec(text)[1]).trim();
          node.textContent = this.vm.data[exp];
          this.vm.$watch(`data.${exp}`, (_, val) => {
            node.textContent = val;
          });
        }
        if (node.childNodes && node.childNodes.length) {
          this.compileElement(node);
        }
      });
    }
  }

  function nodeToFragment(el) {
    const fragment = document.createDocumentFragment();
    let firstChild;
    while ((firstChild = el.firstChild)) {
      fragment.appendChild(firstChild);
    }
    return fragment;
  }

  class MyVue {
    constructor(options) {
      const { data, methods, el } = options;
      this.data = data;
      this.el = el;

      this.data = observify(this.data);
      new Compile(this.el, this);
    }

    $watch(exp, cb) {
      return new Watcher(this, exp, cb);
    }
  }

  return MyVue;

}());
