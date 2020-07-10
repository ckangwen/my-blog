### 可索引类型

在不确定一个接口中有多少属性时，可以使用可索引类型。可索引类型分为数字索引类型和字符串索引类型。

可以同时使用两种类型的索引，但是数字索引类型的值类型必须是字符串索引的值类型的子类型。

如果在接口中定义了某一种索引签名的值，那么在这个接口中的其他属性的值必须是索引签名值的类型的子类型。

```typescript
interface Demo {
  [x: number]: string
  [y: string]: number | string
}
```





### 索引类型的查询操作符

`keyof T`表示类型T的所有公共属性的字面量的联合类型

```typescript
function get(o: T, name: K): T[K] {
  return o[name]
}
```





### 索引访问操作符

`T[K]`表示**类型T**的**属性K**表示的类型

```typescript
interface Person {
  name: string
  age: number
}

let username: Person['name'] = 'tom'
```

要确保属性K属于类型T的属性，也就是说要确保`K extends keyof T`

```typescript
function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
    return o[name]; // o[name] is of type T[K]
}
```



### 泛型约束

`T extends U`可以将变量的类型局限于特定的几个类型之中



```typescript
let obj = {
  a: 1,
  b: 2,
  c: 3
}

function getValuest<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map(key => obj[key])
}
console.log(getValuest(obj, ['a', 'b']))
console.log(getValuest(obj, ['e', 'f'])) // 如果传入的属性不属于obj，则会报错
```



### 映射类型

映射类型可以从一个旧类型生成一个新的类型。在映射类型里，新类型以相同的形式去转换旧类型里每个属性。

例如将每个属性都转换为readonly类型

```typescript
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```



### 条件类型

条件类型形如`T extends U ? X : Y`

```typescript
type TypeName<T> =
    T extends string    ? "string" :
    T extends number    ? "number" :
    T extends boolean   ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function  ? "function" :
    "object";

type T0 = TypeName<string>;  // "string"
type T1 = TypeName<"a">;     // "string"
type T2 = TypeName<true>;    // "boolean"
type T3 = TypeName<() => void>;  // "function"
type T4 = TypeName<string[]>;    // "object"

```

### 分布式条件类型

形如`(A | B) extends U ? X : Y"`，其等价于`(A extends U ? X : Y) | (B extends U ? X : Y)`

```typescript
type T5 = TypeName<'string' | 10> // 'string' | 'number'
```





### 交叉类型

交叉类型是将多个类型合并为一个类型，它包含了所需的所有类型的特性

```typescript
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any>second)[id];
        }
    }
    return result;
}
```



### 联合类型

声明的类型并不确定，可以为多个类型中的一个

如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员

```typescript
interface Bird {
    fly();
    layEggs();
}

interface Fish {
    swim();
    layEggs();
}

function getSmallPet(): Fish | Bird {
    // ...
}

let pet = getSmallPet();
pet.layEggs(); // okay
pet.swim();    // errors
```



#### 可区分的联合类型

这种模式是结合了联合类型和字面量类型的类型保护方法，一个类型如果是多个类型的联合类型，并且每个类型之间有一个公共的属性，我们就可以凭借这个公共属性来创建不同的类型保护区块。

**核心是利用两种或多种类型的共有属性，来创建不同的代码保护区块**

```typescript
interface Square {
  kind: "square";
  size: number;
}
interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}
interface Circle {
  kind: 'circle';
  r: number;
}
type Shape = Square | Rectangle | Circle

function area(s: Shape) {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
      break;
    case "rectangle":
      return s.width * s.height;
      break;
  }
}

console.log(area({ kind: 'circle', r: 1 }))
// undefined，不报错，这个时候我们是希望代码有报错提醒的

```

如果向上述方法中传入一个其他的类型，那么代码不会报错。若想要得到正确的报错提醒，需要做额外的设置。

1. 为方法设置返回值类型

   当参数进入switch分支，因为不属于任何一个类型，不会进行任何返回操作，从而返回`undefined`，进而抛出错误

2. 利用never类型,原理是在最后default判断分支写一个函数，设置参数是never类型，然后把最外面函数的参数传进去，正常情况下是不会执行到default分支的

   ```typescript
   function area(s: Shape) {
     switch (s.kind) {
       case "square":
         return s.size * s.size;
         break;
       case "rectangle":
         return s.width * s.height;
         break;
       case "circle":
         return Math.PI * s.r ** 2;
         break;
       default:
         return ((e: never) => { throw new Error(e) })(s)
         //这个函数就是用来检查s是否是never类型，如果s是never类型，说明前面的分支全部覆盖了，如果s不是never类型，说明前面的分支有遗漏，就得需要补一下。
     }
   }
   ```





> 参考资料
>
> [TypeScript 基础精粹](<https://juejin.im/post/5da7de24e51d45249948429d#heading-68>)