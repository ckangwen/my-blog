---
title: BFC-块格式化上下文
date: 2020-04-22
categories:
  - CSS
tags:
  - CSS
---

# BFC 块格式化上下文



块格式上下文(Block Formatting Context)是Web页面的可视化CSS渲染的一部分，是块盒子布局创建过程发生的区域，也是浮动元素与其他元素交互的位置。相对应的还有IFC(Inline Formatting Context)。

如果一个元素具有BFC，**外部元素将不会受到内部子元素的影响**。所以BFC是不会发生margin重叠的，因为margin重叠会影响外部的元素；BFC元素可以用来清除浮动带来的影响，因为如果不清除，子元素浮动则父元素高度塌陷，必然会影响后面元素的布局和定位，这不符合BFC元素的子元素不会影响外部元素的设定。



触发BFC的几种情况：

- `<html>`根元素
- `float`的值不为`none`
- 行内块元素
- 表格单元格
- `overflow`值不为`visible`的块元素
- `display`值为`flow-root`、`table-caption`或`inline-block`
- `position`的值不为`ralative`和`static`

换而言之，只要元素满足以上任意条件，就无需使用`clear: both`属性去清除浮动带来的影响了。



## BFC与流体布局

BFC最重要的功能不是防止margin重叠或是清除float的影响，而是实现更加健的自适应布局。


<BFCDemo />

左侧的区域显然受到了float属性值的影响而脱离了文档流，此时如果给父元素设置具有BFC特性的属性，那么根据BFC的表现原则，具有BFC特性的元素的子元素不会受到内部元素的影响，也不会影响外部元素，于是父元素为了不和浮动元素产生任何交集，顺着浮动边缘形成自己的封闭上下文。

也就是说普通流体元素在设置了`overflow: hidden`之后，会自动填满容器中处了浮动元素之外的剩余空间，形成自适应布局效果，即使浮动元素的尺寸大小发生变化，右侧自适应内容都可以自动填满剩余空间。

```html
<div class="bfc">
  <div class="left"></div>
  <div class="bfc"></div>
</div>
```

```css
.left {
  float: left;
}
.bfc {
  overflow: 'hidden';
}
```



<BFCDemo2 />








