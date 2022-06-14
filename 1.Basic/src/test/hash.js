function createHash() {
  return require('crypto').createHash('md5')
}

let depModule1 = 'depModule1'
let depModule2 = 'depModule2'

let entry1 = `require("${depModule1}")`
let entry2 = `require("${depModule2}")`

let hash = createHash().update(entry1).update(entry2).digest('hex')
console.log('hash: ', hash)

let chunkhash1 = createHash().update(entry1).digest('hex')
let chunkhash2 = createHash().update(entry2).digest('hex')
console.log(chunkhash1, chunkhash2)

let contenthash1 = createHash().update(depModule1).digest('hex')
let contenthash2 = createHash().update(depModule2).digest('hex')
console.log(contenthash1, contenthash2)
