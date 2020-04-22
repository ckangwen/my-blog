var dojo = {}
dojo._modulePrefixs = {
  dojo: {
    name: 'dojo',
    value: '.'
  }
}
dojo._global = this
dojo.baseUrl = djConfig['baseUrl']

// map a module name to a path
// An unregister module is given the default part of ../<module>, relative to Dojo root
// For example module acme is mapped to ../acme
dojo.registerModulePath = function(module, prefix) {
  dojo._modulePrefixs[module] = {
    name: module,
    value: prefix
  }
}


dojo.provide = function (resourceName) {
  resourceName = resourceName + ''
  return dojo._loadModules[resourceName] = this.getObject(resourceName, true)
}


dojo._getModulePrefix = function (module) {
  const mp = this._modulePrefixs
  if (this._moduleHasPrefix(module)) {
    return mp[module].value
  }
  return module
}

dojo._moduleHasPrefix = function (module) {
  const mp = this._modulePrefixs
  return !!mp[module]
}

dojo.getObject = function (name, create, ctx) {
  let context = ctx || this._global
  const names = name.split('.')
  names.forEach(item => {
    context = (item in context) ? context[item] : (create ? context[item] = {} : undefined)
  })
  return context
}

/**
 * _loadModule('A.B') first checks to see if symbol A.B is defined
 * if it is, it is simply returned
 * if it is not defined, it will look for 'A/B.js' in the script root directory
 *
 * This does nothing about importing symbols into the current package
 * It presumed that the caller will take care of that
 * For example to import all symbols
 * | with (dojo._loadModule('A.B')) {}
 * and to import just the leaf symbol
 * | var B = dojo._loadModule('A.B')
 *
 * @returns the required namespace object
 * @param {*} moduleName
 * @param {*} omitModuleCheck
 */

dojo._global_omit_module_check = false
dojo._loadModules = {}
dojo._loadModule = dojo.require = function (moduleName, omitModuleCheck) {
  omitModuleCheck = this._global_omit_module_check || omitModuleCheck
  let module = this._loadModules[moduleName]
  if (module) return module

  // 将句点转换为斜线
  const realpath = this._getModuleSymbols(moduleName).join('/') + '.js'
  const moduleArg = (!omitModuleCheck) ? moduleName : null
  const ok = this._loadPath(realpath, moduleArg)
  if ((!ok) && (!omitModuleCheck)) {
    throw new Error("Could not load '" + moduleName + "'; last tried '" + realpath + "'");
  }

  // check that the symbol was defined
  // Don't bother if we're doing xdomain (asynchronous) loading.
  if ((!omitModuleCheck) ) {
    // pass in false so we can give better error
    module = this._loadModules[moduleName];
    if (!module) {
      throw new Error("symbol '" + moduleName + "' is not defined after loading '" + relpath + "'");
    }
  }
  return module
}
/**
 * 将点分JS表示法中的模块名称转换为源树中路径的数组
 * @param {*} moduleName
 */
dojo._getModuleSymbols = function (moduleName) {
  const symbols = moduleName.split('.')
  for (let i = symbols.length; i > 0; i--) {
    let parentModule = symbols.slice(0, i).join('.')
    // 没有dojo的前缀，则是自定义的js文件
    if (i === 1 && !this._moduleHasPrefix(parentModule)) {
      symbols[0] = './' + symbols[0]
    } else {
      let parentModulePath = this._getModulePrefix(parentModule)
      if (parentModulePath !== parentModule) {
        symbols.splice(0, i, parentModulePath)
        break
      }
    }
  }
  return symbols
}

/**
 * Load a Javascript module given a relative path
 * load and interpret the script located at realpath,
 * which is relative to the script root directory
 * @param {*} realpath
 * @param {*} module
 * @param {*} callback
 */
// app/hello.js app.hello undefined
dojo._loadPath = function (realpath, module, callback) {
  // uri: './scripts/apphello.js'
  const uri = (((realpath.charAt(0) === '/') || realpath.match(/^\w+:/)) ? '' : dojo.baseUrl) + realpath
  try {
    return !module ? this._loadUri(uri, callback) : this._loadUriAndCheck(uri, module, callback); // Boolean
  } catch (error) {
    console.debug(error)
    return false
  }
}
// ['../aa', 'bb', 'cc']
// console.log(_getModuleSymbols('aa.bb.cc'))
// ['.', 'aa']
// console.log(_getModuleSymbols('dojo.aa'))

// load javascript from a URI
// read the content of the URI, and evaluates the contents
// This is used to load mofules as well as resource bundles
// Returns true if it succeeded. Returns false if the URI reading failed.
// uri: a uri which points at the script to be loaded
dojo._loadUrls = []
dojo._loadUri = function (uri, callback) {
  if (this._loadUrls[uri]) {
    return true
  }
  const targetURL = window.location.href
  const contents = this._getText(this.URLNormalize(uri, targetURL.substring(0, targetURL.lastIndexOf('/'))), true)
  if (!contents) return false

  this._loadUrls[uri] = true
  this._loadUrls.push(uri)
  if (callback) contents = `(${contents})`
  const value = eval(contents + '\r\n//@ sourceURL=' + uri)
  if (callback) callback(value)
  return true
}

dojo._loadUriAndCheck = function (uri, moduleName, callback) {
  let ok = false
  try {
    ok = this._loadUri(uri, callback)
  } catch (error) {
    console.debug('failed loading ' + uri + ' with error ' + error)
  }
  return !!(ok && this._loadModules[moduleName])
}

dojo._getText = function (url) {
  const http = new XMLHttpRequest()
  http.open('GET', url, false)
  try {
    http.send(null)
    if (!this._documentReady(http)) {
      throw new Error('can not load resource')
    }
  } catch (error) {
    throw error
  }
  return http.responseText
}
dojo._documentReady = function (http) {
  const stat = http.status || 0
  return ((stat >= 200) && (stat < 300)) || 	// Boolean
    (stat == 304) || 						// allow any 2XX response code
    (stat == 1223) || 						// get it out of the cache
    (!stat && (location.protocol == "file:"));
}

dojo.URLNormalize = function (src, basePath) {
  var protocol = /^((ht|f)tps?)/.exec(basePath),
    basePath = protocol ? basePath : 'http://' + basePath,
    domain = /^\w+\:\/\/\/?[^\/]+/.exec(basePath)[0];

  function deleteLastFolder(str) {
    var i = str.lastIndexOf("\/");
    if (i < 10) {
      return str;
    } else {
      return str.substring(0, i);
    }
  }

  function folderParse(path) {
    var level = 0,
      name = path.replace(/\.\.\//g, function (v) {
        level++;
        return '';
      });
    return {
      level: level,
      name: name
    }
  }

  function basePathParse(path, basePath) {
    var folder = folderParse(path);
    basePath = basePath.replace(/(.*)\/+$/g, '$1');
    for (var i = 0; i < folder.level; i++) {
      basePath = deleteLastFolder(basePath)
    }
    return basePath + '/' + folder.name;
  }

  if (/^\/\/\/?/.test(src)) {
    // eg.  //cdn.com/1.jpg
    src = (protocol ? (protocol[0] + ':') : 'http:') + src;
  } else if (!/^\w+\:\/\//.test(src)) {
    if (/^\/+/.test(src)) {
      // eg.  /1.jpg
      src = domain + src;
    } else if (/^\.\/+/.test(src)) {
      // eg.  ./1.jpg
      src = src.replace(/^\.\/+/, '');
      src = basePath + '/' + src;
    } else if (/^\.\.\/+/.test(src)) {
      // eg.  ../1.jpg
      src = basePathParse(src, basePath)
    } else {
      // eg.  1.jpg
      src = basePath + '/' + src;
    }
  }
  return src;
}

const djModule = djConfig.modulePaths
if (djModule) {
  for (let param in djModule) {
    dojo.registerModulePath(param, djModule[param])
  }
}