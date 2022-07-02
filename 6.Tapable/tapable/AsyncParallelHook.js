const Hook = require('./Hook')
const HookCodeFactory = require('./HookCodeFactory')
class AsyncParallelHookCodeFactory extends HookCodeFactory {
  content({ onDone }) {
    return this.callTapsParallel({ onDone })
  }
}

let factory = new AsyncParallelHookCodeFactory()
class AsyncParallelHook extends Hook {
  compile(options) {
    factory.setup(this, options)
    return factory.create(options) /// 返回的就是懒编译的 call 方法
  }
}

module.exports = AsyncParallelHook
