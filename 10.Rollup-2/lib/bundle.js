const fs = require('fs')
const Module = require('./module')
const path = require('path')
const MagicString = require('magic-string')
const { has, replaceIdentifiers } = require('./utils')

class Bundle {
  constructor(options) {
    this.entryPath = path.resolve(options.entry.replace(/\.js$/, '') + '.js')
    this.modules = {}
    this.statements = ''
  }

  build(filename) {
    /// 每个文件都是一个模块
    let entryModule = this.fetchModule(this.entryPath)
    this.statements = entryModule.expandAllStatements()
    this.deConflict() /// 处理变量名冲突
    const { code } = this.generate()
    fs.writeFileSync(filename, code)
  }

  /**
   * @param {*} importee 文件路径 相对绝对都行，子模块
   * @param {*} importer 导入 importee 的模块，父模块
   */
  fetchModule(importee, importer) {
    let route
    if (!importer) {
      route = importee
    } else {
      if (path.isAbsolute(importee)) {
        route = importee
      } else {
        // 如果是相对路径
        route = path.resolve(path.dirname(importer), importee.replace(/\.js$/, '') + '.js')
      }
    }
    if (route) {
      let code = fs.readFileSync(route, 'utf-8')
      const module = new Module({
        code,
        path: importee,
        bundle: this
      })
      return module
    }
  }

  deConflict() {
    const defines = {}
    const conflicts = {}
    this.statements.forEach(statement => {
      Object.keys(statement._defines).forEach(name => {
        if (has(defines, name)) {
          conflicts[name] = true
        } else {
          defines[name] = []
        }
        defines[name].push(statement._module)
      })
    })

    Object.keys(conflicts).forEach(name => {
      const modules = defines[name]
      modules.shift()
      modules.forEach((module, index) => {
        const replaceName = name + '$' + (index + 1)
        module.rename(name, replaceName)
      })
    })
  }

  generate() {
    let magicStringBundle = new MagicString.Bundle()
    this.statements.forEach(statement => {

      let replacements = {} /// 需要替换的变量名
      Object.keys(statement._dependsOn).concat(Object.keys(statement._defines))
        .forEach(name => {
          /// 获取规范的名称 age => age$1
          const canonicalName = statement._module.getCanonicalName(name)
          if (name !== canonicalName) replacements[name] = canonicalName
        })

      const source = statement._source.clone()
      if (/^Export/.test(statement.type)) {
        source.remove(statement.start, statement.declaration.start)
      }

      replaceIdentifiers(statement, source, replacements)
      magicStringBundle.addSource({
        content: source,
        separator: '\n'
      })
    })
    return { code: magicStringBundle.toString() }
  }
}

module.exports = Bundle
