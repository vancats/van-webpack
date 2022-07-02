let { SyncHook } = require('./tapable')
let hook = new SyncHook(['name'])

hook.tap({ name: 'tap1', stage: 3 }, (name) => {
  console.log(3, name)
})
hook.tap({ name: 'tap1', stage: 4 }, (name) => {
  console.log(4, name)
})
hook.tap({ name: 'tap1', stage: 1 }, (name) => {
  console.log(1, name)
})
hook.tap({ name: 'tap1', stage: 2 }, (name) => {
  console.log(2, name)
})

hook.call('vancats')
