const { ExternalModule } = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin')

class AutoExternalPlugin {
  constructor(options) {
    this.options = options
    this.importedModules = new Set() /// 存放所有导入并依赖的模块
    this.externalModules = Object.keys(this.options) /// ['jquery', 'lodash']
  }

  apply(compiler) {
    /// 获取 普通模块工厂
    compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin', (normalModuleFactory) => {
      /// 获取 JS 模块的 parser
      normalModuleFactory.hooks.parser
        .for('javascript/auto') /// 兼容 es cjs
        .tap('AutoExternalPlugin', parser => {
          /// import 的任何模块都会添加到 importedModules
          parser.hooks.import.tap('AutoExternalPlugin', (statement, source) => {
            // console.log('======================', source)
            if (this.externalModules.includes(source)) {
              this.importedModules.add(source)
            }
          })

          /// require 的模块同样需要添加
          parser.hooks.call.for('require').tap('AutoExternalPlugin', (expression) => {
            let value = expression.arguments[0].value
            if (this.externalModules.includes(source)) {
              this.importedModules.add(value)
            }
          })
        })


      /// 当我们使用 factorize 钩子，其为 AsyncSeriesBailHook
      normalModuleFactory.hooks.factorize.tapAsync('AutoExternalPlugin', (resolveData, callback) => {
        let request = resolveData.request /// 将要加载的资源
        if (this.externalModules.includes(request)) {
          let variable = this.options[request].expose /// $
          /// 返回值中含有模块，返回该模块而不会往下继续执行
          callback(null, new ExternalModule(variable, 'window', request))
        } else {
          /// 不传参，走原始生产模块的逻辑，会生产出 normalModule
          callback(null)
        }
      })
    })

    /// 添加 CDN
    compiler.hooks.compilation.tap('AutoExternalPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('AutoExternalPlugin', (htmlData, callback) => {
        let { assetTags } = htmlData
        console.log('assetTags.scripts: ', assetTags.scripts)
        let importedExternalModules = Object.keys(this.options).filter(item => this.importedModules.has(item))

        importedExternalModules.forEach(key => {
          assetTags.scripts.unshift(
            {
              tagName: 'script', /// 标签类型
              voidTag: false,    /// 是否为空
              attributes: { defer: false, type: undefined, src: this.options[key].url }
            }
          )
        })

        callback(null, htmlData)
      })
    })
  }
}

module.exports = AutoExternalPlugin
