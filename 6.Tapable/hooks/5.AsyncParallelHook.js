
const { AsyncParallelHook } = require('tapable')

let hook = new AsyncParallelHook(['name', 'age'])

console.time('cost')
// hook.tapAsync('1', (name, age, callback) => {
//   setTimeout(() => {
//     console.log('1', name, age)
//     callback()
//   }, 1000)
// })

// hook.tapAsync('2', (name, age, callback) => {
//   setTimeout(() => {
//     console.log('2', name, age)
//     callback()
//   }, 2000)
// })

// hook.tapAsync('3', (name, age, callback) => {
//   setTimeout(() => {
//     console.log('3', name, age)
//     callback()
//   }, 3000)
// })

// hook.callAsync('vancats', 22, (err) => {
//   console.log('ok')
//   console.timeEnd('cost')
// })

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

hook.promise('vancats', 22).then(() => {
  console.timeEnd('cost')
})
