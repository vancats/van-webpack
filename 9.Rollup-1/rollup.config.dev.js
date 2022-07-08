
import babel from 'rollup-plugin-babel'
/// 告知如何解析 node_modules
import resolve from '@rollup/plugin-node-resolve'
/// 解析 cjs
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
import liveReload from 'rollup-plugin-livereload'

export default {
  input: './src/index.js',
  output: {
    file: './dist/bundle.js',
    format: 'iife', ///  es/cjs/iife/umd/amd/system
    name: 'Calculator', /// iife 和 umd 的时候必须使用，作为全局模块
    globals: {
      lodash: '_', /// 告诉 rollup 这个模块不要打包了，直接全局变量取
      jquery: '$',
    }
  },
  plugins: [
    // babel({
    //   exclude: /node_modules/
    // }),
    resolve(),
    commonjs(),
    typescript(),
    postcss(),
    serve({
      // open: true,
      port: 8080,
      contentBase: './dist'
    }),
    /// 自动重启
    liveReload()
  ],
  external: ['lodash'], /// 使用这个必须要 iife
}
