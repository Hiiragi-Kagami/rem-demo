import Vue from 'vue'
import App from '@/App.vue'
import router from 'router/index.js'
import store from 'store/store.js'
import { remSet } from 'commonJs/remSetting.js'
import { vant } from 'commonJs/frame/vant.js'
import { request } from 'network/request.js'
// 将网络方法挂载在全局
Vue.prototype.$http = request
// rem支持开启
remSet({
  remPx: 100,
  devDependenciesWidth: 375,
  maxWidth: 825,
  minWidth: 225
})
// 自定义按需导入vant
Vue.use(vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
