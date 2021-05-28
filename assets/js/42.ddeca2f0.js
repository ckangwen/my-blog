(window.webpackJsonp=window.webpackJsonp||[]).push([[42],{504:function(t,s,a){"use strict";a.r(s);var n=a(2),r=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"浏览器是多进程的"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#浏览器是多进程的"}},[t._v("#")]),t._v(" 浏览器是多进程的")]),t._v(" "),a("p",[t._v("它主要包括以下进程")]),t._v(" "),a("ul",[a("li",[t._v("Browser进程：浏览器的主进程，负责创建和销毁其他进程、网络资源的下载与管理、浏览器界面的展示、前进后退等。")]),t._v(" "),a("li",[t._v("GPU进程：用于3D绘制等")]),t._v(" "),a("li",[t._v("第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建")]),t._v(" "),a("li",[t._v("浏览器渲染进程（浏览器内核）：渲染进程内部是多线程的，每打开一个网页就会创建一个进程，主要用于页面渲染，脚本执行，事件处理等")])]),t._v(" "),a("p",[t._v("渲染进程")]),t._v(" "),a("p",[t._v("浏览器的渲染的多线程的，页面的渲染，JavaScript的执行，事件的循环，都在这个进程内进行")]),t._v(" "),a("ul",[a("li",[t._v("GUI渲染线程：负责渲染浏览器界面")]),t._v(" "),a("li",[t._v("JavaScript引擎线程：负责处理JavaScript脚本程序、解析JavaScript运行代码等")]),t._v(" "),a("li",[t._v("事件触发线程：用来控制浏览器事件循环")]),t._v(" "),a("li",[t._v("定时触发器线程： "),a("code",[t._v("setInterval")]),t._v(" 与 "),a("code",[t._v("setTimeout")]),t._v(" 所在线程")]),t._v(" "),a("li",[t._v("异步http请求线程：在 "),a("code",[t._v("XMLHttpRequest")]),t._v(" 连接后通过浏览器新开一个线程请求，将检测到状态变更时，如果设置有回调函数，异步线程就"),a("strong",[t._v("产生状态变更事件")]),t._v("，将这个回调再放入事件队列中。再由 JavaScript 引擎执行。")])]),t._v(" "),a("p",[t._v("其中"),a("strong",[t._v("GUI渲染线程与JS引擎线程是互斥的")]),t._v("，由于JavaScript是可操纵DOM的，如果在修改这些元素属性同时渲染界面，那么渲染线程前后获得的元素数据就可能不一致了。")]),t._v(" "),a("p",[a("strong",[t._v("JavaScript阻塞页面加载")])]),t._v(" "),a("p",[t._v("因为JS引擎与GUI渲染进程是互斥的，所以如果GUI需要进行更新的同时，JS引擎正在进行巨量的计算，那么GUI渲染进程需要等待JS引擎空闲后才能执行，如此一来便会导致页面的渲染不连贯。")]),t._v(" "),a("br"),t._v(" "),a("p",[a("strong",[t._v("浏览器渲染流程")])]),t._v(" "),a("p",[t._v("浏览器器内核拿到内容后，渲染大概可以划分成以下几个步骤：")]),t._v(" "),a("ol",[a("li",[t._v("解析HTML，建立DOM树")]),t._v(" "),a("li",[t._v("解析CSS，将CSS代码解析成树形结构然后结合DOM合并成render树")]),t._v(" "),a("li",[t._v("布局render树，计算元素的尺寸或位置")]),t._v(" "),a("li",[t._v("绘制render树，绘制页面像素信息")]),t._v(" "),a("li",[t._v("浏览器将各层信息给GPU，GPU将各层合成显示在屏幕上")])]),t._v(" "),a("p",[a("img",{attrs:{src:"https://user-gold-cdn.xitu.io/2018/1/22/1611cb18d3a3938b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1",alt:"img"}})]),t._v(" "),a("h2",{attrs:{id:"javascript是单线程的"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#javascript是单线程的"}},[t._v("#")]),t._v(" JavaScript是单线程的")]),t._v(" "),a("p",[t._v("所谓单线程，是指在 JavaScript 引擎中负责解释和执行 JavaScript 代码的线程唯一，同一时间上只能执行一件任务。")]),t._v(" "),a("p",[t._v("JavaScript单线程机制的原型是为了避免DOM渲染冲突。如果 JavaScript 引擎线程不是单线程的，那么可以同时执行多段 JavaScript，如果这多段 JavaScript 都修改 DOM，那么就会出现 DOM 冲突。")]),t._v(" "),a("p",[a("strong",[t._v("同步与异步")])]),t._v(" "),a("p",[t._v("如果在函数返回的时候，调用者就能够得到预期结果(即拿到了预期的返回值或者看到了预期的效果)，那么这个函数就是同步的。")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" a "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v("\nMath"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("floor")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("a"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nconsole"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("a"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 1")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br")])]),a("p",[t._v("如果在函数 "),a("code",[t._v("func")]),t._v(" 返回的时候，调用者还不能够得到预期结果，而是需要在将来通过一定的手段得到，那么这个函数就是异步的。")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[t._v("fs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("readFile")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'foo.txt'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'utf8'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("err"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" data")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("data"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br")])]),a("p",[t._v("JavaScript采用异步编程的原因是")]),t._v(" "),a("ul",[a("li",[t._v("JavaScript是单线程的")]),t._v(" "),a("li",[t._v("提高CPU的利用率")])]),t._v(" "),a("br"),t._v(" "),a("h2",{attrs:{id:"event-loop"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#event-loop"}},[t._v("#")]),t._v(" Event Loop")]),t._v(" "),a("p",[t._v("我们知道JavaScript是单线程的，那么这样势必会发生因异步请求时间过长而导致阻塞的问题。解决此问题的方式就是事件循环。")]),t._v(" "),a("h3",{attrs:{id:"执行栈与事件队列"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#执行栈与事件队列"}},[t._v("#")]),t._v(" 执行栈与事件队列")]),t._v(" "),a("p",[t._v("我们知道，当我们调用一个方法的时候，js会生成一个与这个方法对应的执行环境（context），又叫执行上下文。这个执行环境中存在着这个方法的私有作用域、上层作用域的指向、方法的参数和这个作用域中定义的变量以及这个作用域的this对象。 而当一系列方法被依次调用的时候，因为js是单线程的，"),a("strong",[t._v("同一时间只能执行一个方法")]),t._v("，于是这些方法被排队在一个单独的地方。这个地方被称为执行栈(Call Stack)，JavaScript中只有一个执行栈。")]),t._v(" "),a("p",[t._v("当一个脚本第一次执行的时候，js引擎会解析这段代码，并将其中的同步代码按照执行顺序加入执行栈中，然后从头开始执行。")]),t._v(" "),a("p",[t._v("如果当前执行的代码是一个方法，那么js会向执行栈中添加这个方法的执行环境，然后进入这个执行环境继续执行其中的代码。当这个执行环境中的代码 执行完毕并返回结果后，js会退出这个执行环境并把这个执行环境销毁，回到上一个方法的执行环境。。这个过程反复进行，直到执行栈中的代码全部执行完毕。")]),t._v(" "),a("br"),t._v(" "),a("p",[t._v("如果就是引擎遇到一个异步事件之后，他会将这个事件挂起，继续调用执行栈中的其他任务。当该异步事件执行结束之后，js会将这个事件加入与当前执行栈不同的另一个队列，事件队列(Task Queue)，这也被叫做任务队列或消息队列。")]),t._v(" "),a("p",[a("strong",[t._v("被放入事件队列后不会立刻执行其中的回调函数，而是等待执行栈中所有的任务执行完毕")]),t._v("，主线程处于闲置状态时，主线程回去事件队列中查询是否有任务。如果有，那么主线程会依次取出其中的事件，并把这个事件对应的回调放入执行栈中，然后执行其中的同步代码，执行栈为空之后再检查事件队列。这样就形成了一个无限的循环。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://picb.zhimg.com/80/v2-da078fa3eadf3db4bf455904ae06f84b_720w.jpg",alt:"img"}})]),t._v(" "),a("h3",{attrs:{id:"macrotask与microtask"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#macrotask与microtask"}},[t._v("#")]),t._v(" macrotask与microtask")]),t._v(" "),a("p",[t._v("在事件循环中，异步事件会被放入事件队列中。然而，浏览器会根据这个异步事件的类型，把这个事件放入对应的宏任务队列或者微任务队列中去。")]),t._v(" "),a("p",[t._v("所以异步任务被分为两类：微任务（micro task）和宏任务（macro task）。它们的执行优先级是有区别的。")]),t._v(" "),a("div",{staticClass:"language-javascript line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[t._v("console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("setTimeout")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\nPromise"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("resolve")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\tconsole"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("4")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\nconsole"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 1 5 3 4 2")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br"),a("span",{staticClass:"line-number"},[t._v("11")]),a("br"),a("span",{staticClass:"line-number"},[t._v("12")]),a("br"),a("span",{staticClass:"line-number"},[t._v("13")]),a("br"),a("span",{staticClass:"line-number"},[t._v("14")]),a("br")])]),a("p",[a("strong",[t._v("宏任务")])]),t._v(" "),a("p",[t._v("可以理解是每次执行栈执行的代码就是一个宏任务。浏览器为了能够使得JS内部宏任务与DOM任务能够有序的执行，会在一个宏任务执行结束后，在下一个宏任务执行开始前，对页面进行重新渲染")]),t._v(" "),a("p",[t._v("宏任务主要包括")]),t._v(" "),a("ul",[a("li",[t._v("setTimeout")]),t._v(" "),a("li",[t._v("setInterval")]),t._v(" "),a("li",[t._v("setImmediate")]),t._v(" "),a("li",[t._v("I/O")]),t._v(" "),a("li",[t._v("UI交互事件")])]),t._v(" "),a("p",[a("strong",[t._v("微任务")])]),t._v(" "),a("p",[t._v("微任务可以理解是在当前宏任务执行结束后立即执行的任务，也就是说在某一个宏任务执行完后，就会将在它执行期间产生的所有微任务都执行完毕")]),t._v(" "),a("p",[t._v("微任务主要包含")]),t._v(" "),a("ul",[a("li",[t._v("Promise")]),t._v(" "),a("li",[t._v("process.nextTick")]),t._v(" "),a("li",[t._v("MutaionObserver")])]),t._v(" "),a("p",[a("img",{attrs:{src:"https://user-gold-cdn.xitu.io/2019/12/11/16ef33bf10b610d9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1",alt:"img"}})]),t._v(" "),a("p",[t._v("异步任务运行机制如下")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("执行一个宏任务（栈中没有就从事件队列中获取）")])]),t._v(" "),a("li",[a("p",[t._v("执行过程中如果遇到微任务，就将它添加到微任务的任务队列中")])]),t._v(" "),a("li",[a("p",[t._v("宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）")])]),t._v(" "),a("li",[a("p",[t._v("当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染")])]),t._v(" "),a("li",[a("p",[t._v("渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）")])])]),t._v(" "),a("h3",{attrs:{id:"todo"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#todo"}},[t._v("#")]),t._v(" TODO")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://github.com/FridaS/blog/issues/22",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/FridaS/blog/issues/22"),a("OutboundLink")],1)]),t._v(" "),a("blockquote",[a("p",[t._v("参考资料")]),t._v(" "),a("p",[a("a",{attrs:{href:"https://juejin.im/post/5df071a9518825123e7aef17",target:"_blank",rel:"noopener noreferrer"}},[t._v("一文看懂浏览器事件循环"),a("OutboundLink")],1)])])])}),[],!1,null,null,null);s.default=r.exports}}]);