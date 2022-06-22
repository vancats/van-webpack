const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              /// 最通用的库 babel-plugin-import
              [
                path.resolve(__dirname, 'plugins/bebel-plugin-import.js'),
                {
                  library: 'lodash'
                  // libraries: ['lodash']
                }
              ]
            ]
          }
        }
      }
    ]
  }
}
