
function loader(source) {
  console.log('post2')
  console.log(this.data)
  /// 异步实现方式
  const callback = this.async()
  console.log('-----------')
  setTimeout(() => {
    callback(null, source + 'post2')
  }, 5000)
  // return source + 'post2'
}

loader.pitch = function (remainingRequest, previousRequest, data) {
  data.name = 'vancats'
  console.log('post2 pitch')
}

module.exports = loader
