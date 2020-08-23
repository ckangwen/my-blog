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





### Vue架构设计

![vue程序结构](C:\all\Note\Blog\docs\.vuepress\public\images\vue程序结构.png)



向Vue原型上挂载方法

```javascript
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
```

initMixin函数主要是处理各类对象的初始化

```javascript
initLifecycle(vm)
initEvents(vm)
initRender(vm)
initInjections(vm)
initState(vm)
initProvide(vm)
```



stateMixin主要是向Vue原型上挂载了`$set`，`$delete`和`$watch`，都是与数据相关的实例方法



eventsMixin主要是处理事件相关的实例方法，与其相关的方法分别是`$on`，`$off`，`$once`和`$emit`



lifecycleMixin主要是处理生命周期相关的实例方法，与其相关的方法分别是`$mount`，`$forceUpdate`，`$nextTick`和`$destory`



lifecycleMixin主要是处理生命周期相关的实例方法，与其相关的方法分别是`$forceUpdate`，和`$destory`



lifecycleMixin主要是处理生命周期相关的实例方法，与其相关的方法分别是`$nextTick`



`$mount`与上述的实例方法不同，它根据不同的平台会有相应的逻辑处理



### init



### event

在模版编译阶段，当模版解析到足迹爱你标签时，会实例化子组件，同时将标签上注册的事件解析成object并通过参数传递给子组件。所以在自组件被实例化时，可以在参数中获取父组件向子组件注册的事件，这些事件最终被保存在`vm.$options._parentListeners`

eg:

```vue
<div>
  <p>{{ total }}</p>
	<button-counter v-on:increment="incrementTotal" />
</div>
```

```vue
<template>
	<button v-on:click="incrementCount"></button>
</template>
<script>
  export default {
    name: 'button-counter',
    methods: {
      incrementCount() {
        //...
        this.$emit('increment')
      }
    }
  }
</script>
```

按照上述案例，`button-counter`的`vm.$options._parentListeners`将会是`{ increment: [ function(){} ] }`



#### $on

使用：`vm.$on(event, cllback)`，添加当前实例上的自定义事件，事件可由`$emit`触发

```javascript
vm.$on('test', msg => {
  console.log(msg) // hello
})

vm.$emit('test', 'hello')
```

```javascript
Vue.prototype.$on = function(event: string | string[], fn: Function) {
  const vm: Vue = this
  if (Array.isArray(event)) {
    event.forEach(e => {
      vm.$on(e, fn)
    })
  } else {
    // 在注册事件时将回调函数收集
    (vm._events[event] || (vm._events[event] = [])).push(fn);
    if (hookRE.test(event)) {
      vm._hasHookEvent = true;
    }
  }
  return vm
}
```



#### $off

用法：`vm.$off([event, callback])`

```javascript
Vue.prototype.$off = function(event?: string | string[], fn?: Function) {
  const vm: Vue = this
  // 如果没有提供参数，则移除所有的事件监听器
  if (!arguments.length) {
    vm._events = Object.create(null)
    return
  }
  // 如果提供的事件是一个数组，则遍历所有的事件
  if (Array.isArray(event)) {
    event.forEach(e => {
      vm.$off(e, fn)
    })
    return vm
  }

  // 如果只提供了事件，则移除该事件所有的监听器
  if (event && !fn) {
    vm._events[event] = null;
    return vm
  }

  // 如果同时提供了事件与回调，则只移除这个回调的监听器
  const cbs = vm._events[event]
  if (!cbs) {
    return vm
  }
  // 如果只提供了事件，则移除该事件所有的监听器
  let cb
  /**
   * 遍历列表从后向前循环，这样在列表中移除一个监听器是，后面的监听器会自动向前移动一个位置
   * 这回导致下一轮循环是跳过表中的一个元素
   */
  let i = cbs.length
  while (i--) {
    cb = cbs[i]
    // 判断cn.fn === fn是为了处理$once的情况
    if (cb === fn || cb.fn === fn) {
      cbs.splice(i, 1)
      break
    }
  }
  return vm
}
```



#### $once

监听一个自定义事件，但是只触发一次，在第一个触发之后移除事件监听器

```javascript
Vue.prototype.$once = function(event: string, fn: Function) {
  const vm: Vue = this
  // 拦截器函数
  const on = () => {
    // 当事件被触发，将会从事件处理函数列表中移除原先的事件处理函数，防止再次被调用
    vm.$off(event, fn)
    fn.call(vm, arguments)
  }
  /**
   * 因为事件处理函数列表中event事件对应的是拦截器函数
   * 但是在应用程序中无法获取到拦截器函数，只能获取到函数原
   * 所以通过$off移除event事件监听器时会失效
   * 因此将fn挂载到拦截器函数的fn属性下，在$off中将会判断函数的fn属性是否与事件处理函数一致
   */
  on.fn = fn
  // 将拦截器函数作为event的处理函数
  vm.$on(event, on)
  return vm
}
```



#### $emit

使用：`vm.$emit(event, [...args])`

触发当前实例上的事件，附加参数都会传给监听器回调

所有事件都会被存储在`vm._events`中，所以触发事件的实现思路就是根据事件名，从事件监听列表中取出该回调函数，然后遍历执行

```javascript
Vue.prototype.$emit = function(event: string) {
  const vm: Vue = this

  let cbs = vm._events[event]
  if (cbs) {
    cbs = cbs.length > 1 ? toArray(cbs) : cbs
    const args = toArray(arguments, 1)
    for (let i = 0, l = cbs.length; i < l; i++) {
      try {
        cbs[i].call(vm, args)
      } catch (e) {
        console.error(`event handler for "${event}"`, e);
      }
    }
  }
  return vm
}
```



#### $set

在object上设置一个属性，如果object是响应式的，那么也会保证属性被创建后也是响应式的，并触发视图更新。该方法主要用于避开vue不能侦测属性被动态添加的限制。

被设置的对象不可以是vue实例或是vue实例的根数据对象

```javascript
export function $set(target: any, key: string | number, val?: any) {
  if (__DEV__ && (!isDef(target) || isPrimitive(target))) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${target}`)
  }

  /** 传入的是一个数组，则在指定位置插入val */
  if (Array.isArray(target) && isNumber(key)) {
    target.length = Math.max(target.length, key)
    /* 通过splice方法使得target数组能够检测到数据的变化 */
    target.splice(key, 1, val)
    return val
  }
  /** 如果是一个对象，且存在了这个key，则返回value */
  if ( typeof key === 'string' && hasOwn(target, key)) {
    target[key] = val
    return val
  }

  const ob = target.__ob__
  /**
   * target._isVue = true，表示是一个vue实例
   * Vue 不允许在已经创建的实例上动态添加新的根级响应式属性(root-level reactive property)
   * */
  if (target._isVue) {
    __DEV__ && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }

  /** 如果不是响应式对象，则直接返回值 */
  if (!ob) {
    target[key] = val
    return val
  }

  /**
   * 如果是响应式对象，为其添加响应式对象，
   * 且由于对象新增了属性需要触发更新 */
  defineReactive(ob.value, key as string, val)
  ob.dep.notify()
  return val
}

```



#### $delete

JavaScript无法检测到属性在对象上被删除，$delete便是为了解决变化侦测的缺陷

```javascript
export function $delete(target: any, key: string | number) {
  if (__DEV__ && (!isDef(target) || isPrimitive(target))) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${target}`)
  }

  if (Array.isArray(target) && isNumber(key)) {
    target.splice(key, 1)
    return
  }

  if ( typeof key === 'string' && hasOwn(target, key)) {
    return
  }

  const ob = target.__ob__

  if (target._isVue) {
    __DEV__ && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return
  }

  delete target[key]
  ob && ob.dep.notify()
}

```

#### $forceUpdate

可以是组件实例重新渲染



#### $destory

`vm.$destory`的作用是完全销毁衣蛾实例，他会清理该实例与其他实例的连接，并解绑该组件全部的指令和监听器，同时触发`beforeDestory`和`destoryed`钩子函数



## 参考资料

> <https://github.com/aooy/blog/issues/5>



