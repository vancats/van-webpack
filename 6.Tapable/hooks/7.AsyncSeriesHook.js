
const { AsyncSeriesHook } = require('tapable')
/// 注册异步任务，全部完成后执行 Promise.all 回调
///   1. tapAsync callback 传值结束回调
///   2. tapPromise 向 res rej 传值结束回调
let hook = new AsyncSeriesHook(['name', 'age'])

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
//     callback('我有值')
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
      /// res 和 rej 不传值会正常走，有值才会提前结束
      // res('我成功了')
      // rej()
      rej('我失败了')
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
  console.log('success')
  console.timeEnd('cost')
}, () => {
  console.log('failed')
  console.timeEnd('cost')
})
