## 关键字

### typeof

`typeof`在JS中可以判断一个变量的基础数据类型，在TS中可以获取到变量的声明类型，如果不存在声明类型则获取该类型的推论类型。

```typescript
interface Foo {
  name: string
  age?: number
}

let obj = {
  name: 'foo',
  age: 20
}
let foo: Foo = {
  name: 'foo',
  age: 20
}

// obj没有声明类型， 所以得出obj的推论类型，即ObjType
// { name: string; age: number }
type ObjType = typeof obj

// foo显示地声明了它的类型为Foo，所以typeof得出类型Foo
// Foo
type FooType = typeof foo
```



### extends

`extends` 可以用来继承一个类，也可以用来继承一个 `interface`，但还可以用来**判断有条件类型**。

在TypeScript 2.8引入了有条件类型，它能够表示**非统一的类型**。

有条件的类型会**以一个条件表达式进行类型关系检测，从而在两种类型中选择其一**： `T extends U ? X : Y` 

上面的类型意思是，若`T`能够赋值给`U`，那么类型是`X`，否则为`Y`。

有条件类型的结果可能为`X`，也可能为`Y`，再或者延迟解析，因为它可能依赖一个或多个类型变量。

是否直接解析或推迟取决于：**首先，令`T'`和`U'`分别为`T`和`U`的实例，并将所有类型参数替换为any，如果`T'`不能赋值给`U'`，则将有条件的类型解析成`Y`。**

直观上讲，如果最宽泛的T的实例不能赋值给最宽泛的U的实例，那么我们就可以断定不存在可以赋值的实例，因此可以解析为Y。

在TypeScript 2.2 支持混合类。混合类指一个extends了类型参数类型的表达式的类声明或表达式。例如`class`的extends和`interface`的extends.



### keyof

在TypeScript 2.1中引入了索引类型查询。

**索引类型查询**`keyof T`产生的类型是`T`的属性名称。`keyof T`的类型是`string`的子类型。

```typescript
interface Person {
    name: string;
    age: number;
    location: string;
}

type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[];  // "length" | "push" | "pop" | "concat" | ...
type K3 = keyof { [x: string]: Person };  // string
```

与之相对应的是**索引访问类型**，也称为*查找类型*。在语法上，它们看起来像元素访问，但是写成类型

```typescript
type P1 = Person["name"];  // string
type P2 = Person["name" | "age"];  // string | number
type P3 = string["charAt"];  // (pos: number) => string
type P4 = string[]["push"];  // (...items: string[]) => number
type P5 = string[][0];  // string
```



### in

`in` 可以遍历枚举类型

```typescript
type Keys = "a" | "b"
type Obj =  {
  [p in Keys]: any
} // -> { a: any, b: any }

```



### infer

在TypeScript 2.8引入。在有条件类型的`extends`子语句中，允许出现`infer`声明，它会引入一个待推断的类型变量。 这个推断的类型变量可以在有条件类型的true分支中被引用。

例如，下面代码会提取函数类型的返回值类型：

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

<br/>

无法在正常类型参数的约束子语句中使用`infer`声明：

```ts
type ReturnType<T extends (...args: any[]) => infer R> = R;  // 错误，不支持
```

但是，可以这样达到同样的效果，在约束里删掉类型变量，用有条件类型替换：

```ts
type AnyFunction = (...args: any[]) => any;
type ReturnType<T extends AnyFunction> = T extends (...args: any[]) => infer R ? R : any;
```

<br/>

## 类 Class

```typescript
class Greeter {
  greeting: string;
  constructor(message?: string) {
      this.greeting = message;
  }
  static date() {
    return new Date()
  }
  greet() {
      return "Hello, " + this.greeting;
  }
}

let greeter: Greeter = new Greeter("morning")
greeter.date // Error: Property 'date' is a static member of type 'Greeter'

let greeterMaker: typeof Greeter = Greeter;
let greeter2: Greeter = new greeterMaker();
```

如上所示，我们将`greeter`声明为`Greeter`类型。而它能够被`new Greeter()`所接受，这就说明`Greeter`是`Greeter`类的实例的类型，无法获取到静态部分的类型。

而如果要获取到静态部分的类型，需要用到关键字`typeof`。`typeof Greeter`意为取Greeter类的类型，而不是实例的类型，也就是构造函数的类型。这个类型包含了类的所有静态成员和构造函数。



### 类类型

在TypeScript使用泛型创建工厂函数时，需要引用构造函数的类类型。比如，

```ts
function create<T>(c: { new(): T; }): T {
    return new c();
}
```

<br/>

## 接口 interface

### 类继承接口

类是具有两个类型的：静态部分的类型和实例的类型。当一个类实现了一个接口时，只会对实例部分进行类型检查。 类的静态部分不在检查的范围内。

```typescript
/* OK */
interface ClockConstructor {
  name: string
}

class Clock implements ClockConstructor {
  name: string
  constructor(h: number, m: number) { }
}

/* Error */
interface ClockConstructor {
  new (hour: number, minute: number);
  name: string
}

// Type 'Clock' provides no match for the signature 'new (hour: number, minute: number): any'.
class Clock implements ClockConstructor {
  currentTime: Date;
  name: string
  new (hour: number, minute: number) {}
}
```

因此，我们应该直接操作类的静态部分。

```typescript
interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick(): void;
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tock");
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```



### 接口继承类

当接口继承了一个类类型时，它会继承类的成员但不包括其实现，包括private和protected成员。