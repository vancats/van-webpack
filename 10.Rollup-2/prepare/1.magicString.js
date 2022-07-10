
const MagicString = require('magic-string')

let magicString = new MagicString(`export var name = 'vancats'`)

// snip 类似 slice，返回的是克隆对象
console.log(magicString.snip(7, 10).toString())
console.log(magicString.remove(7, 11).toString())

let bundleString = new MagicString.Bundle()
bundleString.addSource({
  content: 'var a = 1',
  separator: '\n'
})
bundleString.addSource({
  content: 'var b = 2',
  separator: '\n'
})

console.log(bundleString.toString())
