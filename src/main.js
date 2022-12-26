// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 2. 引入组件样式
import Vue from 'vue'
import App from './App'
import Vant from 'vant';
import 'vant/lib/index.css';
import router from './router'
import axios from 'axios';
import VueCropper from 'vue-cropper' 

Vue.config.productionTip = false
Vue.prototype.axios = axios;
Vue.use(Vant);
Vue.use(VueCropper)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
