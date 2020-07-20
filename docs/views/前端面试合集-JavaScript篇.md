---
title: 前端面试合集-JavaScript篇
date: 2020-07-19
categories:
  - 其他
tags:
  - 面试
---

### 闭包

闭包是指有权访问另一个函数作用域中变量的函数，创建闭包最常见的方式就是在一个函数内创建另一个函数，通过另一个函数访问这个函数的局部变量，利用闭包可以突破作用域链。

**特性**

- 函数内再嵌套函数
- 内部函数可以引用外层的参数和变量
- 参数和变量不会被垃圾回收机制回收

**理解**

使用闭包主要是为了设计私有的方法和变量。闭包的优点是可以避免全局变量的污染，缺点是闭包会常驻内存，会增加内存的使用量，使用不当会造成内存泄漏。



### 说说对作用域的理解

- 作用域链的作用是保证执行环境里有权访问的变量和函数是有序的，作用域链的变量只能向上访问，变量访问到window对象为止，作用域链向下访问变量是不被允许的
- 作用域链就是变量与函数的可访问范围，即作用域控制着变量与函数的可见性和生命周期



### JavaScript原型，原型链 ? 有什么特点？

- 每个对象都会在内部初始化一个属性，这就是`prototype`，当我们一个对象的属性时，如果该对象内部不存在该属性，那么就会去`prototype`中查找这个属性。这个`prototype`又会有自己的`prototype`，于是就会一致找下去，直到`prototype`为null
- `instance.constructor.rprototype = instance.__proto__`



### 如何实现继承

**原型链继承**

```js
function Cat(){ }
Cat.prototype = new Animal();
Cat.prototype.name = 'cat';
```

- 特点：基于原型链，既是父类的实例，也是子类的实例
- 缺点：无法实现多继承



**构造继承**

使用父类的构造函数来增强子类实例，相当于复制父类的实例属性给子类

```js
function Cat(name){
  Animal.call(this);
  this.name = name || 'Tom';
}
```

- 特点：可以实现多继承
- 缺点：只能继承父类实例的属性和方法，不能继承原型上的属性和方法。



**组合继承**

相当于构造继承和原型链继承的组合体

```js
function Cat(name){
  Animal.call(this);
  this.name = name || 'Tom';
}
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
```

- 特点：可以继承实例属性/方法，也可以继承原型属性/方法
- 缺点：调用了两次父类构造函数，生成了两份实例



**寄生组合继承**

通过寄生方式，砍掉父类的实例属性，这样，在调用两次父类的构造的时候，就不会初始化两次实例方法/属性

```js
function Cat(name){
  Animal.call(this);
  this.name = name || 'Tom';
}
(function(){
  // 创建一个没有实例方法的类
  var Super = function(){};
  Super.prototype = Animal.prototype;
  //将实例作为子类的原型
  Cat.prototype = new Super();
})();
```





### 事件代理

- 事件代理又被称作是事件委托，是JavaScript中常用的绑定事件的技巧。含义就是把原先需要绑定的事件委托给父元素，让父元素担当事件监听的职务。事件代理的原理是DOM元素的事件冒泡。使用事件代理的好处是可以提高性能
- 可以减少事件注册，比如在`table`上代理所有`td`的`click`事件
- 可以实现当新增子对象时无需再次对其绑定



### 前端中的事件流

HTML与JavaScript的交互是通过事件驱动来实现的，可以向文档或者文档中的元素添加事件监听器来预订事件。

事件流描述的是从页面中接收事件的顺序。DOM2级事件流包括以下几个阶段

- 事件捕获阶段
- 处于目标阶段
- 事件冒泡阶段



### new操作符具体干了什么

- 创建一个空对象，并且this变量引用该对象，同时还继承了该函数的原型
- 属性和方法被加入到this引用的对象中
- 新创建的对象由 `this` 所引用，并且最后隐式的返回 `this`



### null与undefined的区别

`null`表示不存在这个值

`undefined`表示是“无”的原始值或是表示此处应该有一个值，但是还没有定义。例如变量被声明了，但没有赋值时，就等于`undefined`



### use strict的含义

`use strict`表示严格模式，这种模式使`JS`编码更加规范化，消除`Javascript`语法的一些不合理、不严谨之处

**严格模式下的变化**

- 将过失错误转成异常
  - 严格模式下无法再意外创建全局变量
  - 严格模式会使引起静默失败的赋值操作抛出异常(给不可扩展对象的新属性赋值) 都会抛出异常)
  - 试图删除不可删除的属性时会抛出异常(`delete Object.prototype;`将会抛出TypeError错误)
  - 严格模式要求一个对象内的所有属性名在对象内必须唯一
  - 严格模式要求函数的参数名唯一
  - 严格模式禁止八进制数字语法.
  - ECMAScript 6中的严格模式禁止设置原生数据(`primitive`)的属性

- 简化变量的使用

  -  严格模式禁用 `with`

    `with`所引起的问题是块内的任何名称可以映射(map)到with传进来的对象的属性, 也可以映射到包围这个块的作用域内的变量(甚至是全局变量), 这一切都是在运行时决定的: 在代码运行之前是无法得知的. 

  - 严格模式下不再为保卫eval代码块的范围引入新的变量

  - 严格模式禁止删除声明变量。`delete name` 在严格模式下会引起语法错误

- 让`eval`和`arguments`变的简单

  - 名称 `eval` 和 `arguments` 不能通过程序语法被绑定(be bound)或赋值
  - 严格模式下，参数的值不会随 arguments 对象的值的改变而变化
  - 不再支持 `arguments.callee`

- 为未来的ECMAScript版本铺平道路

  - 严格模式中一部分字符变成了保留的关键字。这些字符包括`implements`, `interface`, `let`, `package`, `private`, `protected`, `public`, `static`和`yield`。



### JavaScript延时加载的方式

js延迟加载就是在页面加载完成之后再加载JavaScript文件，这样有利于提高页面的加载速度

- defer

  告诉浏览器**立即下载，但延迟执行**，脚本会被延迟到整个页面都解析完毕之后再执行。

  及时将`script`放在`head`元素之后，只要设置defer属性，该JavaScript文件将延迟浏览器遇到`</html>`标签后再执行。

  defer属性**只适用于外部脚本文件**。支持 HTML5 的实现会忽略嵌入脚本设置的defer属性

- async

  async功能与和defer一致，不会阻塞其他资源下载，不会影响页面的加载

  **只适用于外部脚本文件**

  异步脚本一定会在页面 load 事件前执行，但是不能保证文件加载的顺序

- 动态创建DOM引入

  ```js
  <script type="text/javascript">  
     function downloadJSAtOnload() {  
         varelement = document.createElement("script");  
         element.src = "defer.js";  
         document.body.appendChild(element);  
     }  
     if (window.addEventListener)  
        window.addEventListener("load",downloadJSAtOnload, false);  
     else if (window.attachEvent)  
        window.attachEvent("onload",downloadJSAtOnload);  
     else 
        window.onload =downloadJSAtOnload;  
  </script>  
  ```

- 使用`setTimeout`延迟方法
- 让js最后载入



### 同步与异步的区别

- 同步：浏览器访问服务器请求，用户看得到页面刷新，重新发请求,等请求完，页面刷新，新内容出现，用户看到新内容,进行下一步操作
- 异步：浏览器访问服务器请求，用户正常操作，浏览器后端进行请求。等请求完，页面不刷新，新内容也会出现，用户看到新内容



### attribute和property的区别是什么？

- `attribute`是`dom`元素在文档中作为`html`标签拥有的属性；
- `property`就是`dom`元素在`js`中作为对象拥有的属性。



### 谈谈你对ES6的理解

- 新增模板字符串（为`JavaScript`提供了简单的字符串插值功能）
- 箭头函数
- `for-of`（用来遍历数据—例如数组中的值。）
- `arguments`对象可被不定参数和默认参数完美代替。
- `ES6`将`promise`对象纳入规范，提供了原生的`Promise`对象。
- 增加了`let`和`const`命令，用来声明变量。
- 增加了块级作用域。
- `let`命令实际上就增加了块级作用域。
- 还有就是引入`module`模块的概念