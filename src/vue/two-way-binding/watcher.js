import Dep from "./dep.js";
import { isBrowser } from "./utils";

export default class Watcher {
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
