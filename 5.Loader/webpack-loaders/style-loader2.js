

function loader(css) {
  // let script = `
  //   let style = document.createElement('style')
  //   style.innerHTML = ${JSON.stringify(css)}
  //   document.head.appendChild(style)
  //   `
  // return script
}

loader.pitch = function (remainingRequest, previousRequest, data) {
  // @/5.Loader/webpack-loaders/less-loader2.js!@/5.Loader/src/index.less
  // console.log('remainingRequest: ', remainingRequest)
  // @/5.Loader/src
  // console.log('this.context: ', this.context)
  // !!../webpack-loaders/less-loader2.js!./index.less
  /// 绝对转相对，因为后续会作为模块 id，都是以相对路径存在的
  console.log(this.utils.contextify(this.context, '!!' + remainingRequest))
  let script = `
    let style = document.createElement('style')
    style.innerHTML = require('${this.utils.contextify(this.context, '!!' + remainingRequest)}')
    document.head.appendChild(style)
    `
  /// 里面的 script 会给到 webpack，webpack 将其转化为抽象语法树，会分析里面的依赖，发现里面有 require 的调用
  /// 继续解析后遇到!!loader，忽略项目中的配置 loader，只走 inline loader，直接走到 style-loader 的后一位 loader
  return script
}

module.exports = loader
