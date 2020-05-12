import InterceptorManager from './InterceptorManager.js'
import diapatchRequest from './diapatchRequest.js'

class Axios {
  constructor() {
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
  }

  request(url) {
    // 返回一个带着给定值解析过的Promise对象
    let promise = Promise.resolve(url)
    const chain = [
      {
        fulfilled: diapatchRequest,
        rejected: null
      }
    ]

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

    while (chain.length) {
      const { fulfilled, rejected } = chain.shift()
      // promise.then返回一个Promise对象，可以继续处理链上的拦截器
      promise = promise.then(fulfilled, rejected)
    }

    return promise
  }
}

export default new Axios()
