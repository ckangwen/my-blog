### React 中 keys 的作用是什么？

Keys 是 React 用于追踪哪些列表中元素被修改、被添加或者被移除的辅助标识。

我们需要保证元素的key在其同级中具有一致性，在react diff算法中 React 会借助元素的 Key 值来判断该元素是新创建的还是被移动而来的元素，从而减少不必要的渲染。



### 调用 setState 之后发生了什么？



### React 中 refs 的作用是什么？



### 展示组件(Presentational component)和容器组件(Container component)之间有何不同

- 展示组件关心组件看起来是什么。它通过 props 接受数据和回调，并且几乎不会有自身的状态，但当展示组件拥有自身的状态时，通常也只关心 UI 状态而不是数据的状态。
- 容器组件则更关心组件是如何运作的。容器组件会为展示组件或者其它容器组件提供数据和行为(behavior)，它们会调用 Flux actions，并将其作为回调提供给展示组件。容器组件经常是有状态的，因为它们是(其它组件的)数据源。



### 组件的state与props的区别

state 和 props都直接和组件的UI渲染有关，它们的变化都会触发组件重新渲染。但props对于使用它的组件来说是只读的，是通过父组件传递过来的，要想修改props，只能在父组件中修改；而state是组件内部自己维护的状态，是可变的，通过`setState`异步更新。 



### 虚拟DOM的优劣如何

优点

- 保证性能下限：虚拟DOM可以经过diff找出最小差异，然后批量进行patch。这种方式比手动操作DOM在性能上要好很多
- 无需手动操作DOM：虚拟DOM的diff和patch都是在一次更新中自动进行的，我们无需手动操作DOM，极大提高开发效率
- 跨平台：虚拟DOM本质上是JavaScript对象,而DOM与平台强相关,相比之下虚拟DOM可以进行更方便地跨平台操作,例如服务器渲染、移动端开发等等

缺点

- 无法进行极致优化: 在一些性能要求极高的应用中虚拟DOM无法进行针对性的极致优化,比如VScode采用直接手动操作DOM的方式进行极端的性能优化



### 虚拟DOM实现原理

- 虚拟DOM本质上是JavaScript对象,是对真实DOM的抽象
- 状态变更时，记录新树和旧树的差异
- 最后把差异更新到真正的dom中





### react如何进行组件复用

- 高阶组件
- render props
- react hooks



### 高阶组件

高阶组件不是组件时增强函数，可以输入一个元组件返回一个新的增强组件。

高阶组件的作用是代码复用，操作状态和参数

用法

属性代理：返回出一个组件，它基于被包裹组件进行功能增强

```javascript
 function proxyHoc(Comp) {
 	return class extends React.Component {
 		render() {
 			const newProps = {
 				name: 'tayde',
 				age: 1,
 			}
 			return <Comp {...this.props} {...newProps} />
 		}
 	}
 }
```

提取状态：可以通过props将被包裹组件的中state依赖外层，例如用于转换受控组件

反向继承：返回出一个组件，继承与被包裹的组件

```javascript
function IIHoc(Comp) {
     return class extends Comp {
         render() {
             return super.render();
         }
     };
 }
```







### shouldComponentUpdate 是做什么的，（react 性能优化是哪个周期函数？）

shouldComponentUpdate 这个方法用来判断是否需要调用 render 方法重新描绘 dom。因为 dom 的描绘非常消耗性能，如果我们能在 shouldComponentUpdate 方法中能够写出更优化的 dom diff 算法，可以极大的提高性能。



应用场景

- **权限控制**，通过抽象逻辑，统一对页面进行权限判断，按不同的条件进行页面渲染:

```javascript
 function withAdminAuth(WrappedComponent) {
     return class extends React.Component {
 		constructor(props){
 			super(props)
 			this.state = {
 		    	isAdmin: false,
 			}
 		} 
 		async componentWillMount() {
 		    const currentRole = await getCurrentUserRole();
 		    this.setState({
 		        isAdmin: currentRole === 'Admin',
 		    });
 		}
 		render() {
 		    if (this.state.isAdmin) {
 		        return <Comp {...this.props} />;
 		    } else {
 		        return (<div>您没有权限查看该页面，请联系管理员！</div>);
 		    }
 		}
     };
 }
```

- **性能监控**，包裹组件的生命周期，进行统一埋点:

```javascript
 function withTiming(Comp) {
     return class extends Comp {
         constructor(props) {
             super(props);
             this.start = Date.now();
             this.end = 0;
         }
         componentDidMount() {
             super.componentDidMount && super.componentDidMount();
             this.end = Date.now();
             console.log(`${WrappedComponent.name} 组件渲染时间为 ${this.end - this.start} ms`);
         }
         render() {
             return super.render();
         }
     };
 }
```

- **代码复用**，可以将重复的逻辑进行抽象。



## React的请求应该放在哪个生命周期中?

目前官方推荐的异步请求是在`componentDidmount`中进行.



### Redux

Redux 是一个 **数据管理中心**，可以把它理解为一个全局的 data store 实例

核心理念

- 单一数据源：整个应用只有唯一的状态树
- 状态只读：Store中的数据无法被直接修改
- 纯函数：只能通过一个纯函数(Reducer)来进行状态的修改



理念实现

- store：全部store单例，每个Redux应用下只有一个store，它具有以下方法供使用

  - getState：获取state
  - dispatch：触发action，更新state
  - subscribe：订阅数据变更，注册监听器

  ```javascript
   // 创建
   const store = createStore(Reducer, initStore)
  ```

- Action：它作为一个行为载体，用于映射相应的 Reducer，将数据从应用传递至 store 中

  ```javascript
   // 一个普通的 Action
  const action = {
   	type: 'ADD_LIST',
   	item: 'list-item-1',
   }
   
   // 使用：
   store.dispatch(action)
   
   // 通常为了便于调用，会有一个 Action 创建函数 (action creater)
   funtion addList(item) {
   	return const action = {
   		type: 'ADD_LIST',
   		item,
   	}
   }
   
   // 调用就会变成:
   dispatch(addList('list-item-1'))
  ```

- Reducer：用于描述如何修改数据的纯函数，Action 属于行为名称，而 Reducer 便是修改行为的实质

  ```javascript
   // 一个常规的 Reducer
   const initList = []
   function ListReducer(state = initList, action) {
   	switch (action.type) {
   		case 'ADD_LIST':
   			return state.concat([action.item])
   			break
   		defalut:
   			return state
   	}
   }
  ```

  

## Redux的工作流程

核心概念

- Store：存放数据的地方，整个应用只能有一个Store

- State：Store对象包含所有数据，如果想得到某个时点的数据，就要对Store生成快照，这种时点的数据集合，就叫做State

- Action：State的变化，会导致View的变化。但是，用户接触不到State，只能接触到View。所以，State的变化必须是View导致的。Action就是View发出的通知，表示State应该要发生变化了。

- Action Creator：View要发送多少种消息，就会有多少种Action。如果都手写，会很麻烦，所以我们定义一个函数来生成Action，这个函数就叫Action Creator。

  Reducer：Store收到Action以后，必须给出一个新的State，这样View才会发生变化。这种State的计算过程就叫做Reducer。Reducer是一个函数，它接受Action和当前State作为参数，返回一个新的State。

  dispatch：是View发出Action的唯一方法。





然后我们过下整个工作流程：

1. 首先，用户（通过View）发出Action，发出方式就用到了dispatch方法。
2. 然后，Store自动调用Reducer，并且传入两个参数：当前State和收到的Action，Reducer会返回新的State
3. State一旦有变化，Store就会调用监听函数，来更新View。

到这儿为止，一次用户交互流程结束。可以看到，在整个流程中数据都是单向流动的，这种方式保证了流程的清晰。







## react-redux是如何工作的?

Provider: Provider的作用是从最外部封装了整个应用，并向connect模块传递store

connect: 负责连接React和Redux 

- 获取state: connect通过context获取Provider中的store，通过store.getState()获取整个store tree 上所有state
- 包装原组件: 将state和action通过props的方式传入到原组件内部wrapWithConnect返回一个ReactComponent对象Connect，Connect重新render外部传入的原组件WrappedComponent，并把connect中传入的mapStateToProps, mapDispatchToProps与组件上原有的props合并后，通过属性的方式传给WrappedComponent
- 监听store tree变化: connect缓存了store tree中state的状态,通过当前state状态和变更前state状态进行比较,从而确定是否调用`this.setState()`方法触发Connect及其子组件的重新渲染





作者：寻找海蓝96

链接：https://juejin.im/post/5d5f44dae51d4561df7805b4

来源：掘金

著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。





