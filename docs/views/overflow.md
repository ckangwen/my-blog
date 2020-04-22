---
title: Overflow属性
date: 2020-04-22
categories:
  - CSS
tags:
  - CSS
---

指定除`visible`以外的值将创建一个新的块级格式化上下文。

overflow指定除visible以外的值将创建一个新的块级格式化上下文。

**为了使`overflow`有效果，块级元素必须有一个指定的高度(`height`或`min-height`)或者将`white-space`设置为`nowrap`。**

> 设置一个轴为`visible`，同时设置另一个轴为不同的值，将会导致设置`visible`的轴的行为变为`auto`。
>
> 及时将overflow设置为hidden，也可以使用`Element.scrollTop`属性来滚动HTML元素。

- visible: 默认值
- hidden: 裁剪
- scroll: 滚动条区域一直存在
- auto: 不足以滚动时没有滚动条，可以滚动时滚动条出现



当因子元素内容超出容器宽高时，裁剪的边界是border box的内边缘，而给padding box的内边缘。
<div style="width: 100px;height: 100px;background-color: #ccc;overflow: hidden;border: 10px solid orange;margin: 10px;padding: 10px;">
  <div style="width: 150px;height: 150px;
background-color: #000;"></div>
</div>
```html
  <div class="a">
    <div class="b"></div>
  </div>
```

```css
  .a {
    width: 100px;
    height: 100px;
    background-color: #ccc;
    overflow: hidden;
    border: 10px solid orange;
    margin: 10px;
    padding: 10px;
  }
  .b {
    width: 150px;
    height: 150px;
    background-color: #000;
  }
```



> 外层容器的边框为橙色，背景颜色为灰色，内部容器的背景颜色为黑色。

因此如果要实现元素裁剪的同时留有一定的间隙的效果的话，使用内边距padding属性是无能为力的，可以在外部容器上使用透明边框达到此效果。



## overflow与滚动条

HTML中有标签是默认可以产生滚动条的，一个是根元素html，另一个是文本域textarea。之所以可以出现滚动条是因为这两个标签的overflow属性时默认为auto。



在PC端，浏览器的默认滚动条来自与html，而不是body标签。所以如果要去除页面默认滚动条时，只需要`html { overflow: hidden }`。



滚动条会占用容器的可用宽度或高度，在windows系统中滚动栏占据的宽度为17px。

这种滚动栏占据宽度的特性带来的最大问题就是页面加载的时候水平居中的布局可能会产生晃动，因为窗体默认是没有滚动条的，而HTML内容是自上而下加载的，就会发生一开始没有滚动条，而后突然出现滚动条的情况，此时页面的可用宽度发生变化，水平居中重新计算，导致页面发生晃动。

比较简单的做法是设置如下CSS

```css
html {
  overflow-y: scroll;
}
:root {
  overflow-x: hidden;
  overflow-y: auto;
}
:root body {
  position: absolute;
}
body {
  widthL 100vw;
  overflow: hidden;
}
```



其他的解决方式: [overflow:hidden引起的页面晃动问题](<https://juejin.im/post/5af9758651882542845229f2>)



滚动条是可以自定义的，在支持-webkit-前缀的浏览器中可以使用如下属性

- -webkit-scrollbar：整体部分
- -webkit-scrollbar-button：两端按钮
- -webkit-scrollbar-track：外层轨道
- -webkit-scrollbar-track-piece：内层轨道
- -webkit-scrollbar-thumb：滚动滑块
- -webkit-scrollbar-corner：边角

常用css样式

```css
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, .3);
      border-radius: 6px;
    }
    ::-webkit-scrollbar-track {
      background-color: #ddd;
      border-radius: 6px;
    }
```

![custom-scrollbar.png](https://i.loli.net/2020/04/22/MxOBqG4tV6YRswI.png)



参考文章

[MDN](<https://developer.mozilla.org/zh-CN/docs/Web/CSS/overflow>)

CSS世界——张鑫旭



