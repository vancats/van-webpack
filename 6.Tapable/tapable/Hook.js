
/// Hook 基类
class Hook {
  constructor(args) {
    if (!Array.isArray(args)) args = []
    this.args = args /// 形参数组
    this.taps = [] /// 事件函数的数组
    this.call = CALL_DELEGATE
    this.callAsync = CALL_ASYNC_DELEGATE
    this.promise = CALL_PROMISE_DELEGATE
    this.interceptors = []
  }

  /// 插入拦截器
  intercept(interceptor) {
    this.interceptors.push(interceptor)
  }

  /// 同步事件
  tap(options, fn) {
    this._tap('sync', options, fn)
  }

  /// 异步回调
  tapAsync(options, fn) {
    this._tap('async', options, fn)
  }

  /// Promise 回调
  tapPromise(options, fn) {
    this._tap('promise', options, fn)
  }

  /// 生成 tapInfo 拦截器 register，并进行 insert 操作
  _tap(type, options, fn) {
    if (typeof options === 'string') {
      options = {
        name: options
      }
    }
    let tapInfo = { ...options, type, fn }
    tapInfo = this._runRegisterInterceptors(tapInfo)
    this._insert(tapInfo)
  }

  /// 处理拦截器的 register
  _runRegisterInterceptors(tapInfo) {
    for (const interceptor of this.interceptors) {
      if (interceptor.register) {
        let newTapInfo = interceptor.register(tapInfo)
        if (newTapInfo) {
          tapInfo = newTapInfo
        }
      }
    }
    return tapInfo
  }

  /// 重置 call 函数，进行 tapInfo 的插入，有 stage 和 before
  _insert(tapInfo) {
    /// 重置编译
    this._resetCompilation()
    let before
    if (typeof tapInfo.before === 'string') {
      before = new Set([tapInfo.before])
    } else if (Array.isArray(tapInfo.before)) {
      before = new Set(tapInfo.before)
    }
    let stage = 0
    if (typeof tapInfo.stage === 'number') {
      stage = tapInfo.stage
    }
    let i = this.taps.length
    while (i > 0) {
      i--
      const x = this.taps[i]
      this.taps[i + 1] = x
      const xStage = x.stage || 0
      if (before) {
        if (before.has(x.name)) {
          before.delete(x.name)
          continue
        }
        if (before.size > 0) {
          continue
        }
      }
      if (xStage > stage) {
        continue
      }
      i++
      break
    }
    this.taps[i] = tapInfo
  }

  /// 重置为原始函数，准备重新编译
  _resetCompilation() {
    this.call = CALL_DELEGATE
    this.callAsync = CALL_ASYNC_DELEGATE
    this.promise = CALL_PROMISE_DELEGATE
  }

  compile() {
    /// 函数的编译工作交给子类实现
    throw new Error('Abstract: should be override')
  }

  /// 调用子类 compiler 方法
  _createCall(type) {
    return this.compile({
      taps: this.taps, /// tapInfo 的数组
      args: this.args, /// 形参数组
      interceptors: this.interceptors, /// 拦截器对象数组
      type
    })
  }
}

/// 懒的动态编译
const CALL_DELEGATE = function (...args) {
  this.call = this._createCall('sync')
  return this.call(...args)
}

const CALL_ASYNC_DELEGATE = function (...args) {
  this.callAsync = this._createCall('async')
  return this.callAsync(...args)
}

const CALL_PROMISE_DELEGATE = function (...args) {
  this.promise = this._createCall('promise')
  return this.promise(...args)
}
module.exports = Hook
