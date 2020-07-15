// https://github.com/xieranmaya/blog/issues/3
// https://juejin.im/post/5a30193051882503dc53af3c
const isFunction = obj => typeof obj === "function";

// promise的三种状态
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class MyPromise {
  constructor(executor) {
    if (!isFunction(executor)) {
      throw new Error("MyPromise must accept a function as a parameter");
    }

    // 设置初始状态为pending
    this.status = PENDING;
    this.value = undefined;
    this.fulfilledQueues = [];
    this.rejectedQueues = [];

    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }

  /**
   * 异步操作成功的处理函数
   * @param{any} val
   * */
  resolve(val) {
    const run = () => {
      // 状态只能由pending => fulfilled 或 pending => rejected
      if (this.status !== PENDING) return;

      //
      const runFulFilled = value => {
        let cb;
        // 依次执行成功队列中的函数，并清空队列
        // 在MyPromise.prototype.then 中会向fulfilledQueues中添加回调函数
        while ((cb = this.fulfilledQueues.shift())) {
          cb(value);
        }
      };
      const runRejected = error => {
        let cb;
        while ((cb = this.rejectedQueues.shift())) {
          cb(value);
        }
      };

      if (val instanceof MyPromise) {
        //  如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后，当前的Promise对象的状态才会改变
        // 当前的状态取决于参数Promise的状态
        val.then(
          value => {
            this.value = value;
            this.status = FULFILLED;
            runFulFilled(value);
          },
          error => {
            this.value = error;
            this.status = REJECTED;
            runRejected(error);
          }
        );
      } else {
        this.value = val;
        this.status = FULFILLED;
        runFulFilled(val);
      }
    };

    setTimeout(run, 0);
  }
  reject(err) {
    if (this.status !== REJECTED) return;

    const run = () => {
      this.status = REJECTED;
      this.value = err;
      let cb;
      while ((cb = this._rejectedQueues.shift())) {
        cb(err);
      }
    };

    setTimeout(run, 0);
  }

  then(onFulfilled, onRejected) {
    const { value, status } = this;
    // 根据Promise A+规范，then方法需要返回一个Promise
    return new MyPromise((onFulfilledNext, onRejectedNext) => {
      // 成功时执行的回调函数
      let fulfilled = value => {
        try {
          // resolve返回的不是一个函数，则将该对象(包括undefined)返回给then中的onFulfilled
          if (!isFunction(onFulfilled)) {
            onFulfilledNext(value);
          } else {
            // 执行该成功回调
            let res = onFulfilled(value);
            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext);
            } else {
              // 将回调函数执行结果返回给then中的onFulfilled
              onFulfilledNext(res);
            }
          }
        } catch (e) {
          // 出现异常，将异常传给onRejected
          onRejectedNext(e);
        }
      };

      // 失败时执行的回调函数
      // 与fulfilled的情况一致
      let rejected = error => {
        try {
          if (!isFunction(onRejected)) {
            onRejectedNext(error);
          } else {
            let res = onRejected(error);
            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext);
            } else {
              onFulfilledNext(res);
            }
          }
        } catch (e) {
          onRejectedNext(e);
        }
      };

      // 在执行then之前，异步操作的状态已经通过resolve或reject改变了
      // 在此需要判断当前所属状态，来执行不同的回调函数
      switch (status) {
        // 如果状态pending，则可能是上一个then方法，通过方法链将一个新的Promise传给了下一个then
        // 那么将传入then的onFulfilled和onRejected放到异步操作处理函数队列中，等待resolve或reject处理
        case PENDING: {
          this.fulfilledQueues.push(fulfilled);
          this.rejectedQueues.push(rejected);
          break;
        }
        // 状态已经由pending转换为fulfilled，则执行成功回调
        // 参数是executor中resolve的值
        case FULFILLED: {
          fulfilled(value);
          break;
        }
        case REJECTED: {
          rejected(value);
          break;
        }
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(cb) {
    return this.then(
      value => MyPromise.resolve(cb()).then(() => value),
      reason =>
        MyPromise.resolve(cb()).then(() => {
          throw reason;
        })
    );
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  }

  static reject(value) {
    return new MyPromise((_, reject) => reject(value));
  }

  static all(iterable) {
    return new MyPromise((resolve, reject) => {
      let values = [];
      let count = 0;
      // 获取可迭代对象的索引和值
      for (let [i, p] of iterable.entries()) {
        // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
        this.resolve(p).then(
          res => {
            values[i] = res;
            count++;
            // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
            if (count === iterable.length) resolve(values);
          },
          err => {
            // 有一个被rejected时返回的MyPromise状态就变成rejected
            reject(err);
          }
        );
      }
    });
  }

  static race(list) {
    return new MyPromise((resolve, reject) => {
      for (let p of list) {
        // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
        this.resolve(p).then(
          res => {
            resolve(res);
          },
          err => {
            reject(err);
          }
        );
      }
    });
  }
}
