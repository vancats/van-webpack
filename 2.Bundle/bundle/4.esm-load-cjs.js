var modules = {
  './src/title.js': function (module, exports, require) {
    // module.exports = {
    //   name: 'name',
    //   age: 'age'
    // }
    require.r(exports)
    require.d(exports, {
      default: () => DEFAULT_EXPORTS,
      age: () => age
    })
    const DEFAULT_EXPORTS = 'title_default'
    const age = 'title_age'
  }
}

let cache = {}

function require(moduleId) {
  var cacheModule = cache[moduleId]
  if (cacheModule !== undefined) {
    return cacheModule.exports
  }
  var module = cache[moduleId] = {
    exports: {}
  }
  modules[moduleId](module, module.exports, require)
  return module.exports
}

// 标记为 ES 模块
require.r = (exports) => {
  if (typeof Symbol !== undefined && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: 'Module'
    })
  }
  Object.defineProperty(exports, '__esModule', { value: true })
}

// DefineProperty
require.d = (exports, definition) => {
  for (var key in definition) {
    if (require.o(definition, key) && !require.o(exports, key)) {
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
    }
  }
}

require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)

// 处理 default 的情况，当有 module.exports 时出现
require.n = (module) => {
  let getter = module.__esModule ? () => module.default : () => module
  require.d(getter, { a: getter })
  return getter
}

var exports = {}
require.r(exports)
let title = require('./src/title.js')
let title_default = require.n(title)
console.log(title)
console.log(title_default())
console.log(title.age)
