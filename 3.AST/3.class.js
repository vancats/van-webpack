// 提供语法树的生成和遍历
const core = require('@babel/core')
// 工具类，帮助生成相应节点
const types = require('babel-types')
const TransformClasses = require('@babel/plugin-transform-classes')

const es6Code = `
class Person{
  constructor(name) {
    this.name = name
  }
  getName() {
    return this.name
  }
}
`

const TransformClasses2 = {
  visitor: {
    ClassDeclaration(nodePath) {
      const { node } = nodePath
      const id = node.id  /// { type: 'Identifier', name: 'Person' }
      let methods = node.body.body
      let nodes = []
      methods.forEach(classMethod => {
        if (classMethod.kind === 'constructor') {
          /// 用构造函数创建普通函数
          let constructorFunction = types.functionDeclaration(
            id, classMethod.params, classMethod.body, classMethod.generator, classMethod.async
          )
          nodes.push(constructorFunction)
        } else {
          let prototypeMemberExpression = types.memberExpression(id, types.identifier('prototype'))
          let keyMemberExpression = types.memberExpression(prototypeMemberExpression, classMethod.key)
          /// 创建成员函数表达式
          let memberFunction = types.functionExpression(
            id, classMethod.params, classMethod.body, classMethod.generator, classMethod.async
          )
          let assignmentExpression = types.assignmentExpression('=', keyMemberExpression, memberFunction)
          nodes.push(assignmentExpression)
        }
      })
      if (nodes.length === 1) {
        nodePath.replaceWith(nodes[0])
      } else {
        nodePath.replaceWithMultiple(nodes)
      }
    }
  }
}

const es5Code = core.transform(es6Code, {
  plugins: [TransformClasses2]
})

console.log(es5Code.code)
