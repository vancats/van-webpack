
const Compiler = require('./Compiler')

function webpack(options) {

  /// 1. 初始化参数 读取配置文件，与 shell 参数合并得到最终的配置
  let shellOptions = process.argv.slice(2) // 第一个参数是 node 路径，第二个是文件路径
    .reduce((config, args) => {
      let [key, value] = args.split('=') // --mode=development
      config[key.slice(2)] = value
      return config
    }, {})
  let finalOptions = { ...options, ...shellOptions }


  /// 2. 根据配置初始化 Compiler 对象
  let compiler = new Compiler(finalOptions)
  /// 3. 加载所有配置的插件
  if (finalOptions.plugins && Array.isArray(finalOptions.plugins)) {
    for (const plugin of options.plugins) {
      plugin.apply(compiler)
    }
  }
  return compiler
}

module.exports = webpack
