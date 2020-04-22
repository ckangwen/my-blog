const assert = require('assert').ok
const fs = require('fs')
const util = require('util')
const path = require('path')
const runInThisContext = require('vm').runInThisContext;




// const debug = util.debuglog('module')
function Module(id, parent) {
  this.id = id;
  this.exports2 = {};
  this.parent = parent;
  if (parent && parent.children) {
    parent.children.push(this)
  }

  this.filename = null;
  this.loaded = false;
  this.children = [];
}


// https://github.com/nodejs/node-v0.x-archive/blob/master/src/node.js
Module.wrapper = [
  '(function (exports2, require2, module2, __filename, __dirname){',
  '\n})'
]

Module.wrap = function(script) {
  return Module.wrapper[0] + script + Module.wrapper[1]
}
Module.wrap = function(script) {
  return `
  (function (exports2, require2, module2, __filename, __dirname){
    ${script}
  })
  `
}

// module.exports2 = Module
// Module._contextLoad = (+process.env['NODE_MODULE_CONTEXTS'] > 0)
Module._cache = {};
Module._pathCache = {};
Module._extensions = {};
Module.globalPaths = []
// 已知的真实路径的列表
Module._realpathCache = {}

let modulePaths = [],
packageMainCache = {}

Module.prototype._compile = function(content, filename) {
  const self = this
  // 移除shell、bash的特殊标记
  content = content.replace(/^\#\!.*/, '')

  function require2(path) {
    return self.require2(path)
  }

  require2.resolve = function(request) {
    return Module._resolveFilename(request, self)
  }

  require2.main = process.mainModule

  require2.extensions = Module._extensions

  require2.cache = Module._cache

  let dirname = path.dirname(filename)

  const wrapper = Module.wrap(content)

  // 在当前的global对象的上下文中编译并执行wrapper，最后返回结果
  // 运行中的代码无法获取本地作用域，但是可以获取当前的global对象
  const compiledWrapper = runInThisContext(wrapper, { filename: filename });

  // Module.wrapper[0] = '(function (exports, require2, module2, __filename, __dirname){',
  const args = [self.exports2, require2, self, filename, dirname];
  return compiledWrapper.apply(self.exports, args)

}

Module.prototype.load = function(filename) {
  // debug('load ' + JSON.stringify(filename) + ' for module ' + JSON.stringify(this.id))

  assert(!this.loaded)
  this.filename = filename
  this.paths = Module._nodeModulePaths(path.dirname(filename))

  // filename: C:\all\Note\Blog-resources\模块化\4_evolution_of_js_modularity\j_commonjs_2009\other\test.js
  // paths
  // [
  //   'C:\\all\\Note\\Blog-resources\\模块化\\4_evolution_of_js_modularity\\j_commonjs_2009\\other\\node_module',
  //   'C:\\all\\Note\\Blog-resources\\模块化\\4_evolution_of_js_modularity\\j_commonjs_2009\\other\\node_module',
  //   'C:\\all\\Note\\Blog-resources\\模块化\\4_evolution_of_js_modularity\\j_commonjs_2009\\node_module',
  //   'C:\\all\\Note\\Blog-resources\\模块化\\4_evolution_of_js_modularity\\node_module',
  //   'C:\\all\\Note\\Blog-resources\\模块化\\node_module',
  //   'C:\\all\\Note\\Blog-resources\\node_module',
  //   'C:\\all\\Note\\node_module',
  //   'C:\\all\\node_module',
  //   'C:\\node_module'
  // ]
  let extension = path.extname(filename) || '.js'
  if (!Module._extensions[extension]) extension = '.js'

  Module._extensions[extension](this, filename)
  this.loaded = true
}

Module.prototype.require2 = function(path) {
  assert(path, 'missing path')
  assert(util.isString(path), 'path must be a string')
  return Module._load(path, this)
}


// 如果请求的module已经被缓存，则返回被缓存的对象的exports对象
// 如果module是原生的模块，则调用`NativeModule.require()`
// 否则，为该文件创建一个新的module，并存入缓存
Module._load = function(request, parent, isMain) {
  if (parent) {
    // debug('Module._load REQUEST  ' + (request) + ' parent: ' + parent.id);
  }

  // 计算绝对路径
  const filename = Module._resolveFilename(request, parent)
  console.log(1, filename)
  let cachedModule = Module._cache[filename]
  if (cachedModule) {
    return cachedModule.exports2
  }

  const module = new Module(filename, parent)

  if (isMain) {
    process.mainModule = module;
    module.id = '.';
  }

  Module._cache[filename] = module

  let hadException = true
  try {
    module.load(filename)
    hadException = false
  } finally {
    if (hadException) {
      delete Module._cache[filename]
    }
  }

  return module.exports2
}

// 确定所有可能的路径
// 从当前路径开始一级级向上寻找node_modules子目录
Module._resolveFilename = function(request, parent) {
  const resolvedModule = Module._resolveLookupPaths(request, parent)
  let id = resolvedModule[0]
  let paths = resolvedModule[1]
  const filename = Module._findPath(request, paths)

  if (!filename) {
    var err = new Error("Cannot find module '" + request + "'")
    err.code = 'MODULE_NOT_FOUND'
    throw err
  }
  return filename
}


Module._resolveLookupPaths = function(request, parent) {
  const start = request.substring(0, 2)
  if (start !== './' && start !== '..') {
    let paths = modulePaths
    if (parent) {
      if (!parent.path) parent.path = []
      paths = parent.path.concat(paths)
    }
    return [request, paths]
  }

  if (!parent || !parent.id || !parent.filename) {
    // make require('./path/to/foo') work, normally the path is taken
    // from realpath(_filename) but with eval there is no filename
    let mainPaths = ['.'].concat(modulePaths)
    mainPaths = Module._nodeModulePaths('.').concat(mainPaths)
    return [request, mainPaths]
  }

  const isIndex = /^index\.\w?$/.test(path.basename(parent.filename))
  const parentIdPath = isIndex ? parent.id : path.dirname(parent.id)
  const id = path.resolve(parentIdPath, request)

  if (parentIdPath === '.' && id.indexOf('/') === -1) {
    id = './' + id
  }

  return [id, [path.dirname(parent.filename)]]
}

// 找到正确的module名，并存入_pathCache
Module._findPath = function(request, paths) {
  console.log(9, request, paths)
  const extensions = Object.keys(Module._extensions)

  if (request.charAt(0) === '/') {
    paths = []
  }

  // 最后一个字符是'/'
  let trailingSlash = request.slice(-1) === '/'

  let cacheKey = JSON.stringify({request, paths})

  if (Module._pathCache[cacheKey]) {
    return Module._pathCache[cacheKey]
  }

  for(let i = 0; i < paths.length; i++) {
  // basePath
  // C:\Users\24370\.node_module\test.js
  // C:\Users\24370\.node_module\test.js\index
  // C:\Program Files\lib\node\test.js
  // C:\Program Files\lib\node\test.js\index
  const basePath = path.resolve(paths[i], request)
    let filename
    if (!trailingSlash) {
      filename = tryFile(basePath)

      if (!filename) {
        filename = tryExtensions(basePath, extensions)
      }
    }

    if (!filename) {
      filename = tryPackage(basePath, extensions)
      filename = tryExtensions(path.resolve(basePath, 'index'), extensions)
    }

    if (filename) {
      Module._pathCache[cacheKey] = filename
      return filename
    }
  }
  return false
}


// 从form文件开始，向上查找所有相关的node_module目录
Module._nodeModulePaths = function(from) {
  // 转换为绝对路径
  from = path.resolve(from)
  let paths = []
  const splitRe = process.platform === 'win32' ? /[\/\\]/ : /\//

  const parts = from.split(splitRe)


  for (let i = parts.length- 1; i >= 0; i--) {
    if (parts[i] === 'node_module') continue
    const dir = parts.slice(0, i + 1).concat('node_module').join(path.sep)
    paths.push(dir)
  }
  return paths
}


function tryPackage(requestPath, extensions) {
  let pkg = readPackage(requestPath)

  if (!pkg) return false
  const filename = path.resolve(requestPath, pkg)
  return tryFile(filename) || tryExtensions(filename, extensions)
    || tryExtensions(path.resolve(filename, 'index'), extensions)
}
function readPackage(requestPath) {
  if (Object.prototype.hasOwnProperty(packageMainCache, requestPath)) {
    return packageMainCache[requestPath]
  }

  try {
    const jsonPath = path.resolve(requestPath, 'package.json')
    const json = fs.readFileSync(jsonPath, 'utf-8')
  } catch (error) {
    return false
  }

  try {
    const pkg = packageMainCache[requestPath] = JSON.parse(json).main
  } catch (error) {
    error.path = json.path
    error.message = 'Error parsing ' + jsonPath + ': ' + error.message
    throw error
  }
  return pkg
}

function tryExtensions(requestPath, exts) {
  let filename
  for(let i = 0; i < exts.length; i++) {
    filename = tryFile(requestPath + exts[i])
    if (filename) {
      return filename
    }
  }

  return false
}

function tryFile(requestPath) {
  const stats = statPath(requestPath)
  if (stats && !stats.isDirectory()) {
    return fs.realpathSync(requestPath, Module._realpathCache)
  }
  return false
}
function statPath(path) {
  try {
    return fs.statSync(path)
  } catch (e) {
    return false
  }
}

Module._initPaths = function() {
  const isWindows = process.platform === 'win32';
  let homeDir
  if (isWindows) {
    homeDir = process.env.USERPROFILE
  } else {
    homeDir = process.env.HOME
  }

  //process.execPath: C:\Program Files\nodejs\node.exe
  // paths: ['C://Programe Files\\lib\\node']
  // homeDir: C:\User\24370
  let paths = [path.resolve(process.execPath, '..', '..', 'lib', 'node')]

  if (homeDir) {
    // paths: [ 'C:\\Users\\24370\\.node_module', 'C:\\Program Files\\lib\\node' ]
    paths.unshift(path.resolve(homeDir, '.node_module'))
  }

  const nodePath = process.env['NODE_PATH']
  if (nodePath) {
    path = nodePath.split(path.delimiter).concat(paths)
  }

  modulePaths = paths
  Module.globalPaths = modulePaths.slice(0)
}

Module._extensions['.json'] = function(module, filename) {
  let content = fs.readFileSync(filename, 'utf8')
  try {
    module.exports2 = JSON.parse(stripBOM(content))
  } catch (err) {
    err.message = filename + ': ' + err.message
    throw err
  }
}

Module._extensions['.js'] = function(module, filename) {
  let content = fs.readFileSync(filename, 'utf-8')
  module._compile(stripBOM(content), filename)
}

function stripBOM(content) {
  // 删除字节顺序标记(byte order marker)
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1)
  }
  return content
}
Module._initPaths()


let _module = new Module()
// _module.require2('./b.js')
let c = _module.require2('./c.json')