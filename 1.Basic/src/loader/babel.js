// corejs 2
// import '@babel/polyfill'

// corejs 3
// import 'core-js/stable'
// import 'regenerator-runtime/runtime'

// babel-runtime
// import Promise from 'babel-runtime/core-js/promise'

import './babel2'

let arrow = () => {
  console.log('arrow')
}
arrow()
let p = new Promise()
console.log('p: ', p)

class Parent { }

class Child extends Parent { }
const child = new Child()

function* gen() { }

console.log(gen())
