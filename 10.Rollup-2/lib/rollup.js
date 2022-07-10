
const Bundle = require('./bundle')
function rollup(entry, filename) {
  // 根据 entry 创建 bundle
  let bundle = new Bundle({ entry })
  bundle.build(filename)
}

module.exports = rollup
