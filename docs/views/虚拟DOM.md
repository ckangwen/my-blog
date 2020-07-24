---
title: 认识useEffect
date: 2020-04-22
categories:
  - 其他
tags:
  - 面试
---

## 为什么需要Virtual DOM

浏览器在DOM更改时必须执行的布局。每次DOM更改时，浏览器都需要重新计算CSS，进行布局并重新绘制网页，这需要大量时间。



Virtual DOM是对DOM的抽象,本质上是JavaScript对象,这个对象就是更加轻量级的对DOM的描述。

频繁变动DOM会造成**浏览器的回流或者重绘**，在性能上会有所影响。因此我们需要这一层抽象，在patch过程中尽可能地一次性将差异更新到DOM中，这样保证了DOM不会出现性能很差的情况。

其次，现代前端框架的一个基本要求就是无须手动操作DOM，一方面是因为手动操作DOM无法保证程序性能，多人协作的项目中如果review不严格，可能会有开发者写出性能较低的代码，另一方面更重要的是省略手动DOM操作可以大大提高开发效率。

<br/>

如果没有 Virtual DOM，简单来说就是直接重置 innerHTML。这样操作，在一个大型列表所有数据都变了的情况下，还算是合理，但是，当只有一行数据发生变化时，它也需要重置整个 innerHTML，这时候显然就造成了大量浪费。

比较 innerHTML 和 Virtual DOM 的重绘过程如下：

- **innerHTML**: 渲染HTML字符串+ 重新创建所有 DOM 元素

- **Virtual DOM**: 渲染Virtual DOM + diff + 必要的 DOM 更新

和 DOM 操作比起来，js 计算是非常便宜的。Virtual DOM render + diff 显然比渲染 html 字符串要慢，但是，它依然是纯 js 层面的计算，比起后面的 DOM 操作来说，依然便宜了太多。



Virtual Dom在找到最小更新视图，最后批量更新到真实DOM上

![2](https://user-gold-cdn.xitu.io/2017/5/16/39eac671c7fae8f73917ba1e6d06daa8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)





很多人认为虚拟 DOM 最大的优势是 diff 算法，减少 JavaScript 操作真实 DOM 的带来的性能消耗。虽然这一个虚拟 DOM 带来的一个优势，但并不是全部。虚拟 DOM 最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的 DOM，可以是安卓和 IOS 的原生组件，可以是近期很火热的小程序，也可以是各种GUI。