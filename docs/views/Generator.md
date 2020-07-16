---
title: Generator函数
date: 2020-07-16
categories:
  - JavaScript
tags:
  - JavaScript
---

Generator函数时ES6提供的一种异步编程的解决方案。

从语法上来说，可以把Generator函数理解为一个状态机，封装了多个内部状态。执行Generator函数会返回一个遍历器对象。



形式上，Generator函数是一个普通函数，但是有两个特征。一是，`function`关键字与函数名之间有一个星号；二是，函数体内部使用`yield`语句。





```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

const hw = helloWorldGenerator();
// Object [Generator] {}
console.log(hw);

let val
// 当迭代器的值为 { value: undefined, done: true } 时终止遍历
while ((val = hw.next()).value !== undefined) {
// { value: 'hello', done: false }
// { value: 'world', done: false }
// { value: 'ending', done: true }
  console.log(val)
}

```

调用Generator函数，返回一个遍历器对象，代表Generator函数的内部指针。以后，每次调用遍历器对象的`next`方法，就会返回一个有着`value`和`done`两个属性的对象。`value`属性表示当前的内部状态的值，是`yield`语句后面那个表达式的值；`done`属性是一个布尔值，表示是否遍历结束。



### yield

Generator函数返回一个迭代器对象，只有调用`next`方法才会编译下一个内部状态。而`yield`语句可以实现暂停执行函数的功能。

迭代对象的`next`方法的运行逻辑如下。

（1）遇到`yield`语句，就暂停执行后面的操作，并将紧跟在`yield`后面的那个表达式的值，作为返回的对象的`value`属性值。

（2）下一次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`语句。

（3）如果没有再遇到新的`yield`语句，就一直运行到函数结束，直到`return`语句为止，并将`return`语句后面的表达式的值，作为返回的对象的`value`属性值。

（4）如果该函数没有`return`语句，则返回的对象的`value`属性值为`undefined`。

需要注意的是，`yield`语句后面的表达式，**只有当调用`next`方法、内部指针指向该语句时才会执行**，因此等于为JavaScript提供了手动的“惰性求值”的语法功能。



`yield`语句与`return`语句既有相似之处，也有区别。

相似之处在于，都能返回紧跟在语句后面的那个表达式的值。

区别在于每次遇到`yield`，函数暂停执行，下一次再从该位置继续向后执行，而`return`语句不具备位置记忆的功能。一个函数里面，只能执行一次`return`语句，但是可以执行多次`yield`语句。正常函数只能返回一个值，因为只能执行一次`return`；Generator函数可以返回一系列的值，因为可以有任意多个`yield`。

<br/>

Generator函数可以不用`yield`语句，这时就变成了一个单纯的暂缓执行函数。

```javascript
function* f() {
  console.log('执行了！')
}

var generator = f();

setTimeout(function () {
  generator.next()
}, 2000);
```

上面代码中，函数`f`如果是普通函数，在为变量`generator`赋值时就会执行。但是，函数`f`是一个Generator函数，就变成只有调用`next`方法时，函数`f`才会执行。

<br/>

另外，`yield`语句如果用在一个表达式之中，必须放在圆括号里面。

```javascript
console.log('Hello' + yield); // SyntaxError
console.log('Hello' + yield 123); // SyntaxError

console.log('Hello' + (yield)); // OK
console.log('Hello' + (yield 123)); // OK
```

`yield`语句用作函数参数或赋值表达式的右边，可以不加括号。

```javascript
foo(yield 'a', yield 'b'); // OK
let input = yield; // OK
```

<br/>

### yield *

如果在Generater函数内部，调用另一个Generator函数，默认情况下是没有效果的。这个就需要用到`yield*`语句，用来在一个Generator函数里面执行另一个Generator函数。

```javascript
function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}
```



> 参考资料
>
> [Generator 函数](<http://caibaojian.com/es6/generator.html>)