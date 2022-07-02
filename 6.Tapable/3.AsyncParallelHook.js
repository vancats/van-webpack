
const { AsyncParallelHook } = require('./tapable')

let hook = new AsyncParallelHook(['name', 'age'])

console.time('cost')
debugger
hook.tapPromise('1', function (name, age) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log('1', name, age)
      res()
    }, 1000)
  })
})

hook.tapPromise('2', function (name, age) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log('2', name, age)
      res()
    }, 2000)
  })
})

hook.tapPromise('3', function (name, age) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log('3', name, age)
      res()
    }, 3000)
  })
})

debugger
hook.promise('vancats', 22).then(() => {
  console.log('结束！')
  console.timeEnd('cost')
})
