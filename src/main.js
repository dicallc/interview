import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import Bmob from 'hydrogen-js-sdk'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
// 初始化
Bmob.initialize('52a4dcd0b55d381ea553cdc9b78263c2', 'acc471a8300f7dda28371274650d5216')
Vue.use(mavonEditor)
Vue.config.productionTip = false
// 挂载到全局使用
Vue.prototype.$Bmob = Bmob
Vue.use(MuseUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
