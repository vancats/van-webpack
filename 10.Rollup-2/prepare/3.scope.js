
class Scope {
  constructor(options = {}) {
    this.parent = options.parent
    this.params = options.param || [] /// 当前作用域声明的变量
  }

  add(param) {
    this.params.push(param)
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
