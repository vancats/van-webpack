// 解析器 将源代码转换成抽象语法树 AST
const esprima = require('esprima')
// 遍历器 遍历语法树
const estraverse = require('estraverse')
// 生成器 改造后的语法树还原为源代码
const escodegen = require('escodegen')
let code = `function ast() {}`
let ast = esprima.parse(code)
console.log('ast: ', ast)
let indent = 0 // 缩进的空格数
const padding = () => ' '.repeat(indent)

estraverse.traverse(ast, {
  enter(node) {
    // console.log(padding() + node.type + '进入')
    if (node.type === 'FunctionDeclaration') {
      node.id.name = 'newAst'
    }
    indent += 2
  },
  leave(node) {
    indent -= 2
    // console.log(padding() + node.type + '离开')
  }
})

let res = escodegen.generate(ast)
console.log(res)
