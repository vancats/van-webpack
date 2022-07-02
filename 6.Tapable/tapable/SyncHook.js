const Hook = require('./Hook')
const HookCodeFactory = require('./HookCodeFactory')
class SyncHookCodeFactory extends HookCodeFactory {
  content({ onDone }) {
    return this.callTapsSeries({ onDone })
  }
}

let factory = new SyncHookCodeFactory()
class SyncHook extends Hook {
  compile(options) {
    factory.setup(this, options)
    return factory.create(options) /// 返回的就是懒编译的 call 方法
  }
}

module.exports = SyncHook
