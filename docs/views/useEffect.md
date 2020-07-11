---
title: 认识useEffect
date: 2020-04-22
categories:
  - React
tags:
  - React API
---

在函数组件渲染阶段，改变DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能破坏UI的一致性。

通过使用`useEffect`可以完成副作用操作，赋值给 ``useEffect` 的函数会**在组件渲染到屏幕之后执行**。

`useEffect`会在浏览器完成布局和绘制之后延迟执行(第一次渲染和每次更新后都会执行)，不应该在函数中执行阻塞浏览器更新屏幕的操作。



### effect的依赖检测

默认情况下，effect会在每次组件渲染完成之后执行，一旦 effect 的依赖发生变化，它就会被重新创建。

如果只需要在特定的prop改变时才创建effect，可以给 `useEffect` 传递第二个参数，它是 effect 所依赖的值数组。

如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（`[]`）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。

`useEffect`的设计意图就是要强迫你关注数据流的改变，然后决定我们的effects该如何和它同步。

<br/>

### 在effect中定义函数

```js
function SearchResults() {
  const [data, setData] = useState({ hits: [] });

  function getFetchUrl() {
    return 'https://hn.algolia.com/api/v1/search?query=react';
  }

  // Imagine this function is also long
  async function fetchData() {
    const result = await axios(getFetchUrl());
    setData(result.data);
  }

  useEffect(() => {
    fetchData();
  }, []);
}
```

我们定义effect的目的就是为了在视图更新之后同步props和state。但是随着项目的迭代，可能在effect中调用的函数会出现没有被`useEffect`检测到的依赖，而导致effects就不会同步props和state带来的变更。

```diff
+ const [query, setQuery] = useState('react');
  function getFetchUrl() {
-  return 'https://hn.algolia.com/api/v1/search?query=react'
+   return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }
```

所以，如果某些函数**仅在effect中调用**，可以把他们的定义转到effect中：

```js
function SearchResults() {
  const [query, setQuery] = useState('react');
  useEffect(() => {
    function getFetchUrl() {
      return 'https://hn.algolia.com/api/v1/search?query=' + query;
    }
    async function fetchData() {
      const result = await axios(getFetchUrl());
      setData(result.data);
    }

    fetchData();
  }, [query]);
  // ...
}
```

这样的好处是我们不需要再考虑函数的间接依赖



> 参考资料
>
> [useEffect 完整指南](<https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/>)