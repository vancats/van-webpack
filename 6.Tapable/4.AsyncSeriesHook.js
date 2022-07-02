
const { AsyncSeriesHook } = require('./tapable')
let hook = new AsyncSeriesHook(['name', 'age'])

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

debugger
hook.callAsync('vancats', 22, (err) => {
  console.log('ok')
  console.timeEnd('cost')
})

  // hook.tapPromise('1', function (name, age) {
  //   return new Promise((res, rej) => {
  //     setTimeout(() => {
  //       console.log('1', name, age)
  //       res()
  //     }, 1000)
  //   })
  // })

  // hook.tapPromise('2', function (name, age) {
  //   return new Promise((res, rej) => {
  //     setTimeout(() => {
  //       console.log('2', name, age)
  //       /// res 和 rej 不传值会正常走，有值才会提前结束
  //       // res('我成功了')
  //       // rej()
  //       rej('我失败了')
  //     }, 2000)
  //   })
  // })

  // hook.tapPromise('3', function (name, age) {
  //   return new Promise((res, rej) => {
  //     setTimeout(() => {
  //       console.log('3', name, age)
  //       res()
  //     }, 3000)
  //   })
  // })

  // hook.promise('vancats', 22).then(() => {
  //   console.log('success')
  //   console.timeEnd('cost')
  // }, () => {
  //   console.log('failed')
  //   console.timeEnd('cost')
  // })

  // var _x = this._x

  // function _next1() {
  //   var _fn2 = _x[2]
  //   _fn2(name, age, (function () {
  //     _callback()
  //   }))
  // }

  // function _next0() {
  //   var _fn1 = _x[1]
  //   _fn1(name, age, (function () {
  //     _next1()
  //   }))
  // }

  // var _fn0 = _x[0]
  // _fn0(name, age, (function () {
  //   _next0()
  // }))
