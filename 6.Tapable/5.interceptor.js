let { SyncHook } = require('tapable')

let hook = new SyncHook(['name', 'age'])
hook.intercept({
  register: (tapInfo) => {
    console.log('1-registry', tapInfo.name)
    return tapInfo
  },
  tap: (tapInfo) => {
    console.log('1-tap', tapInfo.name)
  },
  call: (name, age) => {
    console.log('1-call', name, age)
  }
})

hook.intercept({
  register: (tapInfo) => {
    console.log('2-registry', tapInfo.name)
    return tapInfo
  },
  tap: (tapInfo) => {
    console.log('2-tap', tapInfo.name)
  },
  call: (name, age) => {
    console.log('2-call', name, age)
  }
})
debugger
hook.tap({ name: 'A' }, (name, age) => {
  console.log('A', name, age)
})

hook.tap({ name: 'B' }, (name, age) => {
  console.log('B', name, age)
})

debugger
hook.call('vancats', 23)
