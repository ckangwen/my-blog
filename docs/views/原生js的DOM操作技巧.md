

## class操作
**添加**: `el.classList.add(token1[, token2[, ...tokenN]])`
**删除**: `el.classList.remove(token1[, token2[, ...tokenN]])`
**判断是否存在**: `el.classList.contains(token)`
**替换**: `el.classList.replace(oldToken, newToken)`
**toggle**: `el.classList.toggle(token)`
**获取DOM的全部类名**: `el.classList.value`

[源自MDN](<https://wiki.developer.mozilla.org/zh-CN/docs/Web/API/DOMTokenList>)



## 只允许输入特定字符

```javascript
const input = document.querySelector('.input')
input.addEventListener('input', handler)

let currentValue = input.value || ''
function handler(e) {
  const { target } = e
  const numAndSpceOnlyReg = /^[0-9\s]*$/
  if (numAndSpceOnlyReg.test(target.value)) {
    currentValue = target.value
  } else {
    target.value = currentValue
    // 从一个被 focused 的 <input> 元素中选中特定范围的内容。
    target.setSelectionRange(target.selectionStart, target.selectionEnd)
  }
}
```



## 将事件处理程序附加到其他处理程序中

通常，有许多事件处理程序可为不同的元素处理不同的事件。这些事件可能相互依赖。

例如当用户单击按钮时，我们将在屏幕中央打开一个模态框。可以通过按Escape键关闭模态框。

这里有两个事件处理程序，click和keydown事件。

该`onKeyEscape`处理器依赖`onClick`，因为我们只有在模态框已经打开之后才需要检查按键。添加标记以跟踪模式是否打开的一种常见方法：

```javascript
  const btn = document.querySelector('.btn')
  const alert = document.querySelector('.alert')
  let opened = false
  function onClick(e) {
    opened = true
    alert.classList.remove('hide')
  }
  function onKeyEscape(e) {
    if (e.keyCode === 27) {
      console.log(22)
      if (opened) {
        alert.classList.add('hide')
      }
    }
  }
  btn.addEventListener('click', onClick)
  window.addEventListener('keydown', onKeyEscape)
```

但是随着元素的增加，会有跟多的事件，若还是用标记来记录，那么代码将会难以维护。

替代的方法就是在依赖的事件处理程序中添加所需的事件处理函数。

```javascript
    function onClick(e) {
      window.addEventListener('keydown', onKeyEscape)
      alert.classList.remove('hide')
    }
    function onKeyEscape(e) {
      if (e.keyCode === 27) {
          alert.classList.add('hide')
      }
    }
    btn.addEventListener('click', onClick)
```



## 计算鼠标相对于事件源的位置

```javascript
  function onClick(e) {
    const { target } = e
    const rect = target.getBoundingClientRect()
    // clientY: 鼠标位置相对于视口的位置
    const x = e.clientY - rect.top
    const y = e.clientX - rect.left
  }
```



## 两个元素的相对距离

```javascript
const elRect = el.getBoundingClientRect();
const targetRect = el.getBoundingClientRect();

const top = elRect.top - targetRect.top;
const left = elRect.left - targetRect.left;
```



## 元素相对于整个文档的距离

```javascript
const rect = el.getBoundingClientRect();


const top = rect.top + document.body.scrollTop;
const left = rect.left + document.body.scrollLeft;
```



## 计算滚动条的大小

1. offsetWidth与clientWidth的差值

`offsetWidth` 表示元素实际占用的宽度，包括其边框，内边距和元素内容

`clientWidth` 表示元素的内部宽度。该属性包括内边距，不包括垂直滚动条、边框和外边距。

```javascript
const scrollbarWidth = document.body.offsetWidth - document.body.clientWidth;
```



2. 使用假元素

创建两个假`div`元素，其中一个是另一个的子元素。然后计算它们之间的宽度之差。

```javascript
const calculateScrollbarWidth = function() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    
    // Append it to `body`
    document.body.appendChild(outer);

    // Create the child element
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculate the difference between their widths
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Remove the parent element
    document.body.removeChild(outer);

    return scrollbarWidth;
};
```



## 检查一个元素是否是另一个元素的子元素

1. contains方法

```javascript
const isDescendant = parent.contains(child)
```

2. 从子元素上溯

```javascript
const isDescendant = function(parent, child) {
    let node = child.parentNode;
    while (node) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }

    return false
}
```



## 检查元素是否在视口中

```javascript
const isInViewport = function(ele) {
    const rect = ele.getBoundingClientRect()
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
```



## 检查元素是否可以滚动

```javascript
  function isScrollable(el) {
    const hasScrollableContent = el.scrollHeight > el.clientHeight

    const overflowYStyle = window.getComputedStyle(el).overflowY
    const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1
    return hasScrollableContent && !isOverflowHidden
  }
```



## 检查滚动元素在可滚动容器中是否可见

```javascript
  function isVisible (el, container) {
    const elTop = el.offsetTop;
    const elBottom = elTop + el.clientHeight;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    return (elTop >= containerTop && elBottom <= containerBottom) ||
      (elTop < containerTop && containerTop < elBottom) ||
      (elTop < containerBottom && containerBottom < elBottom);
  }
```



## 计算文本框内的字符数

```javascript
const maxlen = textarea.getAttribute('maxlength')
function onInput(e) {
  const { target } = e
  let len = target.value.length
  text.innerHTML = `${len}/${maxlen}`
}
textarea.addEventListener('input', onInput)
```



## document加载之后执行

```javascript
function ready(callback) {
 	document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", callback) : callback()
}
```



## 获取指定元素的CSS样式

```javascript
const style = window.getComputedStyle(el, null)

style.color
style.backgroundColor
style['-webkit-text-size-adjust']
style.getPropertyValue('color')
```

[Window.getComputedStyle MDN](<https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle>)



## 防止元素被选中

例如在鼠标拖动过程中不想要其他的文本被选中

```javascript
  document.onselectstart = () => false
```



## 获取所选文本

```javascript
const selectedText = window.getSelection().toString();
```



## 动态加载css、js文件

```javascript
const link = document.createElement('link')
link.setAttribute('rel', 'stylesheet')
link.setAttribute('href', '/path/to/js/file.css')

const script = document.createElement('script')
script.src = '/path/to/js/file.js'

document.head.appendChild(link);
```

**按顺序加载多个JavaScript文件**

```javascript
function loadScriptsInOrder(array) {
  const promises = array.map(url => {
    return loadScript(url)
  })
  
  return waterfall(promises)
}

function loadScript(url) {
  return new Promise((reslve, reject) => {
    const script = document.createElement('script')
    script.src = url
    
    script.addEventListener('load', () => {
      resolve(true)
    })
    document.head.appendChild(script)
  })
}

function waterfall(promises) {
  return promises.reduce(
    (p, c) => {
      return p.then(() => {
        return c.then((result) => {
          return true
        })
      })
    },
    Promise.resolve([])
  )
}
```



