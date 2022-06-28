
const babel = require('@babel/core')

function loader(source, inputSourceMap, data) {

  // const options = {
  //   presets: ['@babel/preset-env'],
  //   sourceMaps: true
  // }

  const options = this.getOptions() || {}
  options.sourceMaps = true /// 肯定要生成 sourcemap
  options.inputSourceMap = inputSourceMap /// 把前一个传过来的 sourcemap 接着往下传
  options.filename = 'my' + this.request.split('!').pop().split('/').pop()
  // options.filename = 'index.js'
  const { code, map, ast } = babel.transform(source, options)

  /// 返回多个值给下一个 loader 用 callback
  this.callback(null, code, map, ast)
}


module.exports = loader
