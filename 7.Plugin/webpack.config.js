const path = require('path')
const DonePlugin = require('./plugins/DonePlugin')
const AssetPlugin = require('./plugins/AssetPlugin')
const ZipPlugin = require('./plugins/ZipPlugin')
const HashPlugin = require('./plugins/HashPlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AutoExternalPlugin = require('./plugins/AutoExternalPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    // filename: '[name].[fullhash].js',
    // filename: '[name].[chunkhash].js',
    filename: '[name]-[hash].js',
  },
  // externals: {
  //   'jquery': '$'
  // },
  module: {
    rules: [
      {
        test: /.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html?v=[hash]'
    }),
    new DonePlugin(),
    new AssetPlugin(),
    new ZipPlugin({
      filename: 'assets_[timestamp].zip'
    }),
    new HashPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css'
    }),
    new AutoExternalPlugin({
      jquery: {
        expose: '$',
        url: 'https://code.jquery.com/jquery-3.6.0.min.js'
      },
      lodash: {
        expose: '_',
        url: 'hello'
      }
    })
  ]
}
