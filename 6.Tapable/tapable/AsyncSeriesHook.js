const Hook = require('./Hook')
const HookCodeFactory = require('./HookCodeFactory')
class AsyncSeriesHookCodeFactory extends HookCodeFactory {
  content({ onDone }) {
    return this.callTapsSeries({ onDone })
  }
}

let factory = new AsyncSeriesHookCodeFactory()
class AsyncSeriesHook extends Hook {
  compile(options) {
    /// _x 数组赋值
    factory.setup(this, options)
    return factory.create(options) /// 返回的就是懒编译的 call 方法
  }
}

module.exports = AsyncSeriesHook
