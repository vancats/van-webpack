var modules = {
  './src/title.js': (module, exports, require) => {
    require.r(exports)
    require.d(exports, {
      default: () => DEFAULT_EXPORTS,
      age: () => age
    })
    const DEFAULT_EXPORTS = 'title_default'
    const age = 'title_age'
  }
}

var cache = {}
function require(moduleId) {
  var cachedModule = cache[moduleId]
  if (cachedModule !== undefined) {
    return cachedModule.exports
  }
  var module = cache[moduleId] = {
    exports: {}
  }
  modules[moduleId](module, module.exports, require)
  return module.exports
}

// 标记为 ES 模块
require.r = (exports) => {
  if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' }) // [Object Module]
  }
  Object.defineProperty(exports, '__esModule', { value: true }) // exports.__esModule = true
}

// define
require.d = (exports, definition) => {
  for (const key in definition) {
    if (require.o(definition, key) && !require.o(exports, key)) {
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
    }
  }
}

// hasOwnProperty
require.o = (obj, prop) => {
  Object.prototype.hasOwnProperty.call(obj, prop)
}

let title = require('./src/title.js')
console.log('title: ', title)
console.log('title: ', title.default)
console.log('title: ', title.age)
