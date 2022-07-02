
const { AsyncParallelHook } = require('./tapable')

let hook = new AsyncParallelHook(['name', 'age'])

debugger
console.time('cost')
hook.tapAsync('1', (name, age, callback) => {
  setTimeout(() => {
    console.log('1', name, age)
    callback()
  }, 1000)
})

hook.tapAsync('2', (name, age, callback) => {
  setTimeout(() => {
    console.log('2', name, age)
    callback()
  }, 2000)
})

hook.tapAsync('3', (name, age, callback) => {
  setTimeout(() => {
    console.log('3', name, age)
    callback()
  }, 3000)
})

hook.callAsync('vancats', 22, (err) => {
  console.log('ok')
  console.timeEnd('cost')
})
