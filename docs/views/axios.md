---
title: axios总结
date: 2020-04-27
categories:
  - JavaScript
tags:
  - 源码
---



axios本质上是通过Promise对原生XMLHttpRequest的封装，它具有以下特点

- 从浏览器中创建http请求
- 从node.js中创建http请求
- 支持Promise API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换JSON数据
- 客户端支持防御XSRF



## 从浏览器中创建http请求

浏览器中创建http请求主要是通过[XMLHttpRequest](<https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest>)对象。使用XHR对象可以与服务器进行交互，无需容整个页面信息刷新。


实现简易的XHR封装

实现步骤

1. 创建XHR对象
2. 初始化一个http请求，请求默认为异步请求
3. 设置请求的配置项
4. 设置事件处理函数
5. 发送http请求


::: demo
``` html
<template>
<div>
  <el-button>hello</el-button>
  <p id="placeholder"></p>
</div>
</template>
<script>
export default {
  methods: {
    request() {
      const xhr = new XMLHttpRequest()
      const url = 'http://free.ipwhois.io/json/8.8.4.4'
      xhr.open('get', url, true)
      xhr.onreadystatechange = () => {
        if (!xhr || xhr.readyState !== 4) {
          return
        }
        if (xhr.status === 0) {
          return
        }
        document.querySelector('#placeholder').innerText = `ip地址为${JSON.stringify(xhr.response.ip)}`
      }
      xhr.onerror = () => {
        console.log('request error')
      }
      xhr.onabort = () => {
        console.log('request abort')
      }
      xhr.ontimeout = () => {
        console.log('request timeout')
      }
      xhr.send(null)
    }
  },
}
</script>
```
:::


<https://juejin.im/post/5b0ba2d56fb9a00a1357a334#heading-16>


## 拦截请求和响应

axios的拦截机制类似于koa的洋葱模型
![img](/images/axios-interceptor-model.jpg)

先看一下axios测试用例中对interceptor的使用

**使用多个请求拦截器**

``` javascript
// https://github.com/axios/axios/blob/master/test/specs/interceptors.spec.js: 67
it('should add multiple request interceptors', function (done) {
    axios.interceptors.request.use(function (config) {
      config.headers.test1 = '1';
      return config;
    });
    axios.interceptors.request.use(function (config) {
      config.headers.test2 = '2';
      return config;
    });
    axios.interceptors.request.use(function (config) {
      config.headers.test3 = '3';
      return config;
    });

    axios('/foo');

  	// 在请求拦截器中为请求头添加的字段，在响应结果中都可以获取的到
    getAjaxRequest().then(function (request) {
      expect(request.requestHeaders.test1).toBe('1');
      expect(request.requestHeaders.test2).toBe('2');
      expect(request.requestHeaders.test3).toBe('3');
      done();
    });
  });
```



**使用多个响应拦截器**

```javascript
// https://github.com/axios/axios/blob/master/test/specs/interceptors.spec.js: 172
it('should add multiple response interceptors', function (done) {
    var response;

    axios.interceptors.response.use(function (data) {
      data.data = data.data + '1';
      return data;
    });
    axios.interceptors.response.use(function (data) {
      data.data = data.data + '2';
      return data;
    });
    axios.interceptors.response.use(function (data) {
      data.data = data.data + '3';
      return data;
    });

    axios('/foo').then(function (data) {
      response = data;
    });

  	// 在响应拦截器中对打data进行的修改，在响应结果中均得到了体现
    getAjaxRequest().then(function (request) {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      });

      setTimeout(function () {
        expect(response.data).toBe('OK123');
        done();
      }, 100);
    });
  });
```

所以通过以上案例可以了解到，拦截器的作用就是在真正的对请求做出处理的前后，实现对请求配置或响应结构的修改或做出相应的逻辑处理。



### 内部实现

**注册拦截器**

通过调用axios实例中对应的拦截器对象中的`use`方法，向axios中注册一个拦截器。

在axios中通过一个InterceptorManager来管理请求拦截和响应拦截，两个互不影响。

```javascript
class InterceptorManager {
  constructor() {
    this.handlers = []
  }

  use(resolved, rejected) {
    this.handlers.push({
      fulfilled,
      rejected
    })
    return this.handlers.length - 1
  }

  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null
    }
  }
}
```



**axios内部拦截器的逻辑处理**

请求拦截内容执行顺序优先于核心请求，响应拦截内容执行顺序在核心请求之后。

```javascript
class Axios {
  constructor() {
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
  }

	// 发起请求
  request(config) {
    // ...
    let promise = Promise.resolve(config)
    const chain = [{
      fulfilled: dispatchRequest,
      rejected: undefined
    }]

    // 请求拦截器类似于Stack结构，后进先出
    this.interceptors.request.handlers.forEach(interceptor => {
      if (interceptor !== null) {
        chain.unshift(interceptor);
      }
    })

    // 响应拦截器类似于Queue结构，先进先出
    this.interceptors.response.handlers.forEach(interceptor => {
      if (interceptor !== null) {
        chain.push(interceptor);
      }
    })

    // 把请求拦截内容插入到核心请求之前，将响应拦截内容插入到核心请求之后，然后依次执行
    while (chain.length) {
      const { fulfilled, rejected } = chain.shift();
      promise = promise.then(resolved, rejected);
    }

    return promise
  }
}
```

此外，在执行链中，为了保证后者调用的参数是前者处理之后的值，在拦截器中需要将请求配置或是响应内容作为结果返回出来，例如：

```javascript
  axios.interceptors.request.use(function (config) {
    config.headers.test1 = '1';
    return config;
  })

  axios.interceptors.response.use(function (data) {
    data.data = data.data + '1';
    return data;
  })
```

而保证这些方法执行顺序以及参数合理的传递的关键就在于Promise的使用。



### Promise

为了连续执行包括拦截请求和核心请求在内的多个方法，并且在上一个操作执行成功之后，带着上一步操作返回的结果，开始下一个操作。我们需要通过一个Promise链来实现这种需求。

在上述代码中，Axios类中的request方法中有一段这样的代码：

`let promise = Promise.resolve(config)`

`Promise.resolve`用于将现有对象转换为Promise对象，类似于`new Promise((resolve) => { resolve(args) })`。



将请求配置Promise化之后，便可以将成功回调和失败回调传入`then()`中，通过多次调用`then()`可以添加多个回调函数，它们会按照插入顺序执行。
