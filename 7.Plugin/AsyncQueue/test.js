// const AsyncQueue = require('webpack/lib/util/AsyncQueue')
const AsyncQueue = require('./AsyncQueue')

function processor(item, callback) {
  setTimeout(() => {
    callback(null, { item })
  }, 1000)
}

const getKey = (item) => {
  return item.key
}

let queue = new AsyncQueue({
  name: 'createModule',
  parallelism: 3,
  processor,
  getKey
})

const start = Date.now()
queue.add({ key: 'module1' }, (err, res) => {
  console.log(err, res)
  console.log(Date.now() - start)
})
queue.add({ key: 'module2' }, (err, res) => {
  console.log(err, res)
  console.log(Date.now() - start)
})
queue.add({ key: 'module3' }, (err, res) => {
  console.log(err, res)
  console.log(Date.now() - start)
})
queue.add({ key: 'module4' }, (err, res) => {
  console.log(err, res)
  console.log(Date.now() - start)
})
