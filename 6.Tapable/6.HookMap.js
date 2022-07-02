let { SyncHook, HookMap } = require('./tapable')
const map = new HookMap(() => new SyncHook(['name']))

map.for('key1').tap('plugin1', (name) => {
  console.log(1, name)
})

map.for('key1').tap('plugin2', (name) => {
  console.log(2, name)
})
let hook = map.get('key1')
hook.call('vancats')
