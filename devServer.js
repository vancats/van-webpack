const express = require('express')
const webpack = require('webpack')
const WebpackDevMiddleware = require('webpack-dev-middleware')
const app = express()

const config = require('./webpack.config')()
const compiler = webpack(config)

app.get('/api/user1', (req, res) => {
  res.json({ data: 'user1' })
})

app.get('/api/user2', (req, res) => {
  res.json({ data: 'user2' })
})

// before 会比静态资源早返回
app.get('/main.js', (req, res) => {
  res.json({ data: 'main.js' })
})

// 静态文件中间件
app.use(WebpackDevMiddleware(compiler, {}))

app.get('/api/after', (req, res) => {
  res.json({ data: 'after' })
})
app.get('/main.js', (req, res) => {
  res.json({ data: 'main.js' })
})

app.listen(3000, () => {
  console.log('已启动！')
})
