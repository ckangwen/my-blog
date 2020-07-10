---
title: PureComponent与memo
date: 2020-07-10
categories:
  - React
tags:
  - React API
---

## PureComponent

PureComponent相较于Component而言，它并未实现`shouldComponentUpdate()`，而PureComponent中以浅层对比prop和state的方式来实现了该函数

> `shouldComponentUpdate(nextProps, nextState)`
>
> 根据`shouldComponentUpdate`的返回值，判断React组件的输出是否受当前的state或props更改的影响。
>
> 当props或state发生变化时，`shouldComponentUpdate`会在渲染执行之前被调用。返回值默认为`true`

### PureComponent的核心代码

PureComponet中`shouldComponentUpdate`的实现为

```js
if (this._compositeType === CompositeTypes.PureClass) {
  shouldUpdate = !shallowEqual(prevProps, nextProps) || ! shallowEqual(inst.state, nextState);
}
```

shadowEqual只会浅检查组件的props和state，所以嵌套对象和数组是不会被比较的。深比较是要逐层遍历枚举对应的键值进行比对，这个操作比较浪费时间。如果比较的深的情况，你也可以使用`shouldComponentUpdate`来手动单个比较是否需要重新渲染。

或者使用使用immutable属性，使用不可变对象。



### 更新时进行浅比较

<p class="codepen" data-height="300" data-theme-id="light" data-default-tab="js,result" data-user="ckw" data-slug-hash="zYraOjG" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="PureComponent shallowEqual">
  <span>See the Pen <a href="https://codepen.io/ckw/pen/zYraOjG">
  PureComponent shallowEqual</a> by ckw (<a href="https://codepen.io/ckw">@ckw</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>





```
handleClick() {
  let {items} = this.state

  items.push('new-item')
  this.setState({ items })
}

render() {
  return (
    <div>
      <button onClick={this.handleClick} />
{this.state.arr.map((item) => {
            return item;
          })}
    </div>
  )
}

```

此处的ItemList是一个纯组件，所以此案例中，点击按钮时ItemList中不会添加新的数据，因为items属性始终指向的是同一个对象：`this.state.items`

解决办法

```js
handleClick() {
  this.setState(prevState => ({
    words: prevState.items.concat(['new-item'])
  }))
}

```



### 父组件重新渲染会导致子组件重新渲染

<p class="codepen" data-height="300" data-theme-id="light" data-default-tab="result" data-user="ckw" data-slug-hash="wvMXwOQ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="PureComponent父组件重新渲染会导致子组件重新渲染">
  <span>See the Pen <a href="https://codepen.io/ckw/pen/wvMXwOQ">
  PureComponent父组件重新渲染会导致子组件重新渲染</a> by ckw (<a href="https://codepen.io/ckw">@ckw</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

在父子组件都是PureComponent的情况下，如果父组件进行浅比较后相等，即没有更新，那么其所有的子组件也不会发生更新，反之则更新。

> 如果PureComponent浅比较失败，这种情况下与父组件是Component的情况一致

PureComponent的最佳情况就是作为展示组件，它既没有子组件，也没有依赖应用的全局状态。





## memo

`React.memo` 为高阶组件。它与 `React.PureComponent`非常相似，是用于控制函数组件的重新渲染的。

<br/>

**memo的使用**

```jsx
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```

<p class="codepen" data-height="300" data-theme-id="light" data-default-tab="result" data-user="ckw" data-slug-hash="gOPKOGq" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="React.memo Demo">
  <span>See the Pen <a href="https://codepen.io/ckw/pen/gOPKOGq">
  React.memo Demo</a> by ckw (<a href="https://codepen.io/ckw">@ckw</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### memo的核心代码

```js
function updateMemoComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  nextProps: any,
  updateExpirationTime,
  renderExpirationTime: ExpirationTime,
): null | Fiber {

  /* ...省略...*/

  // 判断更新的过期时间是否小于渲染的过期时间
  if (updateExpirationTime < renderExpirationTime) {
    const prevProps = currentChild.memoizedProps;

    // 如果自定义了compare函数，则采用自定义的compare函数，否则采用官方的shallowEqual(浅比较)函数。
    let compare = Component.compare;
    compare = compare !== null ? compare : shallowEqual;

    /**
     * 1. 判断当前 props 与 nextProps 是否相等；
     * 2. 判断即将渲染组件的引用是否与workInProgress Fiber中的引用是否一致；
     *
     * 只有两者都为真，才会退出渲染。
     */
    if (compare(prevProps, nextProps) && current.ref === workInProgress.ref) {
      // 如果都为真，则退出渲染
      return bailoutOnAlreadyFinishedWork(
        current,
        workInProgress,
        renderExpirationTime,
      );
    }
  }

  /* ...省略...*/
}
```

> work-in-progress(简写 WIP: 半成品)：表示尚未完成的 Fiber，也就是尚未返回的堆栈帧，对象 workInProgress 是 reconcile 过程中从 Fiber 建立的当前进度快照，用于断点恢复。

