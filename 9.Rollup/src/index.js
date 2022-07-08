import _ from 'lodash'
import { name, age } from './msg'
let home = 'zhejiang'
function say() {

}
console.log('name: ', name)

console.log(_.concat([1, 2], 3, 4))

class A { }
class B extends A { }
let b = new B()
console.log(b)

import './index.css'

Array.prototype.getName = () => { console.log(1) }
