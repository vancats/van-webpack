
let walk = require('./walk')
let Scope = require('./scope')
/**
 * 对语法树进行分析
 * 当前模块内有哪些作用域，作用域内有多少变量，确定变量是内外部
 * @param {*} ast 模块对应的语法树
 * @param {*} code 源代码
 */
function analase(ast, code, module) {
  let scope = new Scope()
  ast.body.forEach(statement => {

    /// 添加变量声明到当前作用域
    function addToScope(declarator, isBlockDeclaration = false) {
      let name = declarator.id.name
      scope.add(name, isBlockDeclaration)
      if (!scope.parent || (!isBlockDeclaration)) {
        // 如果顶级作用域，声明的变量放置到内部
        statement._defines[name] = true
      }
    }

    Object.defineProperties(statement, {
      _defines: { value: {} }, /// 内部声明的变量
      _modifies: { value: {} }, /// 修改的语句
      _dependsOn: { value: {} }, /// 依赖的外部变量
      _included: { value: false, writable: true }, /// 是否已经包含到输出语句
      _source: { value: code.snip(statement.start, statement.end) },
      _module: { value: module },
    })

    /// 构建 scopeChain
    walk(statement, {
      enter(node) {
        let newScope
        switch (node.type) {
          case 'FunctionDeclaration':
            addToScope(node)
            const params = node.params.map(item => item.name)
            newScope = new Scope({
              parent: scope,
              params,
              block: false,
            })
            break

          case 'BlockStatement':
            newScope = new Scope({
              parent: scope,
              block: true
            })
            break

          case 'VariableDeclaration':
            node.declarations.forEach((VariableDeclarator) => {
              if (node.kind === 'let' || node.kind === 'const') {
                addToScope(VariableDeclarator, true)
              } else {
                addToScope(VariableDeclarator)
              }
            })
            break
          default:
            break
        }

        if (newScope) { // 创建了新作用域
          Object.defineProperty(node, '_scope', { value: newScope })
          scope = newScope // 转换当前作用域
        }
      },
      leave(node) {
        if (node._scope) {
          scope = scope.parent // 回到父作用域
        }
      }
    })
  })

  /// 找出当前模块依赖的外部变量
  ast.body.forEach(statement => {
    function checkForReads(node) {
      if (node.type === 'Identifier') { /// 如果是标识符，说明使用到了该变量
        // let definingScope = scope.findDefiningScope(node.name)
        // if (!definingScope) {
        /// 包含当前模块内外的所有变量
        statement._dependsOn[node.name] = true // 添加外部依赖
        // }
      }
    }
    function checkForWrites(node) {
      function addNode(node) {
        statement._modifies[node.name] = true
      }
      // 赋值表达式
      if (node.type === 'AssignmentExpression') {
        addNode(node.left, true)
      } else if (node.type === 'UpdateExpression') {
        addNode(node.argument, true)
      }
    }
    walk(statement, {
      enter(node) {
        if (node._scope) scope = node._scope
        checkForReads(node) /// 查找读取的标识符
        checkForWrites(node) /// 查找修改的标识符
      },
      leave(node) {
        if (node._scope) scope = scope.parent
      }
    })
  })
}

module.exports = analase
