// import _ from 'lodash' // expose-loader 必须引入一次
console.log(_.join(['a', 'b', 'c'], '@'))
// ! 无法 Tree Shaking
// import { join } from 'lodash'
// ! Tree Shaking 写法
// import join from 'lodash/join'
// console.log(join(['a', 'b', 'c'], '@'))
