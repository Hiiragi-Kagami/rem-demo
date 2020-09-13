// 自动转化rem工具(和webStorm的插件不同)
const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-px2rem')

module.exports = {
  configureWebpack: {
    resolve: {
      // 配置路径可省略的后缀,已经在公共配置里默认配置了一些
      extensions: [],
      // 配置路径别名,默认已经配了'@'路径为项目的src路径,且在dom里使用别名要用到~
      alias: {
        assets: '@/assets',
        components: '@/components',
        views: '@/views',
        network: '@/network',
        store: '@/store',
        modules: '@/modules',
        router: '@/router',
        commonJs: '@/commonJs'
      }
    }
  },
  devServer: {
    // 项目运行时候的端口号
    port: 4000
  },
  // 配置rem相关
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            // 转换比例
            remUnit: 100,
            propList: ['*']
          })
        ]
      }
    }
  }
}
