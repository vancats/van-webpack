const { type } = require("os")

function walk(ast, { enter, leave }) {
  visit(ast, null, enter, leave)
}

function visit(node, parent, enter, leave) {
  if (enter) {
    enter(node, parent)
  }

  let childKeys = Object.keys(node).filter(key => typeof node[key] === 'object')
  childKeys.forEach(key => {
    let value = node[key]
    if (Array.isArray(value)) {
      value.forEach(val => {
        visit(val, node, enter, leave)
      })
    } else if (value && value.type) {
      visit(value, node, enter, leave)
    }
  })

  if (leave) {
    leave(node, parent)
  }
}

module.exports = walk
