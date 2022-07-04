
class HashPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('HashPlugin', (compilation, params) => {
      compilation.hooks.afterHash.tap('HashPlugin', () => {
        console.log('----- hash -----', compilation.hash)
        compilation.hash = 'fullHash'
        for (const chunk of compilation.chunks) {
          console.log('----- chunkHash -----', chunk.renderedHash)
          chunk.renderedHash = 'chunkhash'
          console.log('----- contentHash -----', chunk.contentHash)
          chunk.contentHash = { javascript: 'contentJsHash', 'css/mini-extract': 'contentCssHash' }
        }
      })
    })
  }
}

module.exports = HashPlugin
