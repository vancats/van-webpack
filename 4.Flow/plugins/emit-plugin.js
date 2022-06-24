
class EmitPlugin {
  apply(compiler) {
    /// 挂载阶段：注册 Emit 这个钩子
    compiler.hooks.emit.tap('EmitPlugin', () => {
      /// 执行阶段
      console.log('加载EmitPlugin')
      compiler.assets['README.md'] = '请先读我'
    })
  }
}

module.exports = EmitPlugin

