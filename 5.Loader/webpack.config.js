const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  resolveLoader: {
    alias: {
      'babel-loader2': path.resolve(__dirname, 'webpack-loaders', 'babel-loader2.js')
    },
    /// 指定模块路径
    modules: [path.resolve(__dirname, 'webpack-loaders'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          {
            loader: 'babel-loader2',
            options: {
              presets: [
                '@babel/preset-env',
              ]
            }
          }
        ]
      },
      {
        test: /(jpe?g|png|gif|bmp)$/,
        use: [
          {

            loader: 'url-loader2',
            options: {
              filename: '[hash].[ext]',
              limit: 10 * 1024,
              fallback: path.resolve(__dirname, 'webpack-loaders/file-loader2.js')
            }
          }
        ]
      },
      {
        test: /.less$/,
        use: [
          'style-loader2',
          'less-loader2'
        ]
      },
      {
        test: /.css$/,
        use: [
          'style-loader2',
          'css-loader2',
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
