(function () {
  'use strict';

  function isObject(obj) {
      return obj !== null && typeof obj === 'object';
  }
  function isNative(Ctor) {
      return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
  }

  function remove(arr, item) {
      if (arr.length) {
          var index = arr.indexOf(item);
          if (index > -1) {
              return arr.splice(index, 1);
          }
      }
  }
  function noop() { }
  var toString = Object.prototype.toString;
  var OBJECT_STRING = '[object Object]';
  function isPlainObject(obj) {
      return toString.call(obj) === OBJECT_STRING;
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasOwn = function (val, key) { return hasOwnProperty.call(val, key); };
  var emptyObject = Object.freeze({});
  function def(obj, key, val, enumerable) {
      Object.defineProperty(obj, key, {
          value: val,
          enumerable: !!enumerable,
          writable: true,
          configurable: true
      });
  }
  var warn = noop;
  var formatComponentName = function (vm) {
      if (vm.$root === vm) {
          return 'root instance';
      }
      var name = vm._isVue
          ? vm.$options.name || vm.$options._componentTag
          : vm.name;
      return name ? "component " + name : "anonymous component";
  };
  {
      var hasConsole_1 = typeof console !== undefined;
      var formatLocation_1 = function (str) {
          if (str === 'anonymous component') {
              str += " - use the \"name\" option for better debugging messages.";
          }
          return "(found in " + str + ")";
      };
      warn = function (msg, vm) {
          if (hasConsole_1) {
              console.warn('[Vue warn]: ' + msg + (vm ? formatLocation_1(formatComponentName(vm)) : ''));
          }
      };
  }
  var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) &&
      typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

  var uid = 0;
  var Dep = /** @class */ (function () {
      function Dep() {
          this.id = ++uid;
          this.subs = [];
      }
      Dep.prototype.addSub = function (sub) {
          this.subs.push(sub);
      };
      Dep.prototype.removeSub = function (sub) {
          remove(this.subs, sub);
      };
      /** 将自身(Dep)添加到Watcher */
      Dep.prototype.subscribe = function () {
          if (Dep.target) {
              Dep.target.addDep(this);
          }
      };
      /**
       * 依赖的对象发生了变化，通知依赖进行更新
       * 遍历Watcher实例数组，调用update方法
       * */
      Dep.prototype.notify = function () {
          var subs = this.subs.slice();
          for (var i = 0, l = subs.length; i < l; i++) {
              subs[i].update();
          }
      };
      return Dep;
  }());
  Dep.target = null;
  function pushTarget(target) {
      Dep.target = target;
  }
  function popTarget() {
      Dep.target = null;
  }

  var uid$1 = 0;
  var Watcher = /** @class */ (function () {
      function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
          this.vm = vm;
          this.cb = cb;
          this.deps = [];
          this.newDeps = [];
          this.depIds = new Set();
          this.newDepIds = new Set();
          this.id = ++uid$1;
          if (isRenderWatcher) {
              vm._watcher = this;
          }
          this.active = true;
          if (typeof expOrFn === 'function') {
              this.getter = expOrFn;
          }
          else {
              this.getter = parsePath(expOrFn);
              if (!this.getter) {
                  this.getter = noop;
                   warn("Failed watching path: \"" + expOrFn + "\" " +
                      'Watcher only accepts simple dot-delimited paths. ' +
                      'For full control, use a function instead.', vm);
              }
          }
          this.expression =  String(expOrFn) ;
          this.value = this.get();
      }
      Watcher.prototype.get = function () {
          pushTarget(this);
          var value = this.getter.call(this.vm, this.vm);
          if (this.deep) ;
          popTarget();
          this.cleanupDeps();
          return value;
      };
      Watcher.prototype.cleanupDeps = function () {
          var i = this.deps.length;
          while (i--) {
              var dep = this.deps[i];
              // 遍历deps，找出不在newDeps里的dep
              if (!this.newDepIds.has(dep.id)) {
                  dep.removeSub(this);
              }
          }
          // depIds
          var tmp = this.depIds;
          this.depIds = this.newDepIds;
          this.newDepIds = this.depIds;
          this.newDepIds.clear();
          tmp = this.deps;
          this.deps = this.newDeps;
          this.newDeps = tmp;
          this.newDeps.length = 0;
      };
      Watcher.prototype.addDep = function (dep) {
          var id = dep.id;
          /**
           * 在最新值获取完毕之后，newDepIds将会清空
           */
          if (!this.newDepIds.has(id)) { // 该依赖尚不存在，则添加
              this.newDepIds.add(id);
              this.newDeps.push(dep);
              if (!this.depIds.has(id)) {
                  dep.addSub(this);
              }
          }
      };
      Watcher.prototype.update = function () {
          // queueWatcher(this)
          this.run();
      };
      Watcher.prototype.run = function () {
          if (this.active) {
              /**
               * this.get()获取当前最新的值
               * 如果当前最新值与更新前的值(this.value)不一致，则需要更新this.value，并触发回调
               */
              var value = this.get();
              if (value !== this.value ||
                  isObject(value)) {
                  var oldValue = this.value;
                  this.value = value;
                  this.cb.call(this.vm, value, oldValue);
              }
          }
      };
      return Watcher;
  }());
  /******** helper *******/
  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
  var bailRE = new RegExp("[^" + unicodeRegExp.source + ".$_\\d]");
  function parsePath(path) {
      if (bailRE.test(path))
          return;
      var segments = path.split('.');
      return function (obj) {
          for (var i = 0; i < segments.length; i++) {
              if (!obj)
                  return;
              obj = obj[segments[i]];
          }
          return obj;
      };
  }

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);
  var methodsToPatch = [
      'push',
      'pop',
      'shift',
      'unshift',
      'splice',
      'sort',
      'reverse'
  ];
  methodsToPatch.forEach(function (method) {
      def(arrayMethods, method, function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          var result = arrayMethods[method].apply(this, args);
          // 获取到Observer实例
          var ob = this.__ob__;
          var inserted;
          // 对于新增的内容也要进行响应式转换，否则会出现修改数据时无法触发消息的问题
          switch (method) {
              case 'push':
              case 'unshift':
                  inserted = args;
                  break;
              case 'splice':
                  inserted = args.slice(2);
                  break;
          }
          if (inserted)
              ob.observeArray(inserted);
          ob.dep.notify(); // 数组改变之后，向依赖发送消息
          return result;
      });
  });

  var Observer = /** @class */ (function () {
      function Observer(value) {
          this.value = value;
          this.dep = new Dep();
          def(value, '__ob__', this);
          if (Array.isArray(value)) {
              value.__proto__ = arrayMethods;
              this.observeArray(value);
          }
          else {
              this.walk(value);
          }
      }
      Observer.prototype.walk = function (obj) {
          Object.keys(obj).forEach(function (key) {
              defineReactive(obj, key);
          });
      };
      Observer.prototype.observeArray = function (items) {
          items.forEach(function (item) {
              observe(item);
          });
      };
      return Observer;
  }());
  function observe(value) {
      if (!isObject(value))
          return;
      var ob;
      if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
          ob = value.__ob__;
      }
      else if ((Array.isArray(value) || isPlainObject(value)) &&
          Object.isExtensible(value)) {
          ob = new Observer(value);
      }
      return ob;
  }
  function defineReactive(obj, key, val, customSetter, shallow // 如果设置为true，则不会对val进行响应式处理，即只对obj的key属性的值响应式处理
  ) {
      var dep = new Dep();
      var property = Object.getOwnPropertyDescriptor(obj, key);
      if (property && property.configurable === false) {
          return;
      }
      var getter = property && property.get;
      var setter = property && property.set;
      val = val ? val : obj[key];
      var childOb = !shallow && observe(val);
      Object.defineProperty(obj, key, {
          enumerable: true,
          configurable: true,
          get: function reactiveGetter() {
              var value = getter ? getter.call(obj) : val;
              /**
               * Dep.target存放的是该对象(obj)的监听者，如果没有被监听，就不需要进行订阅
               * 所谓订阅就是将Dep实例存入Watcher实例的deps中
               */
              if (Dep.target) {
                  dep.subscribe();
                  // 如果子属性也被设置为响应式数据了, 将子属性的Watcher收集到Dep中
                  if (childOb) {
                      childOb.dep.subscribe();
                      if (Array.isArray(value)) {
                          dependArray(value);
                      }
                  }
              }
              return value;
          },
          set: function reactiveSetter(newVal) {
              var value = getter ? getter.call(obj) : val;
              if (newVal === value || (newVal !== newVal && value !== value)) {
                  return;
              }
              if ( customSetter) {
                  customSetter();
              }
              if (getter && !setter)
                  return;
              if (setter) {
                  setter.call(obj, newVal);
              }
              else {
                  val = newVal;
              }
              childOb = !shallow && observe(newVal);
              // 依赖变化后，触发更新，通知Dep类调用notify来触发所有Watcher对象的update方法更新对应视图
              dep.notify();
          }
      });
  }
  function dependArray(values) {
      values.forEach(function (value) {
          if (isObservable(value)) {
              value.__ob__.dep.depend();
          }
          if (Array.isArray(value))
              dependArray(value);
      });
  }
  function isObservable(value) {
      if (value && value.__ob__) {
          return true;
      }
      return false;
  }

  var Demo = /** @class */ (function () {
      function Demo() {
          var bar = {
              name: 'fafa',
              age: 20
          };
          this.bar = bar;
          observe(this.bar);
          this.foo = new Watcher(this, 'bar.name', function (val, oldVal) {
              console.log('current value', val, 'old value', oldVal);
          });
      }
      return Demo;
  }());
  var demo = new Demo();
  console.log("\u4FEE\u6539\u524D: " + demo.bar.name);
  demo.bar.name = 'sfdf';
  console.log("\u4FEE\u6539\u540E: " + demo.bar.name);

}());
