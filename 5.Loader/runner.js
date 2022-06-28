const path = require('path')
const fs = require('fs')

const { runLoaders } = require('./loader-runner')
// const { runLoaders } = require('loader-runner')

let filePath = path.resolve(__dirname, 'src', 'index.js') // 入口模块

/// 定义 inline-loader
let request = `inline1-loader!inline2-loader!${filePath}`

let rules = [
  {
    test: /.js$/,
    enforce: 'pre',
    use: ['pre1-loader', 'pre2-loader']
  },
  {
    test: /.js$/,
    use: ['normal1-loader', 'normal2-loader']
  },
  {
    test: /.js$/,
    enforce: 'post',
    use: ['post1-loader', 'post2-loader']
  },
]

const resolveLoader = loader => path.resolve(__dirname, 'loaders', loader)

let parts = request.replace(/^-?!+/, '').split('!')
let resource = parts.pop()
let preLoaders = [], normalLoaders = [], inlineLoaders = [], postLoaders = []


for (let i = 0; i < rules.length; i++) {
  let rule = rules[i]
  if (rule.test.test(resource)) {
    if (rule.enforce === 'pre') {
      preLoaders.push(...rule.use)
    } else if (rule.enforce === 'post') {
      postLoaders.push(...rule.use)
    } else {
      normalLoaders.push(...rule.use)
    }
  }
}

inlineLoaders = parts
// inlineLoaders = parts.map(resolveLoader)
// preLoaders = preLoaders.map(resolveLoader)
// normalLoaders = normalLoaders.map(resolveLoader)
// postLoaders = postLoaders.map(resolveLoader)

let loaders = []
if (request.startsWith('!!')) {
  loaders = [...inlineLoaders]
} else if (request.startsWith('-!')) {
  loaders = [...postLoaders, ...inlineLoaders]
} else if (request.startsWith('!')) {
  loaders = [...postLoaders, ...inlineLoaders, ...preLoaders]
} else {
  loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders]
}

loaders = loaders.map(resolveLoader)
// console.log(loaders)

debugger
runLoaders({
  resource, // 要加载的模块
  loaders,  // loader 数组
  context: { name: 'vancats' },// 基础上下文对象
  readResource: fs.readFile.bind(fs), // 读取硬盘文件方法
}, (err, result) => {
  console.log('err: ', err)
  console.log('result: ', result)
})
