let arrow = () => {
  console.log('arrow')
}
arrow()
let p = new Promise()
console.log('p: ', p)

class Parent2 { }

class Child2 extends Parent2 { }
const child2 = new Child2()
