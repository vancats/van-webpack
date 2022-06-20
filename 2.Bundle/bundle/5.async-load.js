// 原始 main.js 中没有模块定义
var modules = {}
var cache = {}

function require(moduleId) {
  var cacheModule = cache[moduleId]
  if (cacheModule !== undefined) {
    return cacheModule.exports
  }
  var module = cache[moduleId] = { exports: {} }
  modules[moduleId](module, module.exports, require)
  return module.exports
}

require.m = modules

require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)

// 标记为 ES 模块
require.r = (exports) => {
  if (typeof Symbol !== undefined && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: 'Module'
    })
  }
  Object.defineProperty(exports, '__esModule', { value: true })
}

require.d = (exports, definition) => {
  for (const key in definition) {
    if (require.o(definition, key) && !require.o(exports, key)) {
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
    }
  }
}

// publicPath
require.p = ''
// 文件名
require.u = (chunkId) => {
  return '' + chunkId + '.js'
}

// 通过 JSONP 异步加载代码块
require.e = (chunkId) => {
  let promises = []
  for (const key in require.f) {
    let func = require.f[key]
    func(chunkId, promises)
  }
  return Promise.all(promises)
  // return Promise.all(Object.keys(require.f)).reduce((promises, key) => {
  //   require.f[key](chunkId, promises)
  //   return promises
  // }, [])
}

require.f = {}
// key: 代码块 value 0 是加载完成
var installedChunks = {
  main: 0
}
require.f.j = (chunkId, promises) => {
  var installedChunkData = require.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined
  // 没有加载完成
  if (installedChunkData !== 0) {
    // 有值，可能正在加载
    if (installedChunkData) {
      // 直接取出上一个 promise
      promises.push(installedChunkData[2])
    } else {
      var promise = new Promise((resolve, reject) => {
        installedChunkData = installedChunks[chunkId] = [resolve, reject]
      })
      promises.push(installedChunkData[2] = promise)
      var url = require.p + require.u(chunkId)
      require.l(url)
    }
  }
}

// load
require.l = (url) => {
  let script = document.createElement('script')
  script.src = url
  document.head.appendChild(script)
}

function webpackJsonpCallback(data) {
  var [chunkIds, moreModules] = data
  for (moduleId in moreModules) {
    require.m[moduleId] = moreModules[moduleId]
  }
  for (let i = 0, chunkId; i < chunkIds.length; i++) {
    chunkId = chunkIds[i] // src_title_js
    installedChunks[chunkId][0]() // 让 resolve 对应的 Promise fulfilled
    installedChunks[chunkId] = 0
  }
}

var chunkLoadingGlobal = self["webpackChunk_2_bundle"] = self["webpackChunk_2_bundle"] || []
chunkLoadingGlobal.push = webpackJsonpCallback

var exports = {}
document.addEventListener('click', () => {
  require.e('src_title_js').then(require.bind(require, './src/title.js')).then(res => {
    console.log(res.default)
  })

  require.e('src_title_js').then(require.bind(require, './src/title.js')).then(res => {
    console.log(res.default)
  })
})
