---
title: 外边距重叠
date: 2020-01-15
tags:
 - JavaScript
categories:
 - 源码
---

## Promise

Promise是一种规范，是一套处理JavaScript异步的机制。

Promise的规范有很多，包括但不限于Promise/A，Promise/B，Promise/A+等，



Promise对象的状态不受外部影响。它有三种状态：pending(进行中)、fulfilled(已成功)和rejected(已失败)。

如果状态是pending，promise的状态只会转换到fulfilled或rejected

如果状态是fulfilled，那么就不能转换到任何其他的状态，且必须具有一个值(value)，该值不能被改变

如果状态是rejected，那么就不能转换到任何其他的状态，且必须有一个异常(reason)，该值不能被改变



### constructor

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('foo');
  }, 300);
});
```

使用Promise时需要实例化Promise，并传入一个带有resolve和reject两个参数的函数。

```js
class MyPromise {
  constructor(executor) {
    // 如果传给Promise的不是一个函数，则抛出异常。
    if (!isFunction(executor)) {
      throw new Error("MyPromise must accept a function as a parameter");
    }

    // 设置初始状态为pending
    this.status = PENDING;
    this.value = undefined;
    this.fulfilledQueues = [];
    this.rejectedQueues = [];

    // 如果在executor函数中抛出一个错误，那么该promise 状态为rejected。
    try {
      // 绑定异步操作的成功和失败的处理函数
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }
}
```



### resolve、reject

异步操作成功之后，需要将状态由pending转为fulfilled，操作失败后，将状态由pending转为rejected；此后该状态就不能被改变，然后传递一个值给相应的状态处理方法。

```js
  resolve(val) {
    const run = () => {
      // 状态只能由pending => fulfilled 或 pending => rejected
      if (this.status !== PENDING) return;

      const runFulFilled = value => {
        let cb;
        // 依次执行成功队列中的函数，并清空队列
        // 在MyPromise.prototype.then 中会向fulfilledQueues中添加回调函数
        while ((cb = this.fulfilledQueues.shift())) {
          cb(value);
        }
      };
      const runRejected = error => {
        let cb;
        while ((cb = this.rejectedQueues.shift())) {
          cb(value);
        }
      };

      if (val instanceof MyPromise) {
        //  如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后，当前的Promise对象的状态才会改变
        // 当前的状态取决于参数Promise的状态
        val.then(
          value => {
            this.value = value;
            this.status = FULFILLED;
            runFulFilled(value);
          },
          error => {
            this.value = error;
            this.status = REJECTED;
            runRejected(error);
          }
        );
      } else {
        this.value = val;
        this.status = FULFILLED;
        runFulFilled(val);
      }
    };

    setTimeout(run, 0);
  }
```

值得注意的是，我们把要执行的代码放入了setTimeout中，根据Promise规范的2.2.4

> `onFulfilled` or `onRejected` must not be called until the [execution context](https://es5.github.io/#x10.3) stack contains only platform code.
>
> `onFulfilled`或`onRejected`在[执行上下文](https://es5.github.io/#x10.3)堆栈仅包含平台代码之前不得调用。

对这段话的解释如下

> Here "platform code" means engine, environment, and promise implementation code. In practice, this requirement ensures that `onFulfilled` and `onRejected` execute asynchronously, after the event loop turn in which `then` is called, and with a fresh stack. This can be implemented with either a "macro-task" mechanism such as [`setTimeout`](https://html.spec.whatwg.org/multipage/webappapis.html#timers) or [`setImmediate`](https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html#processingmodel), or with a "micro-task" mechanism such as [`MutationObserver`](https://dom.spec.whatwg.org/#interface-mutationobserver) or [`process.nextTick`](http://nodejs.org/api/process.html#process_process_nexttick_callback). Since the promise implementation is considered platform code, it may itself contain a task-scheduling queue or "trampoline" in which the handlers are called.
>
> 
>
> 这里的“平台代码”是指引擎，环境和承诺实现代码。实际上，此要求可确保在调用事件循环之后并使用新堆栈`onFulfilled`并`onRejected`异步执行`then`。这可以通过“宏任务”机制（例如[`setTimeout`](https://html.spec.whatwg.org/multipage/webappapis.html#timers)或[`setImmediate`](https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html#processingmodel)）或通过“微任务”机制（例如[`MutationObserver`](https://dom.spec.whatwg.org/#interface-mutationobserver)或）来实现[`process.nextTick`](http://nodejs.org/api/process.html#process_process_nexttick_callback)。由于promise实现被视为平台代码，因此它本身可能包含任务调度队列或在其中调用处理程序的“蹦床”。



```js
  reject(err) {
    if (this.status !== REJECTED) return;

    const run = () => {
      this.status = REJECTED;
      this.value = err;
      let cb;
      while ((cb = this._rejectedQueues.shift())) {
        cb(err);
      }
    };

    setTimeout(run, 0);
  }
```



### then

```js
promise1.then((value) => {
  console.log(value);
});
```

Promise必须提供一个then方法，以访问当前或最终的值。

```js
promise.then(onFulFilled, onRejected)
```

`then`方法接受两个可选参数。当Promise状态为*fulfilled*时，调用 `then` 的 onfulfilled 方法，当Promise状态为*rejected*时，调用 `then` 的 onrejected 方法



如果onFulFilled或onRejected**不是一个函数**，则`onFulFilled`会在内部**被替换为 `(x) => x`**，即原样返回 promise 最终结果的函数，`onRejected`会在内部被替换为一个 Thrower 函数 。

如果onFulFilled是一个函数，则必须在`promise`的状态转为fulfilled之后调用，且`promise`的值(value)需要作为第一个参数；在状态转为fulfilled之前不能调用它；它不能被多次调用。

如果onRejected是一个函数，则必须在`promise`的状态转为rejected之后调用，且`promise`的异常(reason)需要作为第一个参数；在状态转为rejected之前不能调用它；它不能被多次调用。

![img](https://mdn.mozillademos.org/files/8633/promises.png)

<br/>

当一个Promise完成或失败时，**返回函数将被异步调用**，具体的返回值依据以下规则返回：

- 返回了一个值，那么`then`返回的Promise将会变为*fulfilled*，并将返回值作为接受状态的回调函数的参数
- 没有任何返回值，那么`then`返回的Promise将会变为*fulfilled*，并且接受该状态的回调函数的参数为`undefined`
- 抛出一个错误，那么`then`返回的Promise将会变为*rejected*，并且将抛出的错误作为拒绝状态的回调函数的参数值。
- 返回一个已经是接受状态的 Promise，那么 `then` 返回的 Promise 也会成为接受状态，并且将那个 Promise 的接受状态的回调函数的参数值作为该被返回的Promise的接受状态回调函数的参数值。
- 返回一个已经是拒绝状态的 Promise，那么 `then` 返回的 Promise 也会成为拒绝状态，并且将那个 Promise 的拒绝状态的回调函数的参数值作为该被返回的Promise的拒绝状态回调函数的参数值。
- 返回一个未定状态（`pending`）的 Promise，那么 `then` 返回 Promise 的状态也是未定的，并且它的终态与那个 Promise 的终态相同；同时，它变为终态时调用的回调函数参数与那个 Promise 变为终态时的回调函数的参数是相同的。

<br/>

**代码实现**

```js
then(onFulfilled, onRejected) {
  const { value, status } = this;
  // 根据Promise A+规范，then方法需要返回一个Promise
  return new MyPromise((onFulfilledNext, onRejectedNext) => {
    // 成功时执行的回调函数
    let fulfilled = value => {
      try {
        // resolve返回的不是一个函数，则将该对象(包括undefined)返回给then中的onFulfilled
        if (!isFunction(onFulfilled)) {
          onFulfilledNext(value);
        } else {
          // 执行该成功回调
          let res = onFulfilled(value);
          if (res instanceof MyPromise) {
            res.then(onFulfilledNext, onRejectedNext);
          } else {
            // 将回调函数执行结果返回给then中的onFulfilled
            onFulfilledNext(res);
          }
        }
      } catch (e) {
        // 出现异常，将异常传给onRejected
        onRejectedNext(e);
      }
    };

    // 失败时执行的回调函数，与fulfilled的情况一致
    let rejected = error => {
      try {
        if (!isFunction(onRejected)) {
          onRejectedNext(error);
        } else {
          let res = onRejected(error);
          if (res instanceof MyPromise) {
            res.then(onFulfilledNext, onRejectedNext);
          } else {
            onFulfilledNext(res);
          }
        }
      } catch (e) {
        onRejectedNext(e);
      }
    };

    // 在执行then之前，异步操作的状态已经通过resolve或reject改变了
    // 在此需要判断当前所属状态，来执行不同的回调函数
    switch (status) {
      // 如果状态pending，则可能是上一个then方法，通过方法链将一个新的Promise传给了下一个then
      // 那么将传入then的onFulfilled和onRejected放到异步操作处理函数队列中，等待resolve或reject处理
      case PENDING: {
        this.fulfilledQueues.push(fulfilled);
        this.rejectedQueues.push(rejected);
        break;
      }
      // 状态已经由pending转换为fulfilled，则执行成功回调
      // 参数是executor中resolve的值
      case FULFILLED: {
        fulfilled(value);
        break;
      }
      case REJECTED: {
        rejected(value);
        break;
      }
    }
  });
}
```

<br/>

当`then`中状态为*pending*时的处理流程，以下代码的第二个then方法为例

``` js
new MyPromise((resolve, reject) => {
  resolve(1);
})
  .then(val => {
    return new MyPromise((resolve, reject) => {
      setTimeout(() => {
        val += 100;
        resolve(val);
      });
    });
  })
  .then(val => {
    // 101
    console.log(val);
  });
```

1. 执行then方法，进入`Promise.prototype.then`方法体

2. then返回新的Promise对象，进而进入Promise构造函数中

3. 在构造函数此时的状态被设置为pending，并调用executor

4. 进入executor中，该executor就是`Promise.prototype.then`方法体中返回值Promise对象传入的函数

5. 判断异步状态为pending后，将在该executor中定义的成功回调与失败回调放入回调队列中

   ```js
   let fulfilled = value => {
     try {
       // resolve返回的不是一个函数，则将该对象(包括undefined)返回给then中的onFulfilled
       if (!isFunction(onFulfilled)) {
         onFulfilledNext(value);
       } else {
         // 执行该成功回调
         let res = onFulfilled(value);
         if (res instanceof MyPromise) {
           res.then(onFulfilledNext, onRejectedNext);
         } else {
           // 将回调函数执行结果返回给then中的onFulfilled
           onFulfilledNext(res);
         }
       }
     } catch (e) {
       // 出现异常，将异常传给onRejected
       onRejectedNext(e);
     }
   };
   ```

6. 退出executor，执行then的状态回调函数(本案例中只写了一个成功回调函数)，由于then返回的是一个Promise对象，因此进入了`Promise.prototype.resolve`中(*因为Promise的构造函数中`executor(this.resolve.bind(this), this.reject.bind(this));`*)

7. 在resolve中遍历调用回调队列中的方法，也就调用了向第二个`then`传入的函数

8. 此时状态已变为resolved



### catch

添加一个失败回调到当前 promise, 返回一个新的promise

```js
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
```



### finally

`finally()` 方法返回一个`Promise`。在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数。这为在`Promise`是否成功完成后都需要执行的代码提供了一种方式。

这避免了同样的语句需要在`then()`和`catch()`中各写一次的情况。

```js
finally(cb) {
  return this.then(
    value => MyPromise.resolve(cb()).then(() => value),
    reason =>
      MyPromise.resolve(cb()).then(() => {
        throw reason;
      })
  );
}
```







### Promise.resolve、Promise.reject

一般情况下我们都会使用 `new Promise()` 来创建promise对象，但是除此之外我们也可以使用其他方法。

静态方法`Promise.resolve(value)`可以认为是 `new Promise()` 方法的快捷方式。

比如 `Promise.resolve(42);` 可以认为是以下代码的语法糖。

```javascript
new Promise(function(resolve){
    resolve(42);
});
```

在这段代码中的 `resolve(42);` 会让这个promise对象立即进入确定（即resolved）状态，并将 `42` 传递给后面then里所指定的 `onFulfilled` 函数。

方法 `Promise.resolve(value);` 的返回值也是一个promise对象，所以我们可以像下面那样接着对其返回值进行 `.then` 调用。

```javascript
Promise.resolve(42).then(function(value){
    console.log(value);
});
```

<br/>

`Promise.reject()`类似与`Promise.resolve()`，不同之处在于promise内调用的函数是reject而不是resolve。

<br/>

```js
static resolve(value) {
  if (value instanceof MyPromise) return value;
  return new MyPromise(resolve => resolve(value));
}

static reject(value) {
  return new MyPromise((_, reject) => reject(value));
}
```



### Promise.all

`Promise.all(iterable)` 方法返回一个Promise实例，此实例在 `iterable` 参数内所有的 `promise` 都执行成功或参数中不包含 `promise` 时，回调完成(resolve)；如果参数中  `promise` 有一个失败，此实例回调失败(reject)，失败的原因是第一个失败 `promise` 的结果。

```js
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});
// expected output: Array [3, 42, "foo"]
```

<br/>

```js
static all(iterable) {
  return new MyPromise((resolve, reject) => {
    let values = [];
    let count = 0;
    // 获取可迭代对象的索引和值
    for (let [i, p] of iterable.entries()) {
      // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
      this.resolve(p).then(
        res => {
          values[i] = res;
          count++;
          // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
          if (count === iterable.length) resolve(values);
        },
        err => {
          // 有一个被rejected时返回的MyPromise状态就变成rejected
          reject(err);
        }
      );
    }
  });
}
```



### Promise.race

`Promise.race(iterable)` 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2]).then((value) => {
  console.log(value);
  // Both resolve, but promise2 is faster
});
// expected output: "two"
```



```js
static race(list) {
  return new MyPromise((resolve, reject) => {
    for (let p of list) {
      // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
      this.resolve(p).then(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
    }
  });
}
```







## 其他

Promise也会有一些缺点。(1)Promise无法被取消，一旦创建它就会被立即执行，无法中途取消。(2)如果不设置回调函数，Promise内部抛出的错误将不会反映到外部。(3)当处于pending状态时，无法得知当前进展到哪一阶段。





> 参考资料
>
> [Promise MDN](<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise>)
>
> [JavaScript Promise迷你书（中文版）](<http://liubin.org/promises-book/>)