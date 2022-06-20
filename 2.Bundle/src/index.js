
// 1 basic
// 2 cjs-load-esm
// let title = require('./title')
// console.log('title: ', title)
// console.log('name', title.age)

// 3 esm-load-esm
// import title, { age } from './title'
// console.log(title)
// console.log(title.default)
// console.log(age)

// 4 async
document.addEventListener('click', () => {
  import('./title').then(res => {
    console.log(res.default)
  })
})
