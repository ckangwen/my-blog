---
title: Proxy与Reflect
date: 2020-07-23
categories:
  - JavaScript
tags:
  - JavaScript
---



## Proxy

Proxy用于修改某些操作的默认行为。它提供了一个对外界的访问进行过滤和改写的机制。

- 拦截和监视外部对对象的访问
- 降低函数或类的复杂度
- 在复杂操作前对操作进行校验或对所需资源进行管理

<br/>

**语法**

```javascript
new Proxy(target, handler)
```

- target：被代理的对象
- handler：声明了各类代理操作的对象，最终返回一个代理对象

外界每次通过代理对象访问 `target` 对象的属性时，就会经过 `handler` 对象。

<br/>

**支持的拦截操作**

- get
- set
- has
- deleteProperty
- ownKeys
- getOwnPropertyDescriptor
- defineProperty
- preventExtensions
- getPrototypeOf
- isExtensible
- setPrototypeOf
- apply
- construct

<br/>

Proxy 对象还提供了一个 `revocable` 方法，方法返回一个可取消的 Proxy 实例。

```javascript
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123
// revoke属性是一个函数，可以取消Proxy实例
revoke();
proxy.foo // TypeError: Revoked
```



### this问题

虽然 Proxy 可以代理针对目标对象的访问，但它不是目标对象的透明代理，即不做任何拦截的情况下，也无法保证与目标对象的行为一致。主要原因就是在 Proxy 代理的情况下，目标对象内部的`this`关键字会指向 Proxy 代理。

```javascript
const target = {
  m: function () {
    console.log(this === proxy);
  }
};
const handler = {};

const proxy = new Proxy(target, handler);

target.m() // false
proxy.m()  // true
```

上面代码中，一旦`proxy`代理`target.m`，后者内部的`this`就是指向`proxy`，而不是`target`。

下面是一个例子，由于`this`指向的变化，导致 Proxy 无法代理目标对象。

```javascript
const _name = new WeakMap();

class Person {
  constructor(name) {
    _name.set(this, name);
  }
  get name() {
    return _name.get(this);
  }
}

const jane = new Person('Jane');
jane.name // 'Jane'

const proxy = new Proxy(jane, {});
proxy.name // undefined
```

上面代码中，目标对象`jane`的`name`属性，实际保存在外部`WeakMap`对象`_name`上面，通过`this`键区分。由于通过`proxy.name`访问时，`this`指向`proxy`，导致无法取到值，所以返回`undefined`。

此外，有些原生对象的内部属性，只有通过正确的`this`才能拿到，所以 Proxy 也无法代理这些原生对象的属性。

```javascript
const target = new Date();
const handler = {};
const proxy = new Proxy(target, handler);

proxy.getDate();
// TypeError: this is not a Date object.
```

上面代码中，`getDate()`方法只能在`Date`对象实例上面拿到，如果`this`不是`Date`对象实例就会报错。这时，`this`绑定原始对象，就可以解决这个问题。

```javascript
const target = new Date('2015-01-01');
const handler = {
  get(target, prop) {
    if (prop === 'getDate') {
      return target.getDate.bind(target);
    }
    return Reflect.get(target, prop);
  }
};
const proxy = new Proxy(target, handler);

proxy.getDate() // 1
```



<br/>

### Object.defineProperty和Proxy的区别

Object.defineProperty

- 不能监听到数组length属性的变化；
- 不能监听对象的添加；
- 只能劫持对象的属性,因此我们需要对每个对象的每个属性进行遍历。

Proxy

- 可以监听数组length属性的变化；
- 可以监听对象的添加；
- 可代理整个对象，不需要对对象进行遍历，极大提高性能；
- 多达13种的拦截远超Object.defineProperty只有get和set两种拦截。



## Reflect

`Reflect`对象的设计目的有这样几个

1. 修改某些`Object`方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`
2. 让`Object`操作都变成函数行为。某些`Object`操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为
3. `Reflect`对象的方法与`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。这就让`Proxy`对象可以方便地调用对应的`Reflect`方法，完成默认行为，作为修改行为的基础。也就是说，不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取默认行为。

`Reflect`对象一共有 13 个静态方法，与Proxy对象的拦截操作一一对应





### Proxy 实现观察者模式

```javascript
const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queuedObservers.forEach(observer => observer());
  return result;
}

const person = observable({
  name: '张三',
  age: 20
});

function print() {
  console.log(`${person.name}, ${person.age}`)
}

observe(print);
person.name = '李四';
```

