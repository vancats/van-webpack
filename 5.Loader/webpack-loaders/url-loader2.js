
const mime = require('mime')
/// 基于 file-loader
function loader(content) {
  let options = this.getOptions() || {}
  let { limit, fallback } = options
  if (limit) {
    limit = parseInt(limit, 10)
  }
  if (!limit || content.length < limit) {
    /// image/jpeg
    let mimeType = mime.getType(this.resourcePath)
    let base64Str = `data:${mimeType};base64,${content.toString('base64')}`
    return `module.exports = ${JSON.stringify(base64Str)}`
  } else {
    // console.log(limit, content.length)
    let fileLoader2 = require(fallback)
    return fileLoader2.call(this, content)
  }
}

loader.raw = true
module.exports = loader
