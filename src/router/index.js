import Vue from 'vue'
import VueRouter from 'vue-router'
const index = () => import('@/views/index.vue');
const login = () => import('@/views/login.vue');
const submit = () => import('@/views/submit.vue');

const upload = () => import('@/components/upload1.vue');
Vue.use(VueRouter)

const routes = [
  {
    path: '/index',
    component: index
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  }, {
    path: '/submit',
    component: submit
  },
  {
    path: '/upload',
    component: upload
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
