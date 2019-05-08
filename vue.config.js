const path = require('path')
// const outputDir = '../MumSever/public'
const assetsDir = 'static'
const outputDir = 'dist'
// posix兼容方式处理路径
const posixJoin = _path => path.posix.join(assetsDir, _path)
// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']
// cdn开关
const OPENCDN = true
const lastVersion = new Date().getTime()
const webpackHtmlOptions = {
  // dns预加载，优化接口请求
  // dnsPrefetch: [
  //   'https://aaa.exmaple.com',
  //   'https://bbb.exmaple.com',
  //   'https://ccc.exmaple.com',
  //   'https://ddd.exmaple.com',
  //   'https://eee.exmaple.com',
  //   'https://fff.exmaple.com'
  // ],
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'muse-ui': 'MuseUI',
    // 'marked': 'Marked',
    'mavon-editor': 'MavonEditor',
    'js-cookie': 'Cookies'
  },
  cdn: {
    // 生产环境
    build: {
      css: [
      ],
      js: [
        'https://cdn.jsdelivr.net/npm/vue@2.5.21/dist/vue.min.js',
        'https://unpkg.com/muse-ui/dist/muse-ui.js',
        // 'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
        'https://cdn.jsdelivr.net/npm/mavon-editor@2.7.4/dist/mavon-editor.min.js',
        'https://cdn.jsdelivr.net/npm/js-cookie@2.2.0/src/js.cookie.min.js',
        'https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.min.js',
        'https://unpkg.com/vuex@3.0.1/dist/vuex.min.js'
      ]
    }
  }
}

const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  publicPath: './',
  // 输出目录
  outputDir: outputDir,
  lintOnSave: true,
  // 是否为生产环境构建生成 source map？
  productionSourceMap: false,
  // 高级的方式
  configureWebpack: config => {
    if (isProd) {
      // 生成环境执行task任务，写入版本号
      const task = require('./task')
      task.run(lastVersion)
      // 启用gzip
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }))
      config.plugins.push(
        // new UglifyJsPlugin({
        //   uglifyOptions: {
        //     compress: {
        //       warnings: false,
        //       drop_debugger: true,
        //       drop_console: true
        //     }
        //   },
        //   sourceMap: false,
        //   parallel: true
        // })
      )
      // 开启cdn状态：externals不进入webpack打包
      if (OPENCDN) {
        config.externals = webpackHtmlOptions.externals
      }
    } else {
      // 开发环境
    }
  },
  chainWebpack: config => {
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     */
    config.plugins
      .delete('prefetch')
      .delete('preload')
    // 清除警告
    config.performance.set('hints', false)
    // 将版本号写入环境变量
    config.plugin('define').tap(args => {
      args[0]['app_build_version'] = lastVersion
      return args
    })
    config
      .when(isProd, config =>
        // 生产环境js增加版本号
        config.output
          .set('filename', posixJoin(`js/${lastVersion}-[name].[chunkhash].js`))
          .set('chunkFilename', posixJoin(`js/${lastVersion}-[id].[chunkhash].js`))
      )
    /**
     * 添加CDN参数到htmlWebpackPlugin配置中， 修改 public/index.html
     */
    config.plugin('html').tap(args => {
      // 生产环境将cdn写入webpackHtmlOptions，在public/index.html应用
      if (isProd && OPENCDN) {
        args[0].cdn = webpackHtmlOptions.cdn.build
      }
      return args
    })
  },
  css: {
    extract: !isProd ? false : {
      filename: posixJoin(`css/${lastVersion}-[name].[contenthash:8].css`),
      chunkFilename: posixJoin(`css/${lastVersion}-[name].[contenthash:8].css`)
    },
    sourceMap: false,
    loaderOptions: {}, // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    modules: false
  },
  devServer: {
    port: 8081
  }
}
