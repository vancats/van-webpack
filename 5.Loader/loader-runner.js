
const fs = require('fs')

function runLoaders(options, callback) {
  let resource = options.resource || '' /// 需要加载的资源
  let loaders = options.loaders || []
  let loaderContext = options.context || {} /// loader 执行上下文
  let readResource = options.readResource || fs.readFile /// 读取文件内容方法

  let loadersObj = loaders.map(createLoaderObject)

  loaderContext.resource = resource
  loaderContext.readResource = readResource
  loaderContext.loaderIndex = 0
  loaderContext.loaders = loadersObj
  loaderContext.callback = null
  loaderContext.async = null

  Object.defineProperty(loaderContext, 'request', {
    get() {
      return loaderContext.loaders.map(l => l.request).concat(loaderContext.resource).join('!')
    }
  })

  Object.defineProperty(loaderContext, 'remainingRequest', {
    get() {
      return loaderContext.loaders.slice(loaderContext.loaderIndex + 1).map(l => l.request).concat(loaderContext.resource).join('!')
    }
  })

  Object.defineProperty(loaderContext, 'currentRequest', {
    get() {
      return loaderContext.loaders.slice(loaderContext.loaderIndex).map(l => l.request).concat(loaderContext.resource).join('!')
    }
  })

  Object.defineProperty(loaderContext, 'previousRequest', {
    get() {
      return loaderContext.loaders.slice(0, loaderContext.loaderIndex).map(l => l.request).join('!')
    }
  })

  Object.defineProperty(loaderContext, 'data', {
    get() {
      return loaderContext.loaders[loaderContext.loaderIndex].data
    }
  })

  let processOptions = {
    resourceBuffer: null
  }

  /// 迭代 pitch 方法
  iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
    callback(err, {
      result,
      resourceBuffer: processOptions.resourceBuffer
    })
  })
}

function iteratePitchingLoaders(processOptions, loaderContext, finallyCallback) {
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    return processResource(processOptions, loaderContext, finallyCallback)
  }

  let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex]
  if (currentLoaderObject.pitchExecuted) {
    loaderContext.loaderIndex++
    return iteratePitchingLoaders(processOptions, loaderContext, finallyCallback)
  }

  let pitchFunction = currentLoaderObject.pitch
  currentLoaderObject.pitchExecuted = true
  if (!pitchFunction) {
    return iteratePitchingLoaders(processOptions, loaderContext, finallyCallback)
  }

  runSyncOrAsync(pitchFunction, loaderContext,
    [
      loaderContext.remainingRequest, loaderContext.previousRequest, loaderContext.data = {}
    ],
    (err, ...args) => {
      if (err) return finallyCallback(err)
      let hasArg = args.some(val => val !== undefined)
      if (hasArg) { /// 有返回值
        loaderContext.loaderIndex--
        iterateNormalLoaders(processOptions, loaderContext, args, finallyCallback)
      } else {
        iteratePitchingLoaders(processOptions, loaderContext, finallyCallback)
      }
    }
  )
}

function iterateNormalLoaders(processOptions, loaderContext, args, finallyCallback) {
  if (loaderContext.loaderIndex < 0)
    return finallyCallback(null, args)

  let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex]
  if (currentLoaderObject.normalExecuted) {
    loaderContext.loaderIndex--
    return iterateNormalLoaders(processOptions, loaderContext, args, finallyCallback)
  }

  let normalFunction = currentLoaderObject.normal
  currentLoaderObject.normalExecuted = true

  /// 转换字符串或 Buffer
  convertArgs(args, currentLoaderObject.raw)

  runSyncOrAsync(normalFunction, loaderContext, args, (err, ...values) => {
    if (err) return finallyCallback(err)
    iterateNormalLoaders(processOptions, loaderContext, values, finallyCallback)
  })
}

function convertArgs(args, raw) {
  if (raw && !Buffer.isBuffer(args[0])) {
    args[0] = Buffer.from(args[0], 'utf-8')
  } else if (!raw && Buffer.isBuffer(args[0])) {
    args[0] = args[0].toString('utf8')
  }
}

function runSyncOrAsync(fn, loaderContext, args, callback) {
  let isSync = true
  let isDone = false // 是否已经执行过

  loaderContext.async = function () {
    if (isDone) return
    isSync = false
    return innerCallback
  }

  let innerCallback = loaderContext.callback = function (...args) {
    if (isDone) return
    isDone = true
    isSync = false
    console.log('---------')
    callback.apply(null, args)
  }
  let result = fn.apply(loaderContext, args)

  if (isSync) {
    /// 同步
    if (isDone) return
    isDone = true
    if (result === undefined) {
      return callback()
    }
    if (result && typeof result === 'object' && typeof result.then === 'function') {
      return result.then(function (r) {
        callback(null, r)
      }, callback)
    }
    return callback(null, result)
  }
}

function processResource(processOptions, loaderContext, finallyCallback) {
  loaderContext.loaderIndex = loaderContext.loaders.length - 1
  let resource = loaderContext.resource
  loaderContext.readResource(resource, (err, resourceBuffer) => {
    if (err) return finallyCallback(err)
    processOptions.resourceBuffer = resourceBuffer
    console.log('resourceBuffer: ', resourceBuffer.toString())
    iterateNormalLoaders(processOptions, loaderContext, [resourceBuffer], finallyCallback)
  })
}

function createLoaderObject(loader) {
  let obj = {
    normal: null,
    pitch: null,
    raw: false, /// loader 的 source 是字符串还是 buffer，默认 false 转为字符串
    data: {}, /// 每个 loader 都有自定义数据对象存储自定义信息
    pitchExecuted: false, /// 是否已经执行 pitch 方法
    normalExecuted: false, /// 是否以及执行 normal 方法
  }
  obj.request = loader
  let normal = require(obj.request)
  obj.normal = normal
  obj.pitch = normal.pitch
  obj.raw = normal.raw
  return obj
}

exports.runLoaders = runLoaders
