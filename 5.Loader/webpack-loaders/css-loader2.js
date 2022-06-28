
const postcss = require('postcss')
let Tokenizer = require('css-selector-tokenizer')

function loader(cssString) {
  const contextify = this.utils.contextify
  const cssPlugin = (options) => {
    return (cssRoot) => {
      // console.log('cssRoot: ', cssRoot)
      /// 遍历语法树，找到所有的 import 语句
      cssRoot.walkAtRules(/^Import$/i, rule => {
        rule.remove() // 删除这个 import
        options.imports.push(rule.params.slice(1, -1))
      })

      /// 解析 url 链接
      cssRoot.walkDecls(decl => {
        let values = Tokenizer.parseValues(decl.value)
        // console.log('values: ', JSON.stringify(values, null, 2))
        values.nodes.forEach(function (value) {
          value.nodes.forEach(item => {
            if (item.type === 'url') {
              item.url = "`+require(" + `"` + contextify(this.context, item.url) + `"` + ")+`"
              console.log('========item', item)
            }
          })
        })

        /// 把值放回去
        decl.value = Tokenizer.stringifyValues(values)
        // console.log('=========decl: ', decl)
      })
    }
  }

  let callback = this.async()
  let options = { imports: [] } /// 收集 import
  // 源代码会经过一个个插件
  let pipeLine = postcss([cssPlugin(options)])
  pipeLine.process(cssString).then(res => {
    let importCSS = options.imports.map(url => {
      return "`+require(" + `"` + contextify(this.context, "!!css-loader2!" + url) + `"` + ")+`"
    }).join('\r\n')
    let output = "module.exports = `" + importCSS + res.css + "`"
    output = output.replace(/\\"/g, '"')
    console.log('=======output: ', output)
    callback(null, output)
  })
}

module.exports = loader
