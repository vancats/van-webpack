const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const Webpack = require('webpack')
// const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const FileManagerWebpackPlugin = require('filemanager-webpack-plugin')
const HTMLWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

console.log('process.env.NODE_ENV', process.env.NODE_ENV)
module.exports = (env) => {
  console.log('env', env)
  // const isProduction = env.production
  return {
    // mode: process.env.NODE_ENV,
    mode: 'development',
    // devtool: 'hidden-source-map', // 生产
    devtool: 'source-map',
    // optimization: {
    //   minimize: true,// 启用最小化
    //   minimizer: [
    //     new TerserPlugin(), // 以前是 UglifyJS
    //   ]
    // },
    entry: {
      main: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name]-[chunkhash:6].js',
      // 公开访问路径
      // publicPath: '/'
      // publicPath: 'http://CDNIP/static..'
    },
    // watch: true, // 监控模式
    // watchOptions: {
    //   ignored: /node_modules/,
    //   aggregateTimeout: 300, // 防抖
    //   poll: 1000, // 轮询
    // },
    devServer: {
      // dist 默认可访问，这里是开启一个新的静态文件根目录
      static: {
        directory: path.resolve(__dirname, 'public'),
      },
      compress: true, // gzip
      port: 8080,
      onBeforeSetupMiddleware: function (devServer) {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined')
        }

        devServer.app.get('/api/user', function (req, res) {
          res.json([{ "name": "vancats", "age": 19 }])
        })
      },
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          pathRewrite: {
            '^/api': ''
          }
        }
      }
      // open: true, // 自动开浏览器
    },
    // externals: {
    //   lodash: '_', // 如 果模块内部引用了 lodash，会从 window 取值
    // },
    module: {
      rules: [
        // {
        //   test: /\.jsx?$/,
        //   loader: 'eslint-loader',
        //   enforce: 'pre',
        //   options: { fix: true },
        //   exclude: /node_modules/
        // },
        {
          // 把模块暴露给全局变量
          test: require.resolve('lodash'), // 获取模块的入口文件绝对路径
          loader: 'expose-loader',
          options: {
            exposes: {
              globalName: '_',
              override: true
            }
          }
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              // ? 预设从前往后，装饰器从后往前
              presets: ['@babel/preset-env', '@babel/preset-react'], // 预设
              // presets: [
              //   [
              //     '@babel/preset-env',
              //     {
              //       // useBuiltIns: false,
              //       useBuiltIns: 'usage',
              //       corejs: 3,
              //     }
              //   ]
              //   , '@babel/preset-react'],
              plugins: [
                ['@babel/plugin-transform-runtime', {
                  corejs: 3,
                  // 移除内联的babel helpers 并且替换为 @babel/runtime-corejs3，不再模块创建
                  helpers: true,
                  // 是否开启generator函数转换regenerator-runtime避免全局污染
                  // 如果是true用自己实现一个generator而不是generatorRuntime
                  regenerator: false,
                }],
                /**
                 * ! 两者顺序不能调换 并且如果 legacy 为 true，loose 也必须为 true
                 * * 类的装饰器
                 * * legacy: @classDecorator class Person
                 * * 新写法:  class @classDecorator Person
                 *
                 * * 类的属性
                 * * class Person { name: 'vancats' }
                 * * loose true
                 * *  let p = new Person; p.name = 'vancats'
                 * * loose false
                 * *  Object.defineProperty(p, 'name', { value: 'vancats' })
                 */
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
              ]
            }
          }
        },
        {
          test: /\.css$/,
          // ? CSS插入DOM ｜ 解析 @import url
          // use: ['style-loader', 'css-loader']
          use: [MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // ? 在使用css import语法时，加载入的css需要使用后面的几个loader
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    { browsers: 'last 5 version' },
                  ],
                ],
              },
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 一个 rem 多少像素
              remPrecision: 8, // 保留 8 位小数
            }
          }
          ]
        },
        {
          test: /\.less$/,
          // use: ['style-loader', 'css-loader', 'less-loader']
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
        },
        {
          test: /\.txt$/,
          // use: ['raw-loader'],
          type: 'asset/source'
        },
        {
          test: /\.(jpe?g|png|bmp|gif|svg)$/,
          // type: 'asset/resource',
          // type: 'asset', // 让 webpack 自己判断
          // parser: {
          //   dataUrlCondition: {
          //     maxSize: 4 * 1024,
          //   }
          // },
          use: [
            {
              // loader: 'file-loader',
              loader: 'url-loader',
              options: {
                name: '[hash:6].[ext]',
                esModule: false, // 是否包装成 ES6 模块 Module.export
                limit: 4 * 1024,
                outputPath: 'images',
                publicPath: '/images',
              }
            },
            // {
            //   loader: 'image-webpack-loader',
            //   options: {
            //     mozjpeg: {
            //       progressive: true,
            //       quality: 65,
            //     },
            //     optipng: {
            //       enabled: false
            //     },
            //     pngquant: {
            //       quality: '65-90',
            //       speed: 4
            //     },
            //     gifsicle: {
            //       interlaced: false
            //     },
            //     webp: {
            //       quality: 75
            //     }
            //   }
            // }
          ]
        },
      ]
    },
    plugins: [
      // 向输出目录写入 html，并插入打包后的脚本
      new HTMLWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        // html 压缩
        minify: {
          collapseWhitespace: true,
          removeComments: true
        }
      }),
      // 修改环境变量
      new Webpack.DefinePlugin({
        // 'NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      // new ESLintWebpackPlugin({
      //   extensions: [`js`, `jsx`],
      //   exclude: /node_modules/,
      //   fix: true,
      // })
      // // 新增内容到 main.js
      // new Webpack.SourceMapDevToolPlugin({
      //   append: `\n//# sourceMappingURL=http://127.0.0.1:8080/[url]`,
      //   filename: '[file].map'
      // }),
      // 文件模块管理
      // new FileManagerWebpackPlugin({
      //   events: {
      //     onEnd: {
      //       copy: [
      //         {
      //           source: './dist/*.map',
      //           destination: '/Users/vancats/Desktop/demo/webpack/maps'
      //         }
      //       ],
      //       delete: ['./dist/*.map']
      //     }
      //   }
      // }),
      new Webpack.ProvidePlugin({
        // 可以免重复导入
        '_': 'lodash'
      }),
      new HTMLWebpackExternalsPlugin({
        externals: [
          {
            module: 'lodash',
            entry: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
            global: '_'
          },
        ]
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/design',
            to: 'design/'
          }
        ]
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['**/*']
      }),
      // 只负责提取
      new MiniCssExtractPlugin({
        filename: 'css/[name]-[contenthash:6].css'
      })
    ]
  }
}
