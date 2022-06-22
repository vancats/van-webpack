const babel = require('@babel/core')
const types = require('babel-types')
const { type } = require('os')

const visitor = {
  ImportDeclaration(nodePath, state) {
    console.log('state: ', state)
    const { opts } = state
    const { node } = nodePath
    const specifiers = node.specifiers /// ['flatten', 'concat']
    const source = node.source
    /// 只有第一个 specifiers 不是默认导入时才会进入
    /// 防递归，已经把普通导入变成了递归导入
    if (opts.library === source.value && !types.isImportDefaultSpecifier(specifiers[0])) {
      const importDeclarations = specifiers.map(specifier => {
        return types.importDeclaration([
          types.importDefaultSpecifier(specifier.local)
        ], types.stringLiteral(`${source.value}/${specifier.imported.name}`))
      })
      if (importDeclarations.length === 1) {
        nodePath.replaceWith(importDeclarations[0])
      } else {
        nodePath.replaceWithMultiple(importDeclarations)
      }
    }
  }
}

module.exports = function () {
  return {
    visitor
  }
}
