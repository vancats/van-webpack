var modules = {
  './src/title.js': function (module, exports, require) {
    // module.exports = 'title'
    exports.name = 'name'
    exports.age = 'age'
  }
}

let cache = {}
function require(moduleId) {
  if (cache[moduleId] !== undefined) {
    return cache[moduleId]
  }

  var module = cache[moduleId] = {
    exports: {}
  }

  modules[moduleId](module)
  return module.exports
}

let title = require('../src/title.js')
console.log('title: ', title)
