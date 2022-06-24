
class RunPlugin {
  apply(compiler) {
    /// 注册 run 这个钩子
    compiler.hooks.run.tap('RunPlugin', () => {
      console.log('加载RunPlugin')
    })
  }
}

module.exports = RunPlugin
