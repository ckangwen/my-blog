---
title: useCallback与useMemo
date: 2020-07-11
categories:
  - React
tags:
  - React API
---

## useCallback

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

回调函数仅在某个依赖项改变时才会更新，可以避免非必要渲染。

<p class="codepen" data-height="300" data-theme-id="light" data-default-tab="result" data-user="ckw" data-slug-hash="jOWKEgx" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="useCallback演示">
  <span>See the Pen <a href="https://codepen.io/ckw/pen/jOWKEgx">
  useCallback演示</a> by ckw (<a href="https://codepen.io/ckw">@ckw</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

子组件是一个被memo包裹的高阶组件，接受参数`handleChildren`，如果参数改变就会重新渲染。

在第一种情况中，传递给子组件的prop`handleChildren `使用了`useCallback`，返回一个memoized值

```js
const handleChildrenCallback = useCallback(() => {
  handleChildren();
}, []);
```

其依赖项为空，所以该函数永远不会改变，这样一来子组件就不会重新渲染。

而第二种情况中，将普通函数`handleChildren`传给了子组件

```js
function handleChildren() {
  setCount(prev => prev - 1)
}
```

父组件点击事件触发后，会更新`count`的值，使父组件重新渲染，而没有进行任何memoize操作的`handleChildren`会重新分配一个地址，与之前的函数不是同一个对象，所以子组件将会重新渲染。





## useMemo

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```



把函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行**高开销的计算**。

<p class="codepen" data-height="300" data-theme-id="light" data-default-tab="js,result" data-user="ckw" data-slug-hash="yLeENzw" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="useMemo案例">
  <span>See the Pen <a href="https://codepen.io/ckw/pen/yLeENzw">
  useMemo案例</a> by ckw (<a href="https://codepen.io/ckw">@ckw</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>



![1594361840332](/images/too-many-re-render-error.png)





## 总结

- useCallback 优化针对于子组件渲染
- useMemo 优化针对于当前组件高开销的计算