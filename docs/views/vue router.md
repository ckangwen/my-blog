## 前端路由与后端路由



路由这个概念最开始是在后端出现的，以前使用模板引擎开发页面的时候经常会看到这样的路径：`http://hometown.xxx.edu.cn/bbs/forum.php`

这就是所谓的SSR，通过服务端渲染，直接返回页面。



对于服务器而言，当接收到客户端发送的HTTP请求时，会根据请求的URL，来找到响应的映射函数并执行，然后将函数的返回值发送给客户端。

<br/>

这些路由方法指定了一个回调函数（有时称为 "处理函数"），当应用程序收到对指定路由（端点）和HTTP方法的请求时，就会被调用。换句话说，应用程序 "监听 "与指定路由和方法相匹配的请求，当它检测到一个匹配的请求时，它就会调用指定的回调函数。

以Express为例，通过使用express的`app`对象来定义路由，当路由方法检测到一个匹配的请求时，它就会调用指定的回调函数。

```javascript
var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})
```

<br/>

简单来说路由就是用来跟后端服务器进行交互的一种方式，通过不同的路径，来请求不同的资源.

<br/>

在 Ajax 还没有诞生的时候，路由的工作是交给后端来完成的，当进行页面切换的时候，浏览器会发送不同的 URL 请求，服务器接收到浏览器的请求时，通过解析不同的 URL 去拼接需要的 Html 或模板，然后将结果返回到浏览器端进行渲染。

服务器端路由同样是有利亦有弊。它的好处是安全性更高，更严格得控制页面的展现。另一方面，后端路由无疑增加了服务器端的负荷，并且需要 reload 页面，用户体验其实不佳。

有了 Ajax 后，用户交互就不用每次都刷新页面，体验带来了极大的提升。



而**异步交互体验的更高级版本就是我们熟知的 SPA，SPA 不单单在页面交互上做到了不刷新，而且在页面之间跳转也做到了不刷新**，为了做到这一点，就促使了前端路由的诞生。





## 前端路由的实现方式

对于客户端来说，路由的映射函数通常是进行一些DOM的显示和隐藏操作。这样，当访问不同的路径的时候，会显示不同的页面组件。所以需要解决两个问题

- 在页面不刷新的前提下实现url变化
- 捕捉到url的变化，执行路由映射函数



对此通常有两种实现方案：基于Hash的路由和基于History API的路由



url hash类似于`http://www.example.com/#/login`。hash仅仅是客户端的一个状态，hash值的变化不会使浏览器给服务器发送请求，不发送请求也就不会刷新页面。

每次 hash 值的变化，都会触发 `hashchange`事件，通过这个事件我们就可以知道 hash 值发生了哪些变化。然后我们便可以监听 hashchange 来实现更新页面部分内容的操作。

```javascript
window.onhashchange = function() {
  var hash = window.location.hash
  var path = hash.substring(1)

  switch (path) {
    case '/':
      showHome()
      break
    case '/users':
      showUsersList()
      break
    default:
      show404NotFound()
  }
}

```



<br>

之后，由于HTML5 标准发布，多了两个API，**pushState 和 replaceState，通过这两个 API 可以改变 url 地址且不会发送请求**。同时还有 **popstate 事件**。

我们可以通过监听 window 对象的 popstate 事件，来实现简单的路由

```javascript
window.onpopstate = function() {
  var path = window.location.pathname

  switch (path) {
    case '/':
      showHome()
      break
    case '/users':
      showUsersList()
      break
    default:
      show404NotFound()
  }
}

```

但是这种方法只能捕获前进或后退事件，无法捕获 pushState 和 replaceState，一种最简单的解决方法是替换 pushState 方法。

```javascript
var pushState = history.pushState
history.pushState = function() {
  pushState.apply(history, arguments)

  // emit a event or just run a callback
  emitEventOrRunCallback()
}

```

