const fs = require('fs')
const path = require('path')
function Module(id, parent) {
  this.id = id
  this.filename = null
  this.parent = parent
}

Module.prototype.require2 = function(modulePath) {
  const absolutePath = path.resolve('.', modulePath)
  console.log(absolutePath)
  // Module._resolvePath(modulePath, this)
}


let _modulePaths = []
Module._resolvePath = function(modulePath, parent) {

  // 父模块没有加载
  // 父模块是主模块(入口模块)
  if (!parent || !parent.id || !parent.filename) {
    // TODO mainPaths 的含义是？
    let mainPaths = ['.'].concat(modulePath)
    return [modulePath, mainPaths]
  }
}

new Module().require2('./a.js')