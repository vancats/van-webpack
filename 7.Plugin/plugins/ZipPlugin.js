
const JSZip = require('jszip')
const { RawSource } = require('webpack-sources')
const path = require('path')

class ZipPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('ZipPlugin', (compilation) => {
      compilation.hooks.processAssets.tapAsync('ZipPlugin', (assets, callback) => {
        let zip = new JSZip()
        for (const filename in assets) {
          let source = assets[filename].source()
          zip.file(filename, source)
        }
        zip.generateAsync({ type: 'nodebuffer' }).then(content => {
          assets[this.options.filename.replace('[timestamp]', Date.now())] = new RawSource(content)
          callback()
        })
      })
    })



    // compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
    //   let zip = new JSZip()
    //   for (const filename in compilation.assets) {
    //     let source = compilation.assets[filename].source()
    //     zip.file(filename, source)
    //   }
    //   zip.generateAsync({ type: 'nodebuffer' }).then(content => {
    //     // compilation.assets[this.options.filename.replace('[timestamp]', Date.now())] = {
    //     //   source() {
    //     //     return content
    //     //   }
    //     // }
    //     compilation.assets[this.options.filename.replace('[timestamp]', Date.now())] = new RawSource(content)
    //     callback()
    //   })
    // })
  }
}

module.exports = ZipPlugin
