
  (() => {
    var modules = ({
      
    })
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
    var exports = {};
    (() => {
      const title = require("./src/title.js");

console.log('title2: ', title);
console.log("logger2");
console.log("logger1");
    })()
  })()
  