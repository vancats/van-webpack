
const walk = require('./ast/walk')

function has(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function replaceIdentifiers(statement, source, replacements) {
  walk(statement, {
    enter(node) {
      if (node.type === 'Identifier') {
        if (replacements[node.name]) {
          source.overwrite(node.start, node.end, replacements[node.name])
        }
      }
    },
  })
}

module.exports = {
  has,
  replaceIdentifiers,
}
