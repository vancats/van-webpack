
const path = require('path')
const DonePlugin = require('./plugins/done-plugin')
const RunPlugin = require('./plugins/run-plugin')
const EmitPlugin = require('./plugins/emit-plugin')

module.exports = {
  mode: 'development',
  devtool: false,
  // context: process.cwd(), // 当前工作目录
  entry: {
    entry1: './src/entry1.js',
    entry2: './src/entry2.js'
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, 'loaders', 'logger1-loader.js'), // 自定义 loader 绝对路径
          path.resolve(__dirname, 'loaders', 'logger2-loader.js') // 自定义 loader 绝对路径
        ]
      }
    ]
  },
  plugins: [
    new RunPlugin(),
    new DonePlugin(),
    new EmitPlugin(),
  ]
}

