const { SyncBailHook } = require('tapable')

/// 如果有返回值就直接结束
let hook = new SyncBailHook(['name', 'age'])

hook.tap('1', (name, age) => {
  console.log('1', name, age)
})

hook.tap('2', (name, age) => {
  console.log('2', name, age)
  return '2'
})

hook.tap('3', (name, age) => {
  console.log('3', name, age)
})

hook.call('vancats', 22)
