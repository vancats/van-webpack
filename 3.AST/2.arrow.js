// 提供语法树的生成和遍历
const core = require('@babel/core')
// 工具类，帮助生成相应节点
const types = require('babel-types')
const ArrowFunctionsPlugin = require('babel-plugin-transform-es2015-arrow-functions')

let es6Code = `
const sum = (a, b) => {
  console.log(this)
  const minus = (a, b) => {
    console.log(this)
    return a - b
  }
}
`

/// babel 插件中都会有一个 visitor 属性
/// 实现箭头函数转普通函数，实际上只有 type 的区别
const ArrowFunctionsPlugin2 = {
  visitor: {
    /// 直接写拦截节点的type
    ArrowFunctionExpression(nodePath) {
      let node = nodePath.node
      const thisBinding = hoistFunctionEnvironment(nodePath)
      node.type = 'FunctionExpression'
    }
  }
}

function hoistFunctionEnvironment(fnPath) {
  /// 自己实现一个findParent
  fnPath.findParent = function (isFound) {
    let found = false
    let thisPath = this
    do {
      let parentPath = thisPath.parentPath
      found = isFound(parentPath)
      thisPath = parentPath
    } while (!found)
    return thisPath
  }

  /// 寻找上层 this，是一个函数或者根节点，但不能是箭头函数
  const thisEnvFn = fnPath.findParent(p => {
    return (p.isFunction() && !p.isArrowFunctionExpression()) || p.isProgram()
  })

  /// 寻找当前作用域哪些地方用到了 this
  let thisPaths = getScopeInfomation(fnPath)
  // 声明的 this 别名，如果已经有该变量，会取 _this1
  let thisBinding = '_this'
  if (thisPaths.length > 0) {
    /// 在 thisEnvFn 作用域内添加变量，变量名 _this，初始化的值是 this
    thisEnvFn.scope.push({
      id: types.identifier(thisBinding),
      init: types.thisExpression()
    })
    thisPaths.forEach(thisPath => {
      /// 创建一个 _this 的标识符
      let thisBindingRef = types.identifier(thisBinding)
      /// 老节点替换成新节点
      thisPath.replaceWith(thisBindingRef)
    })
  }
}

function getScopeInfomation(fnPath) {
  let thisPaths = []
  // 遍历所有子节点的路径
  fnPath.traverse({
    ThisExpression(thisPath) {
      thisPaths.push(thisPath)
    }
  })
  return thisPaths
}


const es5Code = core.transform(es6Code, {
  plugins: [ArrowFunctionsPlugin2]
})

console.log(es5Code.code)
