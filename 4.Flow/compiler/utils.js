
/**
 * @description: 统一路径分隔符 /(window) -> \(mac linux)
 * @return {*}
 * @param {*} filePath
 */
function toUnixPath(filePath) {
  return filePath.replace(/\\/g, '/')
}

exports.toUnixPath = toUnixPath
