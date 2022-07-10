
const acorn = require('acorn')
const walk = require('./walk')

const ast = acorn.parse(`import $ from 'jquery'`, {
  locations: false,
  ranges: false,
  sourceType: 'module',
  ecmaVersion: 8
})

let indent = 0
const padding = () => ' '.repeat(indent)
ast.body.forEach(statement => {
  walk(statement, {
    enter(node, parent) {
      console.log(padding() + node.type)
      indent += 2
    },
    leave(node, parent) {
      indent -= 2
      console.log(padding() + node.type)
    }
  })
})
