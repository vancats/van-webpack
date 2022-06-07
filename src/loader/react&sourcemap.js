import React from 'react'
import ReactDOM from 'react-dom'


function readonly(target, key, descriptor) {
  descriptor.writable = false
}

function classDecorator(target, key, descriptor) {

}

@classDecorator class Person {
  @readonly PI = 3.14
}
let p = new Person()
// p.PI = 3.15
console.log('p: ', p)


class App extends React.Component {
  handleClick = () => {
    debugger
    console.log('hello')
  }
  render() {
    return <button onClick={this.handleClick}>click</button>
  }
}
ReactDOM.render(<App />, document.querySelector('#react'))
