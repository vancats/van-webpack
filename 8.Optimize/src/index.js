import './index.css'
/// module main browser
// import calc from "../myModules/calc"

// import moment from 'moment'
/// 使用了 IgnorePlugin，国际化手动引入
// import 'moment/locale/zh-cn'
// console.log('moment: ', moment)

/// target
// function add(a, b) {
//   return a + b
// }
// function minus(a, b) {
//   return a - b
// }

// module.exports = {
//   add, minus
// }

/// 懒加载
// let play = document.querySelector('.play')
// play.addEventListener('click', (e) => {
//   import('./video').then(res => {
//     console.log(res)
//   })
// })

/// prefetch
// ! <link rel="prefetch" as="script" href="xx">
// import(/* webpackPrefetch: true */'./video').then(res => {
//   console.log(res)
// })

/// preload
// ! <link rel="preload" as="script" href="xx">
// import(/* webpackPreload: true */'./video').then(res => {
//   console.log(res)
// })

