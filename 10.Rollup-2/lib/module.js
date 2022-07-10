
const MagicString = require('magic-string')
const { parse } = require('acorn')
const analase = require('./ast/analase')
const { has } = require('./utils')
const SYSTEM_VARIABLES = ['console', 'log']

class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code, { filaname: path })
    this.path = path
    this.bundle = bundle
    this.canonicalNames = {} /// 存放所有命名的关系
    this.ast = parse(code, {
      sourceType: 'module',
      ecmaVersion: 7
    })
    this.analase()
  }

  analase() {
    // 分析此模块导入/导出的变量
    this.imports = {}
    this.exports = {}
    this.modifications = {} // 包含所有修改语句
    this.ast.body.forEach(node => {
      if (node.type === 'ImportDeclaration') {
        let source = node.source.value // 导入的模块 ./msg
        node.specifiers.forEach(specifier => {
          const localName = specifier.local.name // 本地变量名
          const name = specifier.imported.name // 导入变量名
          this.imports[localName] = { source, name, localName } // { source: './msg', name: 'name' }
        })
      } else if (node.type === 'ExportNamedDeclaration') {
        let variableDeclaration = node.declaration
        let name = variableDeclaration.declarations[0].id.name
        this.exports[name] = { node, localName: name, expression: variableDeclaration }
      }
    })

    analase(this.ast, this.code, this)

    this.definitions = {} // 存放所有变量的定义语句
    this.ast.body.forEach(statement => {
      Object.keys(statement._defines).forEach(name => {
        // name 全局变量名 statement 对应的语句
        this.definitions[name] = statement
      })
      Object.keys(statement._modifies).forEach(name => {
        // 此语句修改的变量名
        if (!has(this.modifications, name)) {
          this.modifications[name] = []
        }
        this.modifications[name].push(statement)
      })
    })
  }

  expandAllStatements() {
    let allStatements = [] // 当前模块展开后的所有语句
    this.ast.body.forEach(statement => {
      if (statement.type === 'ImportDeclaration') return
      if (statement.type === 'VariableDeclaration') return
      let statements = this.expandStatement(statement)
      allStatements.push(...statements)
    })
    return allStatements
  }

  expandStatement(statement) {
    statement._included = true
    let result = []

    /// 包含依赖的变量定义
    const dependencies = Object.keys(statement._dependsOn)
    dependencies.forEach(name => {
      let definition = this.define(name) // 找到 name 变量的定义语句
      result.push(...definition)
    })
    /// 添加自己的语句
    result.push(statement)

    /// 添加修改的语句
    const defines = Object.keys(statement._defines) // ['age']
    defines.forEach(name => {
      const modifications = has(this.modifications, name) && this.modifications[name]
      if (modifications) {
        modifications.forEach(statement => {
          if (!statement._included) {
            let statements = this.expandStatement(statement)
            result.push(...statements)
          }
        })
      }
    })

    return result
  }


  define(name) {
    // 先判断这个是不是导入的变量
    if (has(this.imports, name)) {
      const importDeclaration = this.imports[name]
      /// 创建依赖的模块 ./msg
      let module = this.bundle.fetchModule(importDeclaration.source, this.path)
      const exportDeclaration = module.exports[importDeclaration.name]
      return module.define(exportDeclaration.localName)
    } else {
      let statement = this.definitions[name]
      if (statement) {
        if (statement._included) {
          return []
        } else {
          return this.expandStatement(statement)
        }
      } else if (SYSTEM_VARIABLES.includes(name)) {
        return []
      } else {
        throw new Error(`变量${name}既没有从外部导入，也没有在当前模块内声明`)
      }
    }
  }

  rename(localName, replaceName) {
    this.canonicalNames[localName] = replaceName
  }

  getCanonicalName(localName) {
    if (!has(this.canonicalNames, localName)) {
      this.canonicalNames[localName] = localName // 默认值
    }
    return this.canonicalNames[localName]
  }
}

module.exports = Module
