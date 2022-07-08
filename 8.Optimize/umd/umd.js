(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    /// commonjs2
    module.exports = factory()
  } else if (typeof exports === 'object') {
    /// commonjs
    exports['calc'] = factory
  } else if (typeof define === 'function' && define.amd) {
    /// amd
  } else {
    /// var
    root.calc = factory()
  }
})(window, () => {
  return {
    add() { },
    minus() { }
  }
})
