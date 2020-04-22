---
title: 设计模式 - JS实现
date: 2020-01-19
tags:
 - 设计模式
categories:
 - JavaScript
---

<br>
软件设计模式类型

创建型： 抽象工厂、生成器、工厂方法、原型、单例

结构性：适配器、桥接、修饰、外观、享元、代理

行为型：责任链、命令、迭代器、观察者、策略、模版方法、访问者

<br>
<br>

## Singleton

> 参考文章:
>
> [JavaScript 设计模式（一）：单例模式](<https://juejin.im/post/5d11bcdcf265da1b94215726>)
>
> [从ES6重新认识JavaScript设计模式(一): 单例模式](<https://zhuanlan.zhihu.com/p/34754447>)

单例模式属于创建型模式的一种，针对于全局仅需一个对象的情景，如线程池、全局缓存、window对象等。

在应用这种模式时，**单例对象的类必须保证类必须只有一个实例存在**。许多时候整个系统只需要拥有一个全局对象，这有利于协调系统整体的行为。

比如在某个服务器程序中，该服务器的配置信息存放在一个文件中，这个配置数据由一个单例对象获取这些配置信息。



实现单例模式的思路是：一个类能返回对象的一个引用(永远是同一个)和一个获得该实例的方法(必须是静态方法，通常使用getInstance这个名称)。当我们调用这个方法时，如果类持有的引用不为空就返回这个引用；如果该类持有的引用为空就创建该类的实例，并将实例的引用赋予该类持有的引用。



特点

1. 类只有一个实例
2. 全局可访问该实例
3. 自动实例化
4. 可推迟初始化



**case 1**

```javascript
let Singleton = (function() {
  let instance
  return function (name) {
    if (instance) {
      return instance
    }
    this.name = name
    return instance = this
  }
})()
Singleton.prototype.getName = function() {
  console.log(this.name)
}

let some = new Singleton('hello')
```



**case 2**

> 通过代理的形式，意图解决:**将管理单例，与创建单例的操作进行划分**，实现更小粒度划分，符合"单一职责原则"

```javascript
let ProxyCreateSingleton = (function() {
  let instance
  return function (name) {
    if (instance) return instance
    return instance = new Singkleton(name)
  }
})()
let Singleton = function(name) {
  this.name = name
}
Singleton.prototype.getName = function() {
  console.log(this.name)
}
let some = new ProxyCreateSingleton('hello')
```



**case 3**

> 惰性单例，意图解决：需要时才创建类实例对象。对于懒加载的性能优化

> 需求： 页面弹窗提示，多次调用，都只有一个弹窗对象，只是展示的信息内容不同

```javascript
let getSingleton = function (fn) {
  let result
  return function() {
    return result || (result = fn.apply(this, arguments))
  }
}

let createAlertMessage = function (html) {
  const div = document.createElement('div')
  div.innerHTML = html
  div.style.display = 'none'
  document.body.appendChild(div)
}

let createSingleAlertMessage = getSingleton(createAlertMessage)
document.body.addEventListener('click', function() {
  let alertMessage = createSingleAlertMessage('this is a message')
  alertMessage.style.display = 'block'
})
```



```javascript
class Singleton {
  constructor(name) {
    this.name
  }
  static getInstance(name) {
    if (!this.instance) {
      this.instance = new Singleton(name)
    }
    return this.instance
  }
}
```



**case 4**

> ES6中提供了`static`关键字定义静态方法，可以将`constructor`中判断是否实例化放入逻辑放入一个静态方法`getInstance`中，调用该静态方法获取实例，`constructor`中只包含实例化所需要的代码，这样能增强代码的可读性、结构更加优化。

```javascript
class SingletonApple {
  constructor(name, creator, products) {
      this.name = name;
      this.creator = creator;
      this.products = products;
  }
  //静态方法
  static getInstance(name, creator, products) {
    if(!this.instance) {
      this.instance = new SingletonApple(name, creator, products);
    }
    return this.instance;
  }
}
```



```javascript
let DBCInstance = null
global.DatabaseConnection = class DatabaseConnection {
  get url() {
    return 'mogodb://localhost:27017/mypriject'
  }
  get username() {
    return 'admin'
  }
  get connection() {
    let connection
    // Do something to get the connection to the DB.
    return connection
  }
  get password() {
    return 'root'
  }
  
  static get instance() {
    if (DBCInstance === null || DBCInstance.getConnection().isClose()) {
      DBCInstance = new DatabaseConnection()
    } 
    return DBCInstance
  }
}
```



<br>
<br>

<hr>
<br>



## Abstract factory

抽象工厂模式的实质是**提供接口，创建一系列相关或独立的对象，而不指定这些对象的具体类**

抽象工厂设计模式提供了一种方式，可以**将一组具有统一主题的工厂单独封装起来**。在正常使用中，客户端程序需要创建抽象工厂的具体实现，然后由具体工厂来创建这一主题的具体对象。客户端程序不需要直到它从这些内部的工厂方法中获得对象的具体类型，它获得到的只是畴昔那个产品的引用。

**抽象工厂模式将一组对象的实现细节与它们的一般使用分离开来。**



**具体的工厂决定了创建对象的具体类型，而且工厂就是对象实际创建的地方**。然而，抽象工厂只返回一个指向创建的对象的引用。

> The *factory* determines the actual *concrete* type of object to created, and it is here that the object actually created.

这样客户端程序调用抽象工厂引用的方法，由具体工厂





**case 1**

```javascript
class Pizza {
  constructor({ name = '', dough = '', sauce = '', toppings = []}) {
    this.name = name
    this.dough = dough
    this.sauce = sauce
    this.toppings = toppings 
  }
  prepare() {
    console.log('Preapring ' + this.name)
  }
  bake() {
    console.log('Bake for 25 minutes at 350')
  }
  cut() {
    console.log('Cutting the pizza into diagonal slices')
  }
  box() {
    console.log("Place pizza in official PizzaStore box")
  }
  getName() {
    return this.name
  }
}
```

```javascript
class BasicPizza extends Pizza {
  cut() {
    console.log("Cutting the pizza into square slices.")
  }
}
class CheesePizza extends BasicPizza {
  constructor() {
    super({
      name: 'Chicago Style Deep Dish Cheese Pizza',
      dough: 'Extra Thin Crust Dough',
      sauce: 'Plum Tomato Sauce',
      toppings: ["Shredded Mozzarella Cheese"]
    })
  }
}
class ClamPizza extends BasicPizza {
  constructor() {
    super({
      name: 'Chicago Style Deep Dish Clam Pizza',
      dough: 'Extra Thin Crust Dough',
      sauce: 'Plum Tomato Sauce',
      toppings: ["Shredded Mozzarella Cheese", 'Clams']
    })
  }
}
```

```javascript
const PIZZAS = {
  cheese: CheesePizza,
  clam: ClamPizza,
}

class PizzaStore {
  createPizza() {
    throw new Error("This method must be overwritten!");
  }

  orderPizza(type) {
    let pizza = this.createPizza(type);

    pizza.prepare();
    pizza.bake();
    pizza.cut();
    pizza.box();
  }
}

class ChicagoPizzaStore extends PizzaStore {
  createPizza(type) {
    let PizzaConstructoe = PIZZAS[type]
    let pizza = null
    if (PizzaConstructoe) {
      pizza = new PizzaConstructoe()
    }
    return pizza
  }
}
```



**case 2**

```javascript
class PizzaIntegredientFactory {
  createDough() {
    throw new Error("This method must be overwritten!")
  }
  createCheese() {
    throw new Error("This method must be overwritten!")
  }
}

class ChicagoPizzaIngredientFactory extends PizzaIngredientFactory {
  createDough() {
    return new ThinCrustDough()
  }
  createCheese() {
    return new ReggianoCheese()
  }
}
```



**case 3**

```javascript
class User {
  constructor(type) {
    if (new.target === User) {
      return new Error('抽象类不能被实例化')
    }
  }
  this.type = type
}

class UserOfWechat extends User {
  constructor(name) {
    super('wechat')
    this.name = name
    this.viewPage = ['首页', '通讯录', '发现页']
  }
}
class UserOfQQ extends User {
  constructor(name) {
    super('qq');
    this.name = name;
    this.viewPage = ['首页', '通讯录', '发现页']
  }
}
class UserOfWeibo extends User {
  constructor(name) {
    super('weibo');
    this.name = name;
    this.viewPage = ['首页', '通讯录', '发现页']
  }
}

function getAbstractUserFactory(type) {
  switch (type) {
    case 'wechat':
      return UserOfWechat;
      break;
    case 'qq':
      return UserOfQq;
      break;
    case 'weibo':
      return UserOfWeibo;
      break;
    default:
      throw new Error('参数错误, 可选参数:superAdmin、admin、user')
  }
}

let WechatUserClass = getAbstractUserFactory('wechat');
let QqUserClass = getAbstractUserFactory('qq');
let WeiboUserClass = getAbstractUserFactory('weibo');

let wechatUser = new WechatUserClass('微信小李');
let qqUser = new QqUserClass('QQ小李');
let weiboUser = new WeiboUserClass('微博小李');
```

<br>
<br>
<hr>
<br>


## Factory method

与其他创建型模式一样，它也是处理**在不指定对象具体类型的情况下创建对象**的问题。工厂方法模式的实质是"定义一个创建对象的接口，但让实现这个接口的类来决定实例化类。**工厂方法让类的实例化推迟到子类中进行"**。

在面向对象程序设计中，工厂通常是一个用来创建其他对象的对象。工厂是构造方法的抽象，用来实现不同的分配方案。



#### 适用性

下列情况下可以考虑使用工厂方法模式

- 创建对象需要大量重复的代码
- 创建对象需要访问某些信息，而这些信息不应该包含在复合类中
- 穿件对象的生命周期必须集中管理，以保证在这个程序中具有一致的行为



**case 1**

```javascript
let UserFactory = function(role) {
  if (this instanceof UserFactory) {
    return new this[role]()
  } else {
    return new UserFactory(role)
  }
}
UserFactory.prototype = {
  SuperAdmin: function() {
    this.name = '超级管理员'
    this.viewPage = ['首页', '通讯录', '发现页', '应用数据', '权限管理']
  },
  Admin: function() {
    this.name = "管理员",
    this.viewPage = ['首页', '通讯录', '发现页', '应用数据']
  },
  NormalUser: function() {
    this.name = '普通用户',
    this.viewPage = ['首页', '通讯录', '发现页']
  }
}

let superAdmin = UserFactory('SuperAdmin');
let admin = UserFactory('Admin') 
let normalUser = UserFactory('NormalUser')
```



**case 2**

```javascript
class User {
  constructor(name = '', viewPage = []) {
    if (new.target === User) {
      throw new Error('抽象类不能实例化!')
    }
    this.name = name
    this.viewPage = viewPage
  }
}

class UserFactory extends User {
  constructor(name, viewPage) {
    super(name, viewPage)
  }
  create(role) {
    switch (role) {
      case 'superAdmin': 
        return new UserFactory( '超级管理员', ['首页', '通讯录', '发现页', '应用数据', '权限管理'] );
        break;
      case 'admin':
        return new UserFactory( '普通用户', ['首页', '通讯录', '发现页'] );
        break;
      case 'user':
        return new UserFactory( '普通用户', ['首页', '通讯录', '发现页'] );
        break;
      default:
        throw new Error('参数错误, 可选参数:superAdmin、admin、user')
    }
  }
}

let userFactory = new UserFactory();
let superAdmin = userFactory.create('superAdmin');
let admin = userFactory.create('admin');
let user = userFactory.create('user');
```



<br>
<br>
<hr>
<br>

## Builder

他可以将复杂对象的建造过程抽象处理，使用这个抽象的过程的不同实现方法可以构造出不同表现的对象。也就是说将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

生成器模式的重心在于分离整体构建算法和部件构造，而分步骤构建对象不过是整体构建算法的一个简单实现，或者说是一个附带产物。

要实现同样的构建过程可以创建不同的表现，那么一个自然的思路就是先把构建过程独立出来，在生成器模式中把它称为Director，由它来指导装配过程，但是不负责每步具体的实现。

抽象工厂模式与生成器模式相似，因为他也可以创建复杂对象。主要的区别就是生成器模式着重于一步步构造一个复杂对象，而抽象工厂模式着重于多个系列的产品对象。生成器在最后的一步返回产品，而对于抽象工厂来说，产品是立即返回的。



### 功能

主要功能是构建复杂的产品，而且是细化的，分步骤的构建产品，也就是生成器模式中在一步一步解决构造复杂对象的问题。更为重要的是，这个构建的过程是统一的，固定不变的，变化的部分放到生成器部分了，只要配置不同的生成器，那么同样的构建过程，就能构建出不同的产品来。

生成器模式的重心在于分离构建算法和具体的构造实现，从而使得构建算法可以重用。具体的构造实现可以很方便地扩展和切换，从而可以灵活的组合来构造出不同的产品对象。



### 构成

1. 一个部分是Builder接口，这里是定义了如何构建各个部件，也就是知道每个部件功能如何实现，以及如何装配这些部件到产品中去。
2. 另外一个部分是Director，Director是知道如何组合来构建产品，也就是说Director负责整体的构建算法，而且通常是分步骤地来执行。
3. 不管如何变化，Builder模式都存在这么两个部分，一个部分是部件构造和产品装配，另一个部分是整体构建的算法。



### 使用

应用生成器模式的时候，可以让客户端创造Director，在Director里面封装整体在、构建算法，然后让Director去调用Builder，让Builder来封装具体部件的构建功能。



### 适用性

在以下的情况使用生成器模式

- 当创建复杂对象的算法应该独立于该对象的组成部分以及它们的装配方法时
- 当构造过程必须允许被构造的对象有不同的表示时
- 如果同时一个构建过程有着不同的表示时



### 参与者

- Builder

  为创建一个Product对象的各个部件指定抽象接口

- ConcreteBuilder

  实现Builder的接口以构造和装配该产品的各个部件。

  定义并明确它所创建的表示。

  提供一个检索产品的接口。

- Director

  构造一个使用Builder接口的对象

- Product

  表示被构造的复杂对象。ConcreateBuilder创建该产品的内部表示并定义它的装配过程。

  包含定义组成部件的类，包括将这些部件装配成最终产品的接口



**case 1**

```javascript
let itemList = new WeakMap()
class Meal {
  get list() {
    if(!itemList.get(this)) {
      itemList.get(this, [])
    }
    return itemList.get(this)
  }
  addItem(item) {
    this.list.push(item)
  }
  getCost() {
    return this.list.reduce((accum, item) => {
      accum += item.price
      return accume
    }, 0)
  }
  showItems() {
    this.list.forEach(item => {
      console.log(`Item: ${item.name}, Packing: ${item.packing.pack()}, Price: $${item.price}`)
    })
  }
}

class Packing {
    pack() {
        throw new Error('This method should be implemented');
    }
}

class Item {
    get name() {
        throw new Error('This method should be implemented');
    }
    get packing() {
        throw new Error('This method should be implemented');
    }
    get price() {
        throw new Error('This method should be implemented');
    }
}
```

```javascript
class Bottle extends Packing {
  pack() {
    return 'Bottle'
  }
}
class BoxUp extends Packing {
  pack() {
    return 'BoxUp'
  }
}

class Drink extends Item {
  get packing() {
    return new Bottle()
  }
}
class SideDishes extends Item {
  get package() {
    return new Boxup()
  }
}
```

```javascript
class Coke extends Drink {
  get price() {
    return 3.5
  }
  get name() {
    return 'Coke'
  }
}

class Salad extends SideDished {
  get price() {
    return 6
  }
  get name() {
    return 'Salad'
  }
}
```

```javascript
class MealBuilder {
  prepareMeal() {
    const meal = new Meal()
    meal.addItem(new Salad())
    meal.addItem(new Coke())
    return meal
  }
}
```



<br>
<br>
<hr>
<br>


## Prototype

> 参考链接:
>
> [原型模式](<https://wiki.jikexueyuan.com/project/javascript-design-patterns/prototype-pattern.html>)

原型模式的特点在于通过复制一个已经存在的实例来返回新的实例，而不是创建实例。被创建的实例就是"原型",这个原型是可定制的。

原型模式多用于创建复杂的或者耗时的实例，因为这种情况下，复制一个已经存在的实例使程序运行更高效；或者创建值相等，只是命名不一致的同类数据。



在JavaScript中的原型模式

原型模式就是将可复用的，可共享的、耗时大的从父类中提出来，然后放在其原型中，然后通过组合继承或者寄生组合式继承将方法和属性继承下来，对于子类中那些需要重写的方法进行重写，这样子类创建的对象既有子类的属性和方法，也共享了父类的原型方法。

Prototype模式是基于原型继承的模式，可以在其中创建对象，作为其他对象的原型。Prototype对象本身实际上是用作构造函数创建每个对象的蓝图。在JavaScript中，原型继承避免和类一起使用，我们仅仅是创建现有功能对象的拷贝。使用Prototype模式的一个好处是，我们获得的是JavaScript本身所具有的原型优势，而不是视图模仿其他语言的特性。



**case  1**

```javascript
let myCar = {
    name: "Ford Escort",

    drive: function () {
        console.log("Weeee. I'm driving !")
    },

    panic: function () {
        console.log("Wait. How do you stop this thing?")
    }
};

let yourCat = Object.create(myCat)
```



**case 2**

```javascript
class HumanBeing {
  constructor({ gender, height, skinColor }) {
    this.gender = gender
    this.height = height
    this.skinColor = skinColor
  }
  
  clone() {
    return new HumanBeing(Object.assign({},  this))
  }
}
```



<br>
<br>
<hr>
<br>


## Adapter

适配器模式就是将一个类（对象）的接口（方法或属性）转化成客户希望的另外一个接口（方法或属性），使得原本由于接口不兼容而不能一起工作的那些类（对象）可以正常协作。简单理解就是为兼容而生的 “转换器”。



### 适用场景

- 跨浏览器兼容
- 整合第三方SDK
- 新老接口兼容

适配器模式的初衷是为了解决多对象兼容问题，如果存在多对象协同工作时，不方便直接修改原对象的基础上，可以考虑使用适配器封装，以便外部调用者统一使用。



### 模式实现

> 实现方式：在不改变原有对象接口的基础上，定义一个包装对象，新对象转接调用原有接口，是外部调用者可以正常使用

**第三方SDK应用**

```javascript
let googleMao = {
  show: function() {
    console.log('开始渲染谷歌地图')
  }
}
let baiduMap = {
    display: function(){
        console.log('开始渲染百度地图');
    }
}

// 外部实际调用的适配器对象
let baidumapAdapter = {
  show() {
    return baiduMap.display()
  }
}
let renderMap = function(map) {
    map.show();   // 统一接口调用
}

renderMap(googleMap);
renderMap(baiduMapAdapter)
```

