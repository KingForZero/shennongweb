import Vue from 'vue'
import App from './App'
import router from './router'
import api from './http'
import i18n from './i18n'
import store from './store'
import global from '@/utils/global'
import ElementUI from 'element-ui'
import $ from 'jquery'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/iconfont/iconfont.css'
import htmlToPdf from '@/utils/html2pdf'
import Icon from 'vue-svg-icon/Icon.vue'

Vue.component('icon', Icon)
Vue.use(htmlToPdf)
Vue.use(ElementUI)
Vue.use(api)

Vue.prototype.global = global

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
});
import websdk from 'easemob-websdk'
let webIM = window.WebIM = websdk
Vue.prototype.$WebIM = webIM
const imConn = new webIM.connection({
  isMultiLoginSessions: webIM.config.isMultiLoginSessions,
  https: typeof webIM.config.https === 'boolean' ? webIM.config.https : location.protocol === 'https:',
  url: webIM.config.xmppURL,
  isAutoLogin: true,
  heartBeatWait: webIM.config.heartBeatWait,
  autoReconnectNumMax: webIM.config.autoReconnectNumMax,
  autoReconnectInterval: webIM.config.autoReconnectInterval,
  apiUrl: webIM.config.apiURL
})
Vue.prototype.$imConn = imConn


