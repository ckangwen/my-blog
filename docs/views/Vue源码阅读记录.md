### nextTick

> 在此没有考虑兼容性的问题，只通过Promise实现，vue源码中通过MutationObserve和setTimeout来兼容各种环境
>
> vue版本是2.6.11

```javascript
let callbacks = []
let isUsingMicroTask = false
let pending = false

function flushCallbacks() {
  pending = true // 状态转换为执行中
  const copies = callbacks.slice(0)
  callbacks.length = 0
  copies.forEach(item => {
    item()
  })
}


let timerFunc = () => {
  Promise
    .resolve()
    .then(flushCallbacks)

  // Promise.then属于微任务
  isUsingMicroTask = true
}

function nextTick(cb, ctx) {
  let _resolve;
  console.log('nextTick start');
  callbacks.push(
    () => {
      if (cb) {
        try {
          cb.call(ctx)
        } catch (error) {
          console.log('nextTick', error);
        }
      } else if (_resolve) {
        console.log('call resolve')
        _resolve()
      }
    }
  )

  if (pending === false) {
    pending = true
    // timerFunc是一微任务
    timerFunc()
  }

  console.log('after call timerFunc');

  // 如果nextTick没有传入cb，可以在next()中实现需求，他会调用Promise的resolve，使得then方法得以继续执行
  return new Promise((resolve) => {
    console.log('in Promise');
    _resolve = resolve
  })
}

console.log('before call nextTick')
nextTick()
	.then(function () {
    console.log('Promise.then start');
  })
console.log('after call nextTick')

// before call nextTick
// nextTick start
// after call timerFunc
// in Promise
// after call nextTick
// call resolve
// Promise.then start
```

**对于nextTick，在同一事件循环中，当所有的同步数据更新完毕后，才会调用nextTick**(因为nextTick是用Promise实现的微任务)

多个nextTick同时存在，会按照先来先执行的方式执行



nextTick涉及到Event Loop和JavaScript运行机制

> 首先执行调用栈中的函数，当调用栈中的执行上下文全部被弹出，只剩下全局上下文的时候，就开始执行job的执行队列，job的执行完以后就开始执行task的队列中的。先进入的先执行，后进入的后执行。无论是task还是job都是通过函数调用栈来执行。task执行完成一个，js代码会继续检查是否有job需要执行。



nextTick采用微任务的机制是因为微任务在浏览器渲染之前执行

![](https://user-gold-cdn.xitu.io/2019/8/18/16ca3e0d9d52c428?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

如果采用宏任务的形式，它会在UI渲染之后执行，不仅会延迟视图更新，带来性能问题。

![](https://user-gold-cdn.xitu.io/2019/8/18/16ca3e14690b8699?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



![](https://user-gold-cdn.xitu.io/2019/8/18/16ca3e14690b8699?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



在一轮event loop中多次修改同一dom，只有最后一次会进行绘制

```javascript
    const app = document.getElementById('app')
    nextTick(function() {
      app.innerHTML = 'first'
    })
    nextTick(function() {
      app.innerHTML = 'second'
    })
    nextTick(function() {
      app.innerHTML = 'third'
    })
```

app最终显示的文字将会是`third`



## 参考资料

> <https://github.com/aooy/blog/issues/5>



