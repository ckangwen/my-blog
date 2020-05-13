---
title: requestAnimationFrame
date: 2020-05-13
categories:
  - JavaScript
tags:
  - Web API
---


## 介绍

requestAnimationFrame是浏览器用于定时循环操作的一个接口，类似于setTimeout，主要用途是按帧对网页进行重绘。

**接口定义**

```typescript
partial interface Window {
  long requestAnimationFrame(FrameRequestCallback callback);
  void cancelAnimationFrame(long handle);
};
```

这个API的目的是让各种网页动画效果能够有一个统一的刷新机制，从而节省系统资源，提高系统性能。在代码中使用这个API，就是告诉浏览器希望执行一个动画，让浏览器在下一个动画帧安排一次网页重绘。



requestAnimationFrame的优势在于充分利用显示器的刷新机制。显示器的固定的刷新频率为60Hz或75Hz，每秒做多进行60次或75次重绘，超过这个频率用户体验也不会有提升。所以最平滑的循环间隔为`1000ms / 60`或`1000ms / 75`。requestAnimationFrame利用这个刷新频率进行页面重绘。

在隐藏或不可见的元素中，`requestAnimationFrame`将不会进行重绘或回流，并且如果页面不是活动状态下的话，动画会自动暂停，有效节省了CPU开销著作权归作者所有。

<br/>

> `requestAnimationFrame`在浏览器中的执行顺序

![life of a frame](/images/life-of-a-frame.jpg)

## 使用

requestAnimationFrame使用一个回调函数作为参数。这个回调函数会在浏览器重绘之前调用。

```javascript
requestID = window.requestAnimationFrame(callback);
```

当requestAnimationFrame被调用时不会执行回调函数callback，而是会将元组`<handler, callback>`插入到动画帧请求回调函数列表末尾，并返回handle值，该值为浏览器定义的、大于0的整数，唯一标识了该回调函数在列表中位置，可以通过`cancelAnimationFrame`取消回调函数。

回调函数会被传入`DOMHeightResTimeStamp`参数，指示当前被`requestAnimationFrame()`排序的回调函数被触发的时间。



## 兼容写法

```javascript
(function() {
  let lastTime = 0;
  let vendors = ['webkit', 'moz'];

  //如果window.requestAnimationFrame为undefined先尝试浏览器前缀是否兼容
  for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
                                  window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  //如果仍然不兼容，则使用setTimeOut进行兼容操作
  if(!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    }
  }

  if(!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    }
  }
})();
```



## 对比setTimeout和setInterval

setTimeout 的执行时间并不是确定的。在 Javascript 中， setTimeout 任务被放进了异步队列中，只有当主线程上的任务执行完以后，才会去检查该队列里的任务是否需要开始执行，因此 setTimeout 的实际执行时间一般要比其设定的时间晚一些。

刷新频率受屏幕分辨率和屏幕尺寸的影响，因此不同设备的屏幕刷新频率可能会不同，而 setTimeout 只能设置一个固定的时间间隔，这个时间不一定和屏幕的刷新时间相同。

以上两种情况都会导致 setTimeout 的执行步调和屏幕的刷新步调不一致，从而引起丢帧现象。

此外，它们方法中的时间间隔参数实际上只是指定了把动画代码添加到浏览器UI线程队列中以等待执行的时间。如果队列前面已经加入了其他任务，那动画代码就要等前面的任务完成后再执行。

**在页面当前不在活动状态下，requestAnimationFrame是不会运行的**，而 `setTimeout` 仍会在后台运行。

:::demo
``` vue
<template>
  <div class="animation-container">
    <button @click="start('css')">start【css】</button>
    <button @click="start('requestAnimationFrame')">start【requestAnimationFrame】</button>
    <button @click="start('setInterval')">start【setInterval】</button>
    <button @click="start('setTimeout')">start【setTimeout】</button>
    <div class="ball"></div>
  </div>
</template>
<script>
export default {
  name: 'animation',
  data() {
    return {
      startTime: null,
      max: 200,
      duration: 2000,
      timer: null
    }
  },
  computed: {
    target() {
      return document.querySelector('.ball')
    }
  },
  methods: {
    start(type) {
      this.target.style.left = 0
      this.target.classList.remove('move')
      if (type === 'css') {
        this.target.classList.add('move')
      }
      if (type === 'requestAnimationFrame') {
        window.requestAnimationFrame(this.step)
      }
      if (type === 'setInterval') {
        this.bySetInterval()
      }
      if (type === 'setTimeout') {
        this.bySetTimeout()
      }
    },
    step(timestamp) {
      if (!this.startTime) this.startTime = timestamp
      let progress = (timestamp - this.startTime)
      progress = Math.min(progress / this.duration, 1)

      this.target.style.left = `${progress * this.max}px`
      if (progress !== 1) {
        window.requestAnimationFrame(this.step)
      }
    },
    bySetInterval() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        let left = parseInt(this.target.style.left)
        if (left < this.max) {
          this.target.style.left = parseInt(left + (16 / this.duration) * this.max) + 'px'
        } else {
          clearInterval(this.timer)
        }
      }, 16)
    },
    bySetTimeout() {
      clearTimeout(this.timer)
      const self = this
      function fn() {
        let left = parseInt(self.target.style.left)
        if (left < self.max) {
          self.target.style.left = parseFloat(left + (16 / self.duration) * self.max) + 'px'
          setTimeout(fn, 16)
        } else {
          clearInterval(self.timer)
        }
      }
      this.timer = setTimeout(fn, 16)
    }

  },
}
</script>
<style>
.animation-container {
  position: relative;
  width: 100%;
  height: 100px;
}
.ball {
  position: absolute;
  left: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #92B901;
}
.move {
  animation: move 2s linear infinite;
}
@keyframes move {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(200px);
  }
}
</style>
```
:::


## 其他

### 作用域丢失

在类中调用requestAnimationFrame时，requestAnimationFrame的回调函数会发生作用域丢失的问题。

```javascript
    class Logger {
      log() {
        console.log('log something...')
      }

      start() {
        window.requestAnimationFrame(this.step)
      }

      step(timestamp) {
        // undefined
        console.log(this)
        // error: Uncaught TypeError: Cannot read property 'log' of undefined
        this.log()
      }
    }

    new Logger().start()
```

<br/>

**问题解决： 绑定作用域**

```javascript
    class Logger {
      log() {
        console.log('log something...')
      }

      start() {
        const self = this
        window.requestAnimationFrame(timestamp => {
          this.step.call(this, timestamp)
        })
      }

      step(timestamp) {
        console.log(this)
        // log something...
        this.log()
      }
    }

    new Logger().start()
```



### 同一帧内重复执行回调函数

多次调用带有同一回调函数的requestAnimationFrame，会导致回调在同一帧中执行多次。

```javascript
    function animation(timestamp) {
      console.log('animation', timestamp)
    }
    // animation 288.182
    // animation 288.182
    window.requestAnimationFrame(animation)
    window.requestAnimationFrame(animation)
```

<br/>

**问题解决： 管理回调函数列表**

```javascript
    const callbackList = []

    function raf(callback) {
      const entry = callbackList.find(t => t.callback === callback)
      if (entry) {
        return entry.requestId
      } else {
        const requestId = requestAnimationFrame(ts => {
          const index = callbackList.findIndex(t => t.callback === callback)
          if (index > -1) callbackList.splice(index, 1)
          callback(ts)
        })
        callbackList.push({
          callback,
          requestId,
        })
        return requestId
      }
    }
    function caf(requestId) {
      const index = callbackList.findIndex(t => t.requestId === requestId)

      if (index > -1) {
        callbackList.splice(index, 1)
      }
      cancelAnimationFrame(requestId)
    }

    // animation 2540.771
    raf(animation)
    raf(animation)
```


<br/>

## 参考链接

[requestAnimationFrame](<https://javascript.ruanyifeng.com/htmlapi/requestanimationframe.html>)

[被誉为神器的requestAnimationFrame](<https://www.w3cplus.com/javascript/requestAnimationFrame.html>)
