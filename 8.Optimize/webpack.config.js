
const path = require('path')
const Webpack = require('webpack')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const glob = require('glob')
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

const smw = new SpeedMeasureWebpackPlugin()

// module.exports = smw.wrap({
module.exports = {
  mode: 'development',
  devtool: false,
  // entry: './src/index.js',
  entry: {
    pageA: './src/PageA.js',
    pageB: './src/PageB.js',
    pageC: './src/PageC.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    // publicPath: '', /// CDN 加前缀
    // library: 'Calculator', /// 导出的库的名称
    /**
     * 1. var 以 script 标签导入，以全局变量形式使用
     * 2. commonjs exports.Calculator = x / commonjs2 module.exports = { Calculator: x }
     * 3. amd
     * 4. umd
     * 5. this 直接挂载到当前调用的 this 上
     * 6. window 直接挂载到 window 上
     */
    // libraryTarget: 'umd',
    // libraryExport: 'add', /// 配置哪些子模块需要被导出，只有 commonjs(2) 时才生效
  },
  optimization: {
    splitChunks: {
      chunks: 'all', /// async initial all
      minSize: 30000, /// 代码块的最小尺寸
      minChunks: 1, /// 被多少模块共享
      maxInitialRequests: 3, /// 入口最大并行请求数
      maxAsyncRequests: 5, /// 按需加载最大并行请求数
      // name: true, /// pageA~pageB~pageC
      // automaticNameDelimiter: '~',
      cacheGroups: {
        vendors: {
          chunks: 'initial', /// 分割的是同步代码块
          test: /node_modules/,
          priority: -10, /// 一个模块可能满足多个缓存，会被抽取到优先级高的缓存组
        },
        commons: {
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true, /// 如果该 chunk 引用了已经抽取的 chunk，直接引用他而不是重复打包
        }
      }
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'bootstrap': path.resolve('node_modules/bootstrap/dist/css/bootstrap.css')
    },
    // modules: ['myPlugins', 'node_modules'], /// 可以写绝对路径
    /// 优先级 fields > files
    mainFields: ['chrome', 'browser', 'module', 'main'],
    // mainFiles: ['entry'],
  },
  // resolveLoader: {
  //   extensions: ['.js'],
  //   alias: {},
  //   modules: ['myLoaders', 'node_modules'], /// 可以写绝对路径
  //   mainFields: [],
  //   mainFiles: [],
  // },
  module: {
    /// 如果使用了 noParse，那么这些模块内部就不能含有 import require define，不然不解析
    noParse: /jquery|lodash/,
    rules: [
      // {
      //   test: /.js$/,
      //   include: path.resolve(__dirname, 'src'),
      //   use: [
      // {

      //   /// 开启多进程
      //   loader: 'thread-loader',
      //   options: {
      //     worker: 3
      //   }
      // },
      // 'babel-loader'
      // 'log-loader'
      // ]
      // },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  stats: 'normal', /// none errors-only minimal normal verbose
  plugins: [
    // 向输出目录写入 html，并插入打包后的脚本
    new HTMLWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
    new HTMLWebpackPlugin({
      template: './index.html',
      filename: 'pageA.html',
      chunks: ['pageA']
      // excludeChunks: ['pageB', 'pageC'],
    }),
    new HTMLWebpackPlugin({
      template: './index.html',
      filename: 'pageB.html',
      excludeChunks: ['pageA', 'pageC'],
    }),
    new HTMLWebpackPlugin({
      template: './index.html',
      filename: 'pageC.html',
      excludeChunks: ['pageA', 'pageB'],
    }),
    /// 匹配模块路径正则 匹配模块的目录名
    new Webpack.IgnorePlugin({
      /// 需要加上$, 表示仅忽略全量引入，后续可自行引入中文包
      contextRegExp: /moment$/,
      resourceRegExp: /^\.\/locale/
    }),
    new FriendlyErrorsWebpackPlugin(),
    // new BundleAnalyzerPlugin()
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:6].css'
    }),
    new PurgecssWebpackPlugin({
      paths: glob.sync(`${path.resolve(__dirname, 'src')}/**/*`)
    }),
  ]
}
