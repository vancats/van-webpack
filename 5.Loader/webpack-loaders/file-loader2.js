const { interpolateName } = require('loader-utils')

function loader(content) { /// 图片的 buffer 内容
  let options = this.getOptions() || {}
  /// 生成一个新的文件名，会继承 hash 和 ext
  let filename = interpolateName(this, options.filename, {
    content
  })
  console.log('---------------------------')
  console.log('filename: ', filename)

  /// Compile.assets[filename] = context
  /// emitFile 就是往这上面挂一个文件
  this.emitFile(filename, content)
  /// 把原来的文件路径替换为编译后的路径
  return `module.exports = ${JSON.stringify(filename)}`
}

loader.raw = true

module.exports = loader
