---
title: Intersection Observer API
date: 2020-04-16
categories:
  - JavaScript
tags:
  - Web API
---

[[toc]]

# Intersection Observer

Intersection Observer API 提供了一种**异步**观察**目标元素与祖先元素或浏览器视口的交集**中的变化的方法。

Intersection Observer API会注册一个回调方法，每当期望被监视的元素**进入或退出另一个元素**的时候(或浏览器的视口)，该回调方法将被执行；或者两个元素的**交集部分的大小发生变化**的时候，回调方法也会被执行。

Intersection Observer API不能告诉你的是两个元素重叠部分的准确像素个数或重叠的像素属于哪个元素。使用该API最常用的方式是**"如果两个元素发生的交集部分在n%左右，我需要处理一些事情"**

需要使用到元素交集变化的情况

- 当页面滚动时，懒加载图片或其他内容
- 实现无限滚动
- 根据用户是否以滚动到相对应区域来灵活开始执行任务或动画



<br>

<br>

## API

**`new IntersectionObserver(callback?: IntersectionObserverCallback, options?: IntersectionObserverInit | undefined): IntersectionObserver`**

创建一个IntersectionObserver对象需要传入回调函数以及相应的参数，该回调函数将会在目标函数(**target**)与根元素(**root**)的交集超过阈值(**threshold**)规定的大小时被执行。

构造函数的返回值是一个观察器实例。实例的`observe`方法可以指定观察哪个 DOM 节点。

```js
// 开始观察
observer.observe(el);

// 停止观察
observer.unobserve(el);

// 关闭观察器
observer.disconnect();

// 返回所有观察目标的IntersectionObserverEntry对象数组
observer.takeRecords();
```

上面代码中，`observe`的参数是一个 DOM 节点对象。如果要观察多个节点，就要多次调用这个方法。

<br>



### IntersectionObserver

```ts
interface IntersectionObserver {
  readonly root: Element | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  disconnect(): void;
  observe(target: Element): void;
  takeRecords(): IntersectionObserverEntry[];
  unobserve(target: Element): void;
}
```



<br>



### IntersectionObserverCallback

回调函数一般会触发两次，一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）。

```ts
interface IntersectionObserverCallback {
  (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;
}

interface IntersectionObserverEntry {
  readonly boundingClientRect: DOMRectReadOnly;
  readonly intersectionRatio: number;
  readonly intersectionRect: DOMRectReadOnly;
  readonly isIntersecting: boolean;
  readonly rootBounds: DOMRectReadOnly | null;
  readonly target: Element;
  readonly time: number;
}
```

| 属性                     | 描述                                                         |
| ------------------------ | ------------------------------------------------------------ |
| ***boundingClientRect*** | 目标元素的矩形区域信息                                       |
| ***intersectionRatio***  | 目标元素的可见比例，即`intersectionRect`占`boundingClientRect`的比例，完全可见时为`1`，完全不可见时小于等于`0` |
| ***intersectionRect***   | 目标元素与根元素的交叉区域信息                               |
| ***isIntersecting***     | 返回一个布尔值，下列两种操作均会触发callback：1. 如果目标元素出现在root可视区，返回true。2. 如果从root可视区消失，返回false |
| ***rootBounds***         | 根元素的矩形区域信息，`getBoundingClientRect()`方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回`null` |
| ***target***             | 被观察的目标元素，是一个DOM节点对象                          |
| ***time***               | 可见性发生变化的时间                                         |




<center>
  <img style="border-radius: 0.3125em;
  box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
  src="http://www.ruanyifeng.com/blogimg/asset/2016/bg2016110202.png">
  <br>
  <div style="color:orange; border-bottom: 1px solid #d9d9d9;
  display: inline-block;
  color: #999;
  padding: 2px;">图片源自阮一峰大佬的博客</div>
</center>


<br>


### IntersectionObserverInit

```ts
interface IntersectionObserverInit {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}
```

***root***: 指定的root元素，用于检查target的可见性。必须是target的父级元素。默认为浏览器视窗。

***rootMargin***: root元素的外边距，类似于css中的margin属性。该属性值是**用作root元素和target发生交集时的计算交集的区域范围**，可以使用root margin来调整root元素边界的矩形。默认为0。

***threshold***: target和root相交达到该值的时候，IntersectionObserver注册的回调函数将被执行。如果你只是想要探测当target元素的在root元素中的可见性超过50%的时候，你可以指定该属性值为0.5。如果你想要target元素在root元素的可见程度每多25%就执行一次回调，那么你可以指定一个数组[0, 0.25, 0.5, 0.75, 1]。默认值是0。



### 交集的计算

所有区域均被Intersection Observer API 当作一个矩形看待。如果元素交集部分不是一个矩形，那么也会被看作是一个包含他所有交集区域的最小矩形。



<br>

<br>

## 案例演示

### [Scrollspy 滚动导航](https://codepen.io/bramus/pen/ExaEqMJ)

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="result" data-user="bramus" data-slug-hash="ExaEqMJ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Smooth Scrolling Sticky ScrollSpy Navigation">
  <span>See the Pen <a href="https://codepen.io/bramus/pen/ExaEqMJ">
  Smooth Scrolling Sticky ScrollSpy Navigation</a> by Bramus (<a href="https://codepen.io/bramus">@bramus</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<br><br>

### [页面下滑动画](<https://codepen.io/aderaaij/pen/oGwRvW>)

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="result" data-user="aderaaij" data-slug-hash="oGwRvW" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Intersection Observer API fun [Don't use in production]">
  <span>See the Pen <a href="https://codepen.io/aderaaij/pen/oGwRvW">
  Intersection Observer API fun [Don't use in production]</a> by Arden (<a href="https://codepen.io/aderaaij">@aderaaij</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<br><br>

### [图片懒加载](https://codepen.io/malchata/pen/YeMyrQ)

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="result" data-user="malchata" data-slug-hash="YeMyrQ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Lazy Loading with Intersection Observer Example">
  <span>See the Pen <a href="https://codepen.io/malchata/pen/YeMyrQ">
  Lazy Loading with Intersection Observer Example</a> by Jeremy Wagner (<a href="https://codepen.io/malchata">@malchata</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

<br><br>

### [无限滚动](<https://codepen.io/dimaZubkov/pen/QWWPWKx>)

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="result" data-user="dimaZubkov" data-slug-hash="QWWPWKx" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="IntersectionObserver">
  <span>See the Pen <a href="https://codepen.io/dimaZubkov/pen/QWWPWKx">
  IntersectionObserver</a> by Dima (<a href="https://codepen.io/dimaZubkov">@dimaZubkov</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

无限滚动时，最好在页面底部有一个页尾栏（sentinels），一旦页尾栏可见，就表示用户到达了页面底部，从而加载新的条目放在页尾栏前面。这样做的好处是，不需要再一次调用`observe()`方法，现有的`IntersectionObserver`可以保持使用。



<br>

<br>

## 参考文章

[IntersectionObserver API 使用教程](<http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html>)

[Intersection Observer - Web API 接口参考| MDN](<https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver>)



