
class HookCodeFactory {
  /// 就是把事件函数变成数组赋给 _x
  setup(hookInstance, options) {
    hookInstance._x = options.taps.map(tapInfo => tapInfo.fn)
  }
  create(options) {
    this.init(options)
    let fn
    /// options = { type: 'sync', taps, args }
    switch (options.type) {
      case 'sync':
        fn = new Function(
          this.args(),
          this.header() + this.content({
            onDone: () => ''
          })
        )
        break
      case 'async':
        fn = new Function(
          this.args({ after: '_callback' }),
          this.header() + this.content({
            onDone: () => `_callback()\n`
          })
        )
        break
      case 'promise':
        let tapsContent = this.content({
          onDone: () => `_resolve()`
        })
        let content = `
        return new Promise((function (_resolve, _reject) {
          ${tapsContent}
        }))
        `
        fn = new Function(
          this.args(),
          this.header() + content
        )
        break
      default:
        break
    }
    this.deinit()
    return fn
  }

  init(options) {
    this.options = options
  }

  deinit() {
    this.options = null
  }

  /// 获取所需要的参数，有 before 和 after 可以进行前后插入
  args(options = {}) {
    let { before, after } = options
    let allArgs = this.options.args || []
    if (before) allArgs = [before, ...allArgs]
    if (after) allArgs = [...allArgs, after]
    return allArgs.join(',') /// ['name', 'after'] => 'name, after'
  }

  /// 获取头部信息，包括 _x taps 与 interceptors
  header() {
    let code = ``
    code += `var _x = this._x\n`
    let { interceptors = [] } = this.options
    if (interceptors.length > 0) {
      code += `var _taps = this.taps\n`
      code += `_interceptors = this.interceptors\n`
      for (let i = 0; i < interceptors.length; i++) {
        let interceptor = interceptors[i]
        if (interceptor.call) {
          code += `_interceptors[${i}].call(${this.args()})\n `
        }
      }
    }
    return code
  }

  /// 调用串行方法
  callTapsSeries({ onDone }) {
    let { taps } = this.options
    if (taps.length === 0) return onDone()
    let tapContent = []
    let code = ''
    let current = onDone // 当前任务完成后的下一个任务
    for (let i = taps.length - 1; i >= 0; i--) {
      const unroll = current !== onDone && this.options.taps[i].type !== "sync"
      if (unroll) {
        code += `function _next${i}() {\n`
        code += current()
        code += `}\n`
        current = () => `_next${i}()`
      }
      const done = current
      const content = this.callTap(i, { onDone: done })
      tapContent.unshift(current)
      current = () => content
    }
    code += current()
    if (this.options.taps[0].type === 'sync') {
      tapContent.forEach(content => {
        code += content()
      })
    }
    return code
  }
  // callTapsSeries() {
  //   let { taps } = this.options
  //   if (taps.length === 0) return ''
  //   let code = ``
  //   for (let i = 0; i < taps.length; i++) {
  //     const content = this.callTap(i)
  //     code += content
  //   }
  //   return code
  // }

  /// 调用并行方法
  callTapsParallel({ onDone }) {
    let { taps } = this.options
    if (taps.length === 0) return ''
    let code = `var _counter = ${taps.length}\n`
    code += `var _done = (function () {\n${onDone()}\n})\n`
    for (let i = 0; i < taps.length; i++) {
      const content = this.callTap(i, { onDone: () => `if (--_counter === 0) _done()` })
      code += content
    }
    return code
  }

  callTap(tapIndex, { onDone }) {
    let code = ``
    let { interceptors = [] } = this.options
    if (interceptors.length > 0) {
      code += `var _tap${tapIndex} = _taps[${tapIndex}]\n`
      for (let i = 0; i < interceptors.length; i++) {
        let interceptor = interceptors[i]
        if (interceptor.tap) {
          code += `_interceptors[${i}].tap(_tap${tapIndex})\n`
        }
      }
    }
    code += `var _fn${tapIndex} = _x[${tapIndex}]\n`
    let tap = this.options.taps[tapIndex]
    switch (tap.type) {
      case 'sync':
        code += `_fn${tapIndex}(${this.args()})\n`
        break
      case 'async':
        code += `_fn${tapIndex}(${this.args()}, function (){
          ${onDone()}
        })\n`
        break
      case 'promise':
        code += `
        var _promise${tapIndex} = _fn${tapIndex}(${this.args()})\n
        _promise${tapIndex}.then((function () {
          if (--_counter === 0) _done()
        }))
        `
      default:
        break
    }
    return code
  }
}

module.exports = HookCodeFactory
