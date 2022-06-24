let stats = {
  hash: '6f9a58cf161b4e3fc2ed',
  version: '5.73.0',
  time: 42,
  builtAt: 1655913144439,
  publicPath: 'auto',
  outputPath: '/Users/vancats/Desktop/demo/webpack/dist',
  assetsByChunkName: { main: ['main.js'] }, /// key 是代码块名字，值是文件资源
  assets: [
    {
      type: 'asset',
      name: 'main.js',
      // size: 662,
      // emitted: true,
      // comparedForEmit: false,
      // cached: false,
      // info: [Object],
      // chunkNames: [Array],
      // chunkIdHints: [],
      // auxiliaryChunkNames: [],
      // auxiliaryChunkIdHints: [],
      // filteredRelated: undefined,
      // related: {},
      // chunks: [Array],
      // auxiliaryChunks: [],
      // isOverSizeLimit: false
    }
  ],
  filteredAssets: undefined,
  chunks: [
    {
      rendered: true,
      initial: true,
      entry: true,
      recorded: false,
      reason: undefined,
      size: 0,
      names: [Array],
      idHints: [],
      runtime: [Array],
      files: ['main.js'], /// 这个chunk 产出了哪些文件
      auxiliaryFiles: [],
      hash: '385b69b95dd8293fef7d', /// chunkhash
      id: 'main',
      siblings: [],
      parents: [],
      children: [],
      origins: [Array]
    }
  ],
  modules: [],
  filteredModules: undefined,
  entrypoints: { /// 入口点
    main: {
      name: 'main',
      chunks: [Array],
      assets: [Array],
      filteredAssets: 0,
      assetsSize: 662,
      auxiliaryAssets: [],
      filteredAuxiliaryAssets: 0,
      auxiliaryAssetsSize: 0,
      children: {},
      childAssets: {},
      isOverSizeLimit: false
    }
  },
  errors: [],
  errorsCount: 0,
  warnings: [],
  warningsCount: 0,
  children: []
}
