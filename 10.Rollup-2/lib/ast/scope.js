
class Scope {
  constructor(options = {}) {
    this.name = options.name
    this.parent = options.parent
    this.params = options.param || [] // 当前作用域声明的变量
    this.isBlockScope = !!options.block
  }

  add(param, isBlockDeclaration) {
    if (!isBlockDeclaration && this.isBlockScope) {
      this.parent.add(param, isBlockDeclaration)
    } else {
      this.params.push(param)
    }
  }
  findDefiningScope(param) {
    if (this.params.includes(param)) {
      return this
    } else if (this.parent) {
      return this.parent.findDefiningScope(param)
    }
    return null
  }
}

module.exports = Scope
