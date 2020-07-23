const obj = {
  a: 1,
  b: 2
};

const p = new Proxy(obj, {
  get(target, key, receiver) {
    if (key === "c") {
      console.log(4,receiver)
      return "我是自定义的一个结果";
    } else {
      return target[key];
    }
  },
  set(target, key, value) {
    if (value === 4) {
      target[key] = "我是自定义的一个结果";
    } else {
      target[key] = value;
    }
  }
});

console.log(obj.a); // 1
console.log(obj.c); // undefined
console.log(p.a); // 1
console.log(p.c); // 我是自定义的一个结果
