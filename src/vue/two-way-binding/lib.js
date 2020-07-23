var MyVue = (function () {
  'use strict';

  const isNode = node => node.nodeType === 1;

  const isTextNode = node => node.nodeType === 3;

  const isDirective = attr => attr.indexOf('v-') === 0;

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

  class Observer {
    constructor(value) {
      this.value = value;
      if (!Array.isArray(value)) {
        this.walk(value);
      }
    }

    walk(data) {
      for (const [key] of Object.entries(data)) {
        defineReactive(data, key, data[key]);
      }
    }
  }

  /**
   * 对defineProperty进行封装，作用是定义一个响应式数据
   * 也就是在这个函数中进行追踪变化，封装后只需要传递data、key、val就行
   * 封装好之后，每当从data的key读取数据时，get函数触发；每当往data的key中设置数据时，set函数被触发
   * @param data
   * @param key
   * @param val
   * @returns {*}
   */
  function defineReactive(data, key, val) {
    let dep = new Dep();
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 收集依赖
        dep.depend();
        return val;
      },
      set(newVal) {
        if (val === newVal) return;
        data[key] = val = newVal;
        // 触发依赖更新
        dep.notify();
      }
    });
  }

  function observe(value, vm) {
    if (!value || typeof value !== "object") {
      return;
    }
    return new Observer(value);
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

      observe(this.data);
      new Compile(this.el, this);
    }

    $watch(exp, cb) {
      return new Watcher(this, exp, cb);
    }
  }

  return MyVue;

}());
