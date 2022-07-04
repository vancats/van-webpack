
class DonePlugin {
  apply(compiler) {
    compiler.hooks.done.tapAsync('DonePlugin', (stats, callback) => {
      console.log('Done')
      callback()
    })
  }
}

module.exports = DonePlugin
