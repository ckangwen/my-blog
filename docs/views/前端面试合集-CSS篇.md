---
title: 前端面试合集-CSS篇
date: 2020-07-19
categories:
  - 其他
tags:
  - 面试
---

### link与@import的区别

1. link属于HTML标签，而@import是CSS提供
2. 页面被加载的时，link会同时被加载，而@import引用的CSS会等到页面被加载完成再加载
3. import只在IE5以上才能识别，而link是HTML标签，无兼容问题



### position的absolute与fixed异同

A. 共同点

1. 改变行内元素的呈现方式，display被设置为inline-block
2. 让元素脱离普通流，不占据空间
3. 默认会覆盖到非定位元素上

B. 不同点

absolute的”根元素“是可以设置的，而fixed的”根元素“固定为浏览器窗口。

当你滚动网页，fixed元素与浏览器窗口之间的距离是不变的。



### CSS盒模型

标准W3C盒模型：width = content

IE盒模型：width = content + padding + border

CSS盒模型的默认定义中，一个元素的`width`或`height`不会包含的`border`或`padding`，即元素默认应用IE盒模型。

通过`box-sizing`可以改变元素的元素盒模型的表现，默认值是`content-box`表示IE盒模型，`border-box`表示标准盒模型。

因为若不声明DOCTYPE类型，IE浏览器会将盒子模型解释为IE盒子模型，FireFox等会将其解释为W3C盒子模型；若在页面中声明了DOCTYPE类型，所有的浏览器都会把盒模型解释为W3C盒模型



### CSS权重

**从代码所处的位置来看CSS权重优先级**： 内嵌样式 > 内部样式表 > 外部样式

**从样式选择器来看CSS权重优先级**：`!important` > 内嵌样式 > ID选择器（`#id`） > class选择器（`.class`） > 标签、伪类、属性选择器 > 伪元素 > 通配符（`*`） > 继承。









### 常见CSS3新特性

**边框**

border-radius圆角边框

box-shadow边框阴影

border-image边框图片

文本

text-shadow文本阴影

2D

transform：translate scale rotate skew

3D

translate：rotateX rotateY

多背景 rgba

线性渐变 gradient

媒体查询 多栏布局



### block，inline和inlinke-block细节对比

**display:block**

- block元素会独占一行，多个block元素会各自新起一行。默认情况下，block元素宽度自动填满其父元素宽度。
- block元素可以设置width,height属性。块级元素即使设置了宽度,仍然是独占一行。
- block元素可以设置margin和padding属性。

**display:inline**

- inline元素不会独占一行，多个相邻的行内元素会排列在同一行里，直到一行排列不下，才会新换一行，其宽度随元素的内容而变化。
- inline元素设置width,height属性无效。
- inline元素的margin和padding属性，水平方向的padding-left, padding-right, margin-left, margin-right都产生边距效果；但竖直方向的padding-top, padding-bottom, margin-top, margin-bottom不会产生边距效果。

**display:inline-block**
简单来说就是将对象呈现为inline对象，但是对象的内容作为block对象呈现。



### 清除浮动的方式

清除浮动可以理解为清除浮动产生的影响。当元素浮动时也就是为当前元素创建了块格式化上下文（BFC），会对周围的元素或者父元素在布局上会产生一定的影响，比如：父元素因无法自动计算高度而产生的高度塌陷；因脱离文档流而使兄弟元素错位等

1. 伪类

   ```CSS
   .clearfix:after{
     content: ""; 
     display: block; 
     height: 0; 
     clear: both; 
     visibility: hidden;  
     }
   ```

   使用自带的属性可以非常好的解决浮动影响。该方法直观有效，哪里需要清除就在哪里添加一个兄弟元素，设置 `clear` 属性即可，一般属性值都设置为 `both` 清除两侧的浮动，也可以根据实际需要清除左侧或右侧，灵活方便直观

2. 父级设置`overflow:auto`(使用`zoom: 1`用于兼容IE)，触发BFC机制

   设置父元素的高度解决的是元素浮动产生的父元素高度塌陷问题，其内部元素浮动影响并未彻底清除，且需要进行计算然后再设置，比较固定，一旦子元素的高度发生改变，父元素的高度也需要再次计算设置，不够灵活。除非内容高度固定一成不变，否则不推荐使用。

3. 设定父级元素的高度或跟父级跟着浮动

4. 使用空标签清除浮动`clear:both`（缺点，增加无意义的标签）





### px、em、rem、vh(vw)、%的区别

**px**

px像素，绝对单位，**根据显示器屏幕分辨率而言的**。

**em**

em是相对长度单位，相对于当前对象内文本的字体尺寸，如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。

特点

- em的值并不是固定的
- em会继承父级元素的字体大小。所以如果一个设置了`font-size:1.2em`的元素包含一个设置了`font-size:1.2em`的元素，那么里面的元素字体大小为1.2 * 1.2 = 1.44rem

> 任意浏览器的默认字体高都是16px，那么1em=16px

**rem**

rem是CSS3新增的一个对象单位，相对于HTML根元素的字体尺寸

**vh**

vh是视口单位，1vh = 视口高度的1%

![img](https://user-gold-cdn.xitu.io/2017/9/7/19e9d8cbf9d77d959a8741327dadd3de?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

如果浏览器视口尺寸为370px,那么 1vw = 370px * 1% = 6.5px

**%**

一般宽泛的讲是相对于父元素，但是并不是十分准确。

- 对于普通定位元素就是父元素
- 对于position: absolute;的元素是相对于已定位的父元素
- 对于position: fixed;的元素是相对于 ViewPort（可视窗口）





### BFC

块级格式上下文是页面中的一块渲染区域。**具有 BFC 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素。**

BFC在计算高度时，内部浮动元素的高度也要计算在内

**创建规则**

- 根元素
- `float`不为`none`
- `position`取值为`absolute`或`fixed`
- `overflow`不是`visible`的元素
- `display`取值为`inline-block`,`table-cell`, `table-caption`,`flex`, `inline-flex`之一的元素

**作用**

- 可以包含浮动元素
- 不被浮动元素覆盖
- 阻止父子元素的`margin`重叠



### css sprite

css sprite是将多个小图片拼接到一个图片中，通过`background-position`和元素尺寸调节需要显示的背景图片。

**优点**

- 减少HTTP请求数，提高页面的加载速度
- 提高压缩比，减少图片大小
- 更换风格方便

**缺点**

- 图片合并麻烦
- 维护麻烦，修改一个图片可能需要重新布局整个图片，样式



### `display: none;`与`visibility: hidden;`的区别

它们都能让元素不可见

**区别**

- `display: none`会让元素完全从渲染树中消失，渲染的时候不会占据任何的空间，而`visibility: hidden`只是内容不可见，渲染时依旧会占据空间
- `display: none`是非继承属性，即使修改子元素的`display`属性也不会让元素再次显示；`visibility: hidden`是继承属性，子孙节点通过设置`visibility: visible`可以让子孙节点显式
- 修改元素的`display`会造成文档重排，而修改`visibility`属性只会造成本元素的重绘。



### 什么是FOUC?如何避免

Flash Of Unstyled Content，用户定义样式表加载之前，浏览器使用默认样式显示文档，用户样式加载渲染之后再重新显示文档，造成页面闪烁

解决办法：把样式表放在文档的`head`



### display:inline-block 什么时候不会显示间隙？(携程)

- 移除空格
- 使用`margin`负值
- 使用`font-size:0`
- `letter-spacing`
- `word-spacing`

