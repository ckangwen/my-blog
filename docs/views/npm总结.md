---
title: BFC-块格式化上下文
date: 2020-04-22
categories:
  - 其他
tags:
  - 其他
---

## package.json解读

每个项目的根目录下面，一般都有一个`package.json`文件，定义了项目的配置信息。

- name：项目名称，如果不打算把项目打包发布，则name和version是可选字段。否则就必须要填写，构成项目的唯一标识，且name或作为下载的包名使用，例如`npm install <name>`

- version：版本号，需要遵守“大版本.次要版本.小版本”的格式

  - version :必须满足规定的版本
  - \>version  :大于某个版本
  - \>=version :大于等于某个版本
  - <version  :小于某个版本
  - <=version  :小于等于某个版本
  - ~version :大约等于某个版本。若指明minor，不允许超越minor;若未指明minor，则minor可变
  - ^version  :兼容性版本。从左非零版本数值限定，之后版本数值可变
  - 1.2.x  :指定某个版本数值可变
  - http://...  :指定链接
  - \*  :任意版本

- description：项目描述信息

- keywords：项目的关键字，有助于 npm search 发现，可以是一个数组

- homepage：一个指向你项目主页的url

- repository：存储库，指定代码所在位置（如果git repo在GitHub上，那么该npm docs 命令将能够找到文件位置）

  ```javascript
  "repository" :{
      "type" : "git",
      "url" : "https://github.com/npm/npm.git"
   }
  ```

- license：指明你的项目许可证，让用户知道以何种权限使用你的项目

- bugs：当用户发现了你的bugs时，可以在这里找到你并反馈给你

  ```javascript
  "bugs":{"url":"http://path/to/bug","email":"bug@example.com"}
  ```

- author：个人信息

  ```javascript
  "author":{
      "name": "xinhong",
      "email": "xinhong@anjuke.com"
  }
  ```

- contributors：用户群组

- files：描述了将软件包作为依赖项安装时要包括的文件。文件格式遵循与.gitignore类似的语法

- main：项目入口文件

- script：在项目开发过程会使用的脚本命令，我们可以运行`npm run <script-name>`来执行它们(`&&`连接多个命令使得脚本连续运行， `&`连接命令使得脚本并行运行)

- dependencies：指定了项目运行所依赖的模块，即别人使用你的项目代码时必须依赖某些插件方可使用。

- devDependencies：指定项目开发所需要的模块

- peerDependencies：它会告诉npm：如果把当前项目包(package)列为依赖的话，那么那个包也必需应该有对peerDependencies中项目的依赖

- engines：指定项目运行依赖的node版本或npm版本

- private：如果将`private`设置为`true`，那么npm将不会发布这个包

- bin：bin项用来指定各个内部命令对应的可执行文件的位置

- config：`config`字段用于添加命令行的环境变量

  ```json
  {
    "config" : { "port" : "8080" }
  }
  ```

  然后，在`server.js`脚本就可以引用`config`字段的值。

  ```javascript
  http
    .createServer(...)
    .listen(process.env.npm_package_config_port)
  ```

- style：style指定供浏览器使用时，样式文件所在的位置
- typings：指定声明文件的位置



我们可以通过环境变量`process.env`对象，拿到 npm 所有的配置变量。其中 npm 脚本可以通过`npm_config_`前缀，拿到 npm 的配置变量。通过`npm_package_`前缀，拿到`package.json`里面的字段。



## 发布包

- npm init：生成package.json

- npm adduser：注册npm账号

- npm publish：上传包(要注意npm的源，如果要上传到npm，则源必须是`http://registry.npmjs.org/`)

  如果是公开包则需要这样发布：`npm publish --access=public`

- npm version <semver>：升级版本

  - major，主版本号
  - minor，次版本号
  - patch，补丁版本号
  - premajor：预备主版本
  - prepatch：预备次版本
  - prerelease：预发布版本s

  > 版本号规范
  >
  > - 补丁版本：解决了 bug 或者一些较小的更改，增加最后一位数字，比如 1.0.1 --> 1.0.2
  > - 小版本：增加了新特性，同时不会影响之前的版本，增加中间一位数字，比如 1.0.2 --> 1.1.2
  > - 大版本：大改版，无法兼容之前的，增加第一位数字，比如 1.1.2 --> 2.1.2

  

## 其他命令



`npm config get registry`： 查看源地址

`npm --registry https://registry.npm.taobao.org install <name>`：临时使用源

`npm config set registry https://registry.npm.taobao.org`：持久使用源

`npm list -g --depth 0`： 查看全局安装过的包 -g:全局的安装包 list：已安装的node包 –depth 0：深度0

`npm doc <package-name>`：快速导航到npm软件包的文档页面

`npm bug <package-name>`：快速导航到npm软件包的bug提交页面

`npm home <package-name>`：快速导航到npm软件包的首页

`npm repo <package-name>` 在浏览器中打开GitHub repo页面

`npm audit fix` 会自动安装所有漏洞包的补丁版本(如果可用)

`npm dedupe` ：删除重复的依赖项

`npm link`：NPM link会在全局npm modules文件夹中创建一个指向我们测试包的符号链接，我们可以通过运行`npm link <package name>` 将这个包安装到我们的测试应用程序中，这将创建一个从全局安装的包到我们项目 `node_modules` 目录的符号链接