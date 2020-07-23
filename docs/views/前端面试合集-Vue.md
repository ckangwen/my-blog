---
title: 前端面试合集-Vue篇
date: 2020-07-23
categories:
  - 其他
tags:
  - 面试
---


## Vue生命周期

Vue的生命周期指的是Vue实例从创建到销毁的过程。从开始创建、初始化数据、编译模版、挂载DOM、渲染，更新，销毁等一系列的过程。

**beforeCreate**

实例初始化之后，this指向创建的实例，不能访问到data、computed、watch、methods上的方法和数据。

常用于初始化非响应式变化

**created**

实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到$el属性，$ref属性内容为空数组。

常用于简单的ajax请求，页面的初始化。

**beforeMount**

在挂载开始之前调用，会找到对于的template并编译成render函数

**mounted**

实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，$ref属性可以访问

常用于获取VNode信息和操作，ajax请求

**beforeupdate**

响应式数据更新时调用，发生在虚拟DOM打补丁(patch)之前

适合在更新之前访问现有的DOM，比如手动移除已添加的事件监听器

**updated**

虚拟 DOM 重新渲染和打补丁之后调用，组件DOM已经更新，可执行依赖于DOM的操作

应避免在此步骤中操作数据，可能造成死循环

**beforeDestroy**

实例销毁之前调用。这一步，实例仍然完全可用，this仍能获取到实例

常用于销毁定时器、解绑全局事件、销毁插件对象等操作

**destroyed**

实例销毁之后调用，执行后Vue实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁

<br/>

created阶段的ajax请求与mounted请求的区别：前者页面视图尚未出现，如果请求信息过多，页面会长时间处于白屏状态

*mounted*时不是所有子组件都一起被挂载，如果希望整个视图都渲染完毕，可以使用`vm.$nextTick`



## vue常用指令

v-for、v-if(v-else)、v-bind、v-on、v-show



## vue常用修饰符

.prevent 提交事件时不再重新加载页面

.stop 阻止事件冒泡

.self 只当在 event.target 是当前元素自身时触发处理函数

.capture 添加事件监听器时使用事件拨火模式



## v-show与v-if的区别

v-if与v-show都可以动态控制dom元素显示隐藏

v-show仅仅控制元素的显示方式，将display属性在none和block之前切换，而v-if会控制这个DOM节点的存在与否。

当我们需要经常切换某个元素的显示/隐藏时，使用v-show会更加节省性能上的开销；当只需要一次显示或隐藏时，使用v-if更加合理。



## 简述Vue响应式原理

Vue 将遍历此对象`data`的所有属性，使用 [`Object.defineProperty`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 把这些属性全部转为getter/setter。这样可以在属性被访问和修改时通知变更。

每个组件实例都对应一个 **watcher** 实例，它会在组件渲染的过程中把“接触”过的数据属性记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。



## computed、method、watch 的区别

计算属性就是根据一定的逻辑，将一个新属性与打他数据的某个属性进行关联，由此获取与原属性对一个的值。

计算属性只有在相关响应式依赖发生变化时才会重新求值(如果不是响应式依赖则永远不再更新)，所以说**计算属性是基于它们的响应式依赖进行缓存的**。相比之下，每当重新触发渲染时，方法将总会再次执行。

watch适用于响应已经发生的更改并执行相应的操作。想要执行异步或昂贵的操作以响应不断变化的数据时，这是最有用的。

watch在初始化页面的时候不回去执行属性监听，只有在监听的对象发生改变时才会执行监听。如果要立刻执行，就需要使用到`immediate`，将`immediate`设置为`true`，并在`handler`中做逻辑处理。



为了发现对象内部值的变化，还可以指定 `deep: true`，深度监听某个对象的值。监听数组的变动不需要这么做

<br/>

**三者的加载顺序**

computed是在HTML DOM加载之后马上执行的，如赋值操作

methods必须要有一定的触发条件才能执行，如点击事件

watch在vue实例上数据发生变动后执行



**computed应用场景**

1. 适用于一些重复使用数据或复杂或费时的运算，利用computed将运算结果进行缓存，下次就可以直接获取了
2. 我们需要的数据依赖于其他的数据

**computed与method的区别**

1. computed是基于响应式依赖来进行缓存的，只有在响应式依赖发生改变时它们才会重新求值。但是methods方法中是每次调用, 都会执行函数的, methods它不是响应式的。
2. computed中的成员可以只定义一个函数作为只读属性, 也可以定义成 get/set变成可读写属性, 但是methods中的成员没有这样的。

**watch的使用场景**

1. 当data中的某个数据发生变化时，我们需要做一些操作，或者当需要在数据变化时执行异步或开销较大的操作时. 我们就可以使用watch来进行监听。

**watch与computed的区别**

- 两者都是观察页面数据变化的
- computed只有当依赖的数据变化时才会计算, 当数据没有变化时, 它会读取缓存数据。
- watch每次都需要执行函数。watch更适用于数据变化时的异步操作。



## 怎样理解单向数据流

父组件是通过 prop 把数据传递到子组件的，但是这个 prop 只能由父组件修改，子组件不能修改，否则会报错。子组件想修改时，只能通过 $emit 派发一个自定义事件，父组件接收到后，由父组件修改



## 什么是双向绑定

双向绑定是指数据模型（Module）和视图（View）之间的双向绑定。

其原理是采用数据劫持结合发布者-订阅者模式的方式来实现。

Vue中先遍历data选项中所有的属性（发布者）用`Object.defineProperty`劫持这些属性将其转为getter/setter。读取数据时候会触发getter。修改数据时会触发setter。

然后给每个属性对应new Dep()，Dep是专门收集依赖、删除依赖、向依赖发送消息的。先让每个依赖设置在`Dep.target`上，在Dep中创建一个依赖数组，先判断`Dep.target`是否已经在依赖中存在，不存在的话添加到依赖数组中完成依赖收集，随后将`Dep.target`置为上一个依赖。

组件在挂载过程中都会new一个Watcher实例。这个实例就是依赖（订阅者）。Watcher第二参数式一个函数，此函数作用是更新且渲染节点。在首次渲染过程，会自动调用Dep方法来收集依赖，收集完成后组件中每个数据都绑定上该依赖。当数据变化时就会在seeter中通知对应的依赖进行更新。在更新过程中要先读取数据，就会触发Wacther的第二个函数参数。一触发就再次再次自动调用Dep方法收集依赖，同时在此函数中运行patch（diff运算)来更新对应的DOM节点，完成了双向绑定。





## keep-alive

keep-alive是Vue内置的一个组件，可以时被包含的组件保留状态或避免重新渲染。

其有三个参数

- `include`：定义会缓存的组件
- `exclude`：不会缓存的组件
- `max`：最多可以缓存多少组件实例。一旦这个数字达到了，在新实例被创建之前，已缓存组件中最久没有被访问的实例会被销毁掉；

`include`和`exclude`可以是逗号分隔字符串、正则表达式或一个数组,`include="a,b"`、`:include="/a|b/"`、`:include="['a', 'b']"`；

匹配首先检查组件自身的 name 选项，如果 name 选项不可用，则匹配它的局部注册名称 。匿名组件不能被匹配；

当组件在内被切换，它的activated和deactivated这两个生命周期钩子函数将会被对应执行

## key值的作用

在开发过程中，我们需要保证某个元素的 key 在其同级元素中具有唯一性。在 Diff 算法中 会借助元素的 Key 值来判断该元素是新近创建的还是被移动而来的元素，从而减少不必要的元素重渲染。



## Vue路由的hash模式和history模式

**hash模式**

兼容所有浏览器。hash的改变会触发hashchange事件，通过监听hashchange事件来完成操作实现前端路由。hash值变化不会让浏览器向服务器请求。

**history**

兼容能支持 HTML5 History Api 的浏览器，依赖HTML5 History API来实现前端路由。没有`#`，路由地址跟正常的url一样，但是初次访问或者刷新都会向服务器请求，如果没有请求到对应的资源就会返回404。

**abstract**

支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式。



## vue-router的导航钩子

beforeEach：全局前置守卫

- to：代表要进入的目标，它是一个路由对象

- from：代表当前正要离开的路由，也是一个路由对象

- next：必须需要调用的方法

afterEach：全局后置守卫

beforeResolve：全局解析守卫

beforeEnter：路由独享钩子

beforeRouteEnter：在进入对应路由的组件创建前调用

- 在该导航守卫中，无法使用this，因为组件尚未被创建。可以通过传一个回调给next来访问组件实例

beforeRouteUpdate：在重用的组件里调用,比如包含`<router-view />`的组件

beforeRouteLeave：在失活的组件里调用离开守卫



## 导航守卫的流程

- 导航被触发
- 在失活的组件中调用离开守卫`beforeRouteLeave`
- 调用全局的`beforeEach`
- 在重用的组件中饭调用`beforeRouteUpdate`
- 在路由配置里调用`beforeEnter`
- 解析异步路由组件
- 在被激活的组件中调用`beforeRouteEnter`
- 在所有组件内守卫和异步路由组件被解析之后调用全局的`beforeResolve`解析守卫
- 导航被确认
- 调用全局的`afterEach`
- 触发DOM更新
- 用创建好的实例调用`beforeRouteEnter`守卫中传给 `next` 的回调函数



## 对router-link的理解

`<router-link>`是vue-router的内置组件，提供声明式的导航

**props**

- to：目标路由的链接。当被点击后，内部会立刻把`to`的值传到`router.push()`，所以这个值可以是一个字符串或者是描述目标位置的对象

  ```js
  <router-link to="home">Home</router-link>
  <router-link :to="'home'">Home</router-link>
  <router-link :to="{ path: 'home' }">Home</router-link>
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
  <router-link :to="{ path: 'user', query: { userId: 123 }}">User</router-link>
  ```

  

- replace：默认值为false，若设置的话，当点击时，会调用`router.replace()`而不是`router.push()`，于是导航后不会留下 history 记录。

- `append`：设置 append 属性后，则在当前 (相对) 路径前添加基路径

- `tag`：让`<router-link>`渲染成`tag`设置的标签

- `active-class`：默认值为`router-link-active`,设置链接激活时使用的 CSS 类名。默认值可以通过路由的构造选项 linkActiveClass 来全局配置

- `exact-active-class`：默认值为`router-link-exact-active`,设置链接被精确匹配的时候应该激活的 class。默认值可以通过路由构造函数选项 linkExactActiveClass 进行全局配置的。

- `exact`：是否精确匹配，默认为false

- `event`：声明可以用来触发导航的事件。可以是一个字符串或是一个包含字符串的数组，默认是`click`



## 如何在组件中监听路由参数的变化

1. watch

   ```javascript
   watch: {
       '$route'(to, from) {
           //这里监听
       },
   },
   ```

2. beforeRouteUpdate

   ```javascript
   beforeRouteUpdate (to, from, next) {
       //这里监听
   },
   ```



## `$route`和`$router`的区别

`$route`是路由信息对象，包含path、params、hash、query、fullPath、matched、name等路由信息参数，`$router`是路由实例对象，包括了路由的跳转方法，钩子函数等





## Vue路由怎么跳转打开新窗口

```javascript
const obj = {
    path: xxx,//路由地址
    query: {
       mid: data.id//可以带参数
    }
};
const {href} = this.$router.resolve(obj);
window.open(href, '_blank');
```



## 如何动态加载路由

使用Router的实例方法`addRoutes`来实现动态加载路由

使用时要注意，静态路由文件中不能有404路由，而要通过addRoutes一起动态添加进去。

```javascript
const routes = [
    {
        path: '/overview',
        name: 'overview',
        component: () => import('@/views/account/overview/index'),
        meta: {
            title: '账户概览',
            pid: 869,
            nid: 877
        },
    },
    {
        path: '*',
        redirect: {
            path: '/'
        }
    }
]
vm.$router.options.routes.push(...routes);
vm.$router.addRoutes(routes);
```



## 切换路由后，新页面要滚动到顶部或保持原先的滚动位置怎么做呢

滚动顶部

```javascript
const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    }
});
```

滚动原先位置



## 对单页面的理解，它的优缺点





## vuex解决了什么问题

1. 多个组件依赖于同一个状态时，对于多层嵌套的组件的传参将会非常繁琐，并且对于兄弟组件间的状态传递无能为力。
2. 来自不同组件的行为需要变更同一状态。以往采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。以上的这些模式非常脆弱，通常会导致无法维护的代码。



## Vuex中action和mutation有什么区别？

1. action 提交的是 mutation，而不是直接变更状态。mutation可以直接变更状态。
2. action 可以包含任意异步操作。mutation只能是同步操作。
3. 提交方式不同，action 是用`this.$store.dispatch('ACTION_NAME',data)`来提交。mutation是用`this.$store.commit('SET_NUMBER',10)`来提交。
4. 接收参数不同，mutation第一个参数是state，而action第一个参数是context