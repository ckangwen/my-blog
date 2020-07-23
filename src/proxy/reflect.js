const obj = {
  get foo() {
    return this.bar;
  },
  bar: "bar"
};

const handler = {
  get(target, key, receiver) {
    if (key === "bar") return "...";
    console.log("Reflect.get", Reflect.get(target, key, receiver));
    console.log("target[key]", target[key]);
  }
};

const res = new Proxy(obj, handler);
// console.log('res.bar', res.bar);
console.log('res.foo', res.foo);
