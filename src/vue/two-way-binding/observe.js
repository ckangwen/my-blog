import Dep from './dep'

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

export default function observe(value, vm) {
  if (!value || typeof value !== "object") {
    return;
  }
  return new Observer(value);
}
