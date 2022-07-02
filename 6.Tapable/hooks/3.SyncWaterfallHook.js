const { SyncWaterfallHook } = require('tapable')

/// 返回值不为 undefined 会变成下一个 hook 的参数
let hook = new SyncWaterfallHook(['name', 'age'])

hook.tap('1', (name, age) => {
  console.log('1', name, age)
  return 'result1'
})

hook.tap('2', (name, age) => {
  console.log('2', name, age)
})

hook.tap('3', (name, age) => {
  console.log('3', name, age)
})

hook.call('vancats', 22)
