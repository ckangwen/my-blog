---
title: JavaScript模块发展史
permalink:  evolution of js modularity
date: 2019-12-28 23:28
category: Web
tags: [JavaScript, 模块化]
---

[[toc]]

# JavaScript模块发展史


### 直接定义依赖(1999)

直接定义依赖项的要点在于通过显示调用函数`dojo.require`来获取模块的代码(就dojo而言)。

也就是说，在这种方式中，依赖关系是直接在应该使用它们的地方中定义的。

```javascript
// greeting.js
dojo.provide("app.greeting");

app.greeting.helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};

app.greeting.sayHello = function (lang) {
    return app.greeting.helloInLang[lang];
};

// hello.js
dojo.provide("app.hello");

dojo.require('app.greeting');

app.hello = function(x) {
  document.write(app.greeting.sayHello('es'));
};

// index.js
dojoConfig = {
  baseUrl: '/scripts/',
    modulePaths: {
      "app": "app"
    }
};
dojo.require("app.hello");
app.hello();
```

我们可以看到模块是使用函数`dojo.provide`定义的，并且在使用`dojo.require`时，开始获取模块代码。



### 命名空间模式(2002)

为了解决命名冲突问题，我们可能会使用特殊的代码约定，例如为所有的变量和函数添加特定的前缀。还可以将函数分配给变量或对象的属性，并从其他函数返回它们。因此可以创建具有类似与document或window的属性方法的对象(`document.write()`, `window.alert()`)

Erik Arvidsson于2002年创建了Bindows库，他没有在函数和变量的名称中使用前缀，而是使用一个全局对象，该对象包括库的数据和逻辑。这样一来，大大减少了全局变量污染。

```javascript
// app.js
var app = {};

// greeting.js
app.helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};

// hello.js
app.writeHello = function (lang) {
    document.write(app.helloInLang[lang]);
};

// index.js
app.writeHello('ru')
```



### 闭包模块化模式(2003)

命名空间为代码组织提供了某种顺序，但是显然这还不够，因为好没有解决方案来隔离代码和数据。模块模式的主要思想是用闭包封装数据和代码，并通过外部可访问的方法提供对它们的访问。

```javascript
var greeting = (function () {
    var module = {};

    var helloInLang = {
        en: 'Hello world!',
        es: '¡Hola mundo!',
        ru: 'Привет мир!'
    };

    module.getHello = function (lang) {
        return helloInLang[lang];
    };

    module.writeHello = function (lang) {
        document.write(module.getHello(lang))
    };

    return module;
}());
```

在这里，我们看到了立即调用的函数，该函数返回一个模块对象，该模块对象又具有方法`getHello`，该方法通过闭包访问对象`helloInLang`。 因此`helloInLang`变得无法从外部访问，并且我们获得了一段原子代码，可以将该代码粘贴到任何其他脚本中，而不会发生命名冲突。



### 模版依赖定义(2006)

该模式通过将特殊标签包含在目标文件中来定义依赖项。可以通过模板化和特殊的构建工具来将标签解析为实际代码。与先前讨论的分离的依赖项定义模式相反，该模式仅使用于预构建步骤。

```javascript
// app.tmp.js

/*borschik:include:../lib/main.js*/

/*borschik:include:../lib/helloInLang.js*/

/*borschik:include:../lib/writeHello.js*/

// main.js
var app = {};

// helloInLang.js
app.helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};

// writeHello.js
app.writeHello = function (lang) {
    document.write(app.helloInLang[lang]);
};
```

```javascript
// dist app.js
/* ../lib/main.js begin */
var app = {};

/* ../lib/main.js end */


 /* ../lib/helloInLang.js begin */
app.helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};

/* ../lib/helloInLang.js end */


 /* ../lib/writeHello.js begin */
app.writeHello = function (lang) {
    document.write(app.helloInLang[lang]);
};

/* ../lib/writeHello.js end */
```



在示例文件app.tmp.js中定义了插入脚本及其顺序。很明显这种方式并不会从根本上改变开发人员的工作，因为只是在js文件中用其他标记，替代了在HTML中使用script标签，这样我们仍然可以忘记某些东西或弄乱插入脚本的顺序。因此此方法的主要目的是从许多其他脚本中创建单个文件。

> In the example file app.tmp.js defines the plugged-in scripts and their order. If you will ponder about this example it will be clear that this approach does not fundamentally changes the life of the developer. Instead of using `script` tags you just start to use other labels in js file. Thus we can still forget something or screw up the order of the plugged-in scripts. Therefore the main purpose of this approach is a creating a single file from many other scripts.



### 注释依赖定义(2006)

注释依赖定义与直接定义的依赖项非常类似，但是我们使用包含特定模块所有依赖项的注释，而不是使用某些函数。

使用此模式的应用程序必须是预先构建的，或者必须动态解析下载的代码，并在运行时解析依赖项。

> The comment defined dependencies pattern is also subtype of the detached dependency definitions family. It is very similar to directly defined dependencies, but in this case instead of using some sort of functions we use comments which include the information about all dependencies of the particular module.
An application that use this pattern must be either pre-built (this approach was used in 2006 for MooTools which was created by Valerio Proietti), or dynamically parse downloaded code and resolve dependencies at the runtime. The last approach was used in LazyJS which was created by Nicolás Bevacqua.

```javascript
//helloInLang.js
var helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};

// sayHello.js

/*! lazy require scripts/app/helloInLang.js */

function sayHello(lang) {
    return helloInLang[lang];
}

// hello.js

/*! lazy require scripts/app/sayHello.js */

document.write(sayHello('en'));

<script id='lazyjs' src='/scripts/vendors/lazy.js' data-jumpstart='/scripts/hello.js'></script>
```

当库下载文件是，它会分析其内容，找到具有相关性的相应注释，并最终下载相关的文件。



### 外部依赖定义(2007)

在外部定义的依赖关系模式中，所有依赖关系都是在主上下文之外定义的，例如撇脂文件中或者在代码中作为对象或具有依赖关系列表的数组。但是有一个准备阶段。在此阶段中，应用程序将以正确的顺序加载所有依赖项进行初始化。

```javascript
// file deps.json
{
    "files": {
        "main.js": ["sayHello.js"],
        "sayHello.js": ["helloInLang.js"],
        "helloInLang.js": []
    }
}

// helloInLang.js
var helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};

// sayHello.js
function sayHello(lang) {
    return helloInLang[lang];
}

// main.js
console.log(sayHello('en'));

```

```
<body>
  <div class="phrase"></div>
  <script type="text/javascript" src="scripts/vendors/eddloader.js" data-edd-path="scripts/app" data-edd-deps="deps.json"></script>
</body>
```


文件dep.json是定义所有依赖关系的外部上下文。当运行应用程序时，加载程序将接受到此文件，读取定义为数组的所有依赖项的列表，然后以正确的顺序加载并将它们放入页面。如今，这种方法已在库中用于创建自定义版本，例如[loadsh](https://github.com/lodash-archive/lodash-cli/blob/master/lib/mapping.js#L386-L1022)。



### Sandbox模式(2009)

Yahoo的开发人员致力于YUI3中的新模块系统，他们正在解决在一页上使用不同版本库的问题。该框架在先前的YUI3模块系统已经使用模块模式和命名空间的组合来实现。显然，通过这种当世，包含库代码的定义对象只能是一个，因此使用多个版本的库确实很困难。

```javascript
// file sandbox.js
function Sandbox(callback) {
    var modules = [];

    for (var i in Sandbox.modules) {
        modules.push(i);
    }

    for (var i = 0; i < modules.length; i++) {
        this[modules[i]] = Sandbox.modules[modules[i]]();
    }
    
    callback(this);
}

// file greeting.js
Sandbox.modules = Sandbox.modules || {};

Sandbox.modules.greeting = function () {
    var helloInLang = {
        en: 'Hello world!',
        es: '¡Hola mundo!',
        ru: 'Привет мир!'
    };

    return {
        sayHello: function (lang) {
            return helloInLang[lang];
        }
    };
};

// file app.js
new Sandbox(function(box) {
    document.write(box.greeting.sayHello('es'));
});
```

这种方法的本质在于，可以使用全局构造函数来代替全局对象。可以将模块定义为此构造函数的属性。

Sandbox相关文章： [JavaScript Sanbox Pattern](https://www.kenneth-truyers.net/2016/04/25/javascript-sandbox-pattern/)





### 依赖注入(2009)

依赖注入的要点在于所有依赖项都来自于组件外部，因此组件不负责初始化其依赖项，它仅使用它们。Angular中的模块就是通过依赖注入机制实现的。

```javascript
// file greeting.js
angular.module('greeter', [])
    .value('greeting', {
        helloInLang: {
            en: 'Hello world!',
            es: '¡Hola mundo!',
            ru: 'Привет мир!'
        },

        sayHello: function(lang) {
            return this.helloInLang[lang];
        }
    });

// file app.js
angular
	.module('app', ['greeter'])
  .controller('GreetingController', ['$scope', 'greeting', function($scope, greeting) {
      $scope.phrase = greeting.sayHello('en');
	}]);

```

```Angular
<body>
  <div ng-controller="GreetingController">
    {{ phrase }}
  </div>

  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js"></script>
  <script src="app.js" type="text/javascript"> </script>
  <script src="greeting.js" type="text/javascript"> </script>
</body>
```

依赖注入是Angular 2和[Slot](https://github.com/2gis/slot)这样的框架中的关键机制。





### CommonJS(2009)

```javascript
// file greeting.js
var helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};

var sayHello = function (lang) {
    return helloInLang[lang];
}

module.exports.sayHello = sayHello;

// file hello.js
var sayHello = require('./lib/greeting').sayHello;
var phrase = sayHello('en');
console.log(phrase);
```

在这里，我们看到了实现模块化的两个新实体——require和module，它们提供了加载模块并讲其接口导出到外部的能力。

模块内的本地变量是私有的，因为模块由Nodejs通过模块封装器封装在一个函数中。

```javascript
(function(exports, require, module, __filename, __dirname) {
// 模块的代码实际上在这里
});
```

通过这样做，Node.js实现了几下几点：

- 它保持了顶层的变量作用在模块范围内，而不是全局对象。
- 它有助于提供一些看似全局但实际上是模块特定的变量，例如：
    - 实现者可以用于从模块中导出的值`module`和`exports`对象
    - 包含模块绝对问文件名和目录路径的快捷变量`__filename`和`__dirname`



### AMD(2009)

AMD的提出是基于模块的加载不应该是同步的这一思想。

```javascript
// file lib/greeting.js
define(function() {
    var helloInLang = {
        en: 'Hello world!',
        es: '¡Hola mundo!',
        ru: 'Привет мир!'
    };

    return {
        sayHello: function (lang) {
            return helloInLang[lang];
        }
    };
});

// file hello.js
define(['./lib/greeting'], function(greeting) {
    var phrase = greeting.sayHello('en');
    document.write(phrase);
});
```



### UMD(2011)

UMD允许在AMD以及CommonJS中使用同一模块

```javascript
(function(define) {
    define(function () {
        var helloInLang = {
            en: 'Hello world!',
            es: '¡Hola mundo!',
            ru: 'Привет мир!'
        };

        return {
            sayHello: function (lang) {
                return helloInLang[lang];
            }
        };
    });
}(
    typeof module === 'object' && module.exports && typeof define !== 'function' ?
    function (factory) { module.exports = factory(); } :
    define
));
```

此实现的核心是立即调用函数，该函数根据环境采用不同的参数，如果将代码用作CommonJS模块，则传递的参数是以下函数：

```javascript
function (factory) {
	module.exports = factory()
}
```

如果将代码用作AMD模块，则函数参数为define。



### Labeled Modules(2012)

自2010年来，TC39委员会开始致力于新的JavaScript模块系统的开发，该系统当时被称作ES6模块。

这种格式的主要思想在于使用labels，关键字`import`和`export`是该语言的保留字，因此不能用于labels。因此，为达到此目的采用 了相应的同义词，`exports`用于导出，`require`用于导入

```javascript
// file greeting.js
var helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};

exports: var greeting = {
    sayHello: function (lang) {
        return helloInLang[lang];
    }
};

// file hello.js
require: './lib/greeting';
var phrase = greeting.sayHello('es');
document.write(phrase);
```



### YModules(2013)

YModules是在Yandex上创建的模块系统，用于解决CommonJS和AMD无法解决的任务。

```javascript
// file greeting.js
modules.define('greeting', function(provide) {
    provide({
        helloInLang: {
            en: 'Hello world!',
            es: '¡Hola mundo!',
            ru: 'Привет мир!'
        },

        sayHello: function (lang) {
            return this.helloInLang[lang];
        }
    });
});

// file app.js
modules.require(['greeting'], function(greeting) {
    document.write(greeting.sayHello('ru'));
});
// Result: "Привет мир!"
```

YModules在结构上与AMD非常相似，但是YModules的主要区别是通过特殊功能提供模块向消费者公开模块的接口，而不是像AMD那样有返回值。

此功能使您能够从异步代码的块中进行提供，也就是说，它允许对外界隐藏模块的异步性质。例如，如果我们将一些异步逻辑（例如setTimeout）添加到greeting.js中，则使用此模块的整个代码将保持不变：

```javascript
// file greeting.js
modules.define('greeting', function(provide) {
    // postpone of code execution for 1 second
    setTimeout(function () {
        provide({
            helloInLang: {
                en: 'Hello world!',
                es: '¡Hola mundo!',
                ru: 'Привет мир!'
            },

            sayHello: function (lang) {
                return this.helloInLang[lang];
            }
        });
    }, 1000);
});

// file: app.js
modules.require(['greeting'], function(greeting) {
    document.write(greeting.sayHello('ru'));
});
// result: "Привет мир!"
```

YModules的主要特征是可以与BEM定义级别一起使用

```javascript
// file moduleOnLevel1.js
modules.define('greeting', function(provide) {
    provide({
        helloInLang: {
            en: 'Hello world!',
            es: '¡Hola mundo!',
            ru: 'Привет мир!'
        },

        sayHello: function (lang) {
            return this.helloInLang[lang];
        }
    });
});

// file moduleOnLevel2.js
modules.define('greeting', function(provide, module) {
    // redeclaring of sayHello method
    module.sayHello = function (lang) {
        return module.helloInLang[lang].toUpperCase();
    };
    provide(module);
});

// file app.js
modules.require(['greeting'], function(greeting) {
    document.write(greeting.sayHello('ru'));
});
// Result: "ПРИВЕТ МИР!"
```



### ES2015 Modules(2015)

```javas
// file lib/greeting.js
const helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};

export const greeting = {
    sayHello: function (lang) {
        return helloInLang[lang];
    }
};

// file hello.js
import { greeting } from "./lib/greeting";
const phrase = greeting.sayHello("en");
document.write(phrase);
```

## 参考链接

[myshov/history-of-javascript/tree/master/4_evolution_of_js_modularity](https://github.com/myshov/history-of-javascript/tree/master/4_evolution_of_js_modularity)

