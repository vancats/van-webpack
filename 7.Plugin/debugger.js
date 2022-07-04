
const webpack = require('webpack')
const options = require('./webpack.config')
const compiler = webpack(options)

debugger
/// 4. 调用 Compiler 的 run 方法执行编译方法
compiler.run((err, stats) => {
  console.log(err)
  console.log(stats.toJson({
    entries: true, // 入口信息
    modules: true, // 模块信息
    chunks: true,  // 代码块
    assets: true,  // 产出资源
    files: true,   // 最后生成的文件
  }))

})
