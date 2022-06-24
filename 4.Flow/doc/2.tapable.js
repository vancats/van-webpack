let { SyncHook } = require('tapable')

class SyncHook {
  constructor() {
    this.taps = []
  }
  tap(name, fn) {
    this.taps.push(fn)
  }
  call() {
    this.taps.forEach(tap => tap())
  }
}

/// 创建实例
let hook = new SyncHook(

)

/// 注册事件
hook.tap('a', () => {
  console.log('a')
})

hook.tap('b', () => {
  console.log('b')
})

hook.tap('c', () => {
  console.log('c')
})

/// 触发事件
hook.call()
