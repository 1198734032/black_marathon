import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//粒子特效
import VueParticles from 'vue-particles'
Vue.use(VueParticles)


//element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
