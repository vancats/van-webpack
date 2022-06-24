
const path = require('path')
const fs = require('fs')
const { SyncHook } = require('tapable')
const { toUnixPath } = require('./utils')
const types = require('babel-types')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

let rootPath = toUnixPath(process.cwd())
class Compiler {
  constructor(options) {
    this.options = options
    this.hooks = {
      run: new SyncHook(),  // 开启编译
      emit: new SyncHook(), // 写入文件系统
      done: new SyncHook(), // 编译结束
    }
    this.entries = new Set() // 所有的入口模块 webpack4 是数组
    this.modules = new Set() // 所有的模块
    this.assets = {}         // 本次产出的文件
    this.files = new Set()   // 本次编译所有产出的文件名
    this.chunks = new Set()  // 所有的代码块
  }
  run(callback) {
    this.hooks.run.call()
    /// 5. 根据配置的 entry 找到入口文件
    let entry = {}
    if (typeof this.options.entry === 'string') {
      entry.main = this.options.entry
    } else {
      entry = this.options.entry
    }
    for (const entryName in entry) {
      let entryPath = toUnixPath(path.join(rootPath, entry[entryName]))
      /// 6. 从入口文件出发，调用所有配置的 loader 对模块进行编译
      // entryName ./src/entry1.js entryPath 绝对路径
      let entryModule = this.buildModule(entryName, entryPath)
      this.entries.add(entryModule)
      // this.modules.add(entryModule)

      /// 8. 根据入口与模块之间的依赖关系，组装成一个个包含多个模块的chunk
      let chunk = { name: entryName, entryModule, modules: Array.from(this.modules).filter(module => module.name === entryName) }
      this.chunks.add(chunk)
    }

    /// 9. 再把每个 chunk 转换成一个单独的文件加入到输出列表 this.assets  key: 文件名 value: 文件内容
    const output = this.options.output
    this.chunks.forEach(chunk => {
      let filename = output.filename.replace('[name]', chunk.name)
      this.assets[filename] = getSource(chunk)
    })

    /// 触发事件
    this.hooks.emit.call()
    this.files = Object.keys(this.assets)
    for (let filename in this.assets) {
      let filePath = path.join(output.path, filename)
      fs.writeFileSync(filePath, this.assets[filename])
    }

    /// 触发 done 回调
    this.hooks.done.call()

    callback(null, {
      toJson: () => ({
        entries: this.entries,
        chunks: this.chunks,
        modules: this.modules,
        files: this.files,
        assets: this.assets,
      })
    })
  }

  buildModule(entryName, modulePath) {
    // 读取此模块内容
    const originalSourceCode = fs.readFileSync(modulePath, 'utf-8')
    let targetSourceCode = originalSourceCode
    // 调用所有配置的 loader 对模块进行编译
    const rules = this.options.module.rules
    // 得到本模块生效的 loader 有哪些
    let loaders = []
    for (let i = 0; i < rules.length; i++) {
      // if (rules[i].test.test(modulePath)) {
      if (modulePath.match(rules[i].test)) {
        loaders = [...loaders, ...rules[i].use]
      }
    }

    // 执行所有 loader
    for (let i = loaders.length - 1; i >= 0; i--) {
      targetSourceCode = require(loaders[i])(targetSourceCode)
    }
    /// 7. 找出该模块依赖的模块，递归处理所有模块
    // 相对根路径的绝对路径
    let moduleId = './' + path.posix.relative(rootPath, modulePath)

    let module = { id: moduleId, dependencies: [], name: entryName }
    let ast = parser.parse(targetSourceCode, { sourceType: 'module' })
    traverse(ast, {
      CallExpression: ({ node }) => {
        if (node.callee.name === 'require') {
          const extensions = this.options.resolve.extensions
          /// 要引入模块的相对路径
          let moduleName = node.arguments[0].value
          /// 获取当前模块的所在目录 /Users/vancats/Desktop/demo/webpack/4.Flow/src
          let dirName = path.posix.dirname(modulePath)
          /// /Users/vancats/Desktop/demo/webpack/4.Flow/src/title
          let depModulePath = path.posix.join(dirName, moduleName)
          /// /Users/vancats/Desktop/demo/webpack/4.Flow/src/title.js
          depModulePath = tryExtensions(depModulePath, extensions, moduleName, dirName)
          console.log('depModulePath: ', depModulePath)

          /// ./src/title.js
          let depModuleId = './' + path.posix.relative(rootPath, depModulePath)
          node.arguments = [types.stringLiteral(depModuleId)]
          /// 判断已经编译过的 modules 中有没有该模块
          let alreadyModuleIds = Array.from(this.modules).map(module => module.id)
          if (!alreadyModuleIds.includes(depModuleId)) {
            module.dependencies.push(depModulePath)
          }
        }
      }
    })

    let { code } = generator(ast)
    module._source = code
    /// 把当前依赖编译完成，会找到它的所有依赖，递归编译，添加到 this.modules
    module.dependencies.forEach(dependency => {
      let depModule = this.buildModule(entryName, dependency)
      this.modules.add(depModule)
    })
    return module
  }
}

/**
 * @param {*} modulePath 拼出来的模块路径 /Users/vancats/Desktop/demo/webpack/4.Flow/src/title
 * @param {*} extensions 扩展名 ['.js', '.json']
 * @param {*} originalModulePath 原始路径 ./title
 * @param {*} moduleContext 模块上下文/Users/vancats/Desktop/demo/webpack/4.Flow/src
 */
function tryExtensions(modulePath, extensions, originalModulePath, moduleContext) {
  console.log('modulePath: ', modulePath)
  // 有可能已经写 .js，就不需要匹配其他的
  extensions.unshift('')
  for (let i = 0; i < extensions.length; i++) {
    if (fs.existsSync(modulePath + extensions[i])) {
      return modulePath + extensions[i]
    }
  }
  throw new Error(`Module not found: Error: Can't resolve ${originalModulePath} in  ${moduleContext}`)
}

/**
 * @description: 获取chunk对应的源代码
 * @return {*}
 * @param {*} chunk
 */
function getSource(chunk) {
  return `
  (() => {
    var modules = ({
      ${chunk.modules.map(module => `
        "${module.id}":
        ((module) => {
          ${module._source}
        })
      `).join(',')
    }
    })
    var cache = {}
    function require(moduleId) {
      var cachedModule = cache[moduleId]
      if (cachedModule !== undefined) {
        return cachedModule.exports
      }
      var module = cache[moduleId] = {
        exports: {}
      }
      modules[moduleId](module, module.exports, require)
      return module.exports
    }
    var exports = {};
    (() => {
      ${chunk.entryModule._source}
    })()
  })()
  `
}

module.exports = Compiler

