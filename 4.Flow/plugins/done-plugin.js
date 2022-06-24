
class DonePlugin {
  apply(compiler) {
    /// 挂载阶段：注册 done 这个钩子
    compiler.hooks.done.tap('DonePlugin', () => {
      /// 执行阶段
      console.log('加载DonePlugin')
    })
  }
}

module.exports = DonePlugin

