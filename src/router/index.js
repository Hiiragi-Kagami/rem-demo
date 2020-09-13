import Vue from 'vue'
import Router from 'vue-router'
import Login from 'views/Login.vue'
import Register from 'views/Register.vue'
import User from 'views/User.vue'
import UserEdit from 'views/UserEdit.vue'
import Home from 'views/Home.vue'
import VideoDetail from 'views/VideoDetail.vue'
Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/user',
    component: User,
    meta: {
      isToken: true
    }
  },
  {
    path: '/userEdit',
    component: UserEdit,
    meta: {
      isToken: true
    }
  },
  {
    path: '/home',
    component: Home,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/videoDetail',
    component: VideoDetail,
    meta: {
      isToken: true
    }
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // 当前跳转路由需要token时,且拥有token时可以访问.或者不需要token.
  if ((window.sessionStorage.getItem('token') && to.matched.some(item => item.meta.isToken)) || !to.matched.some(item => item.meta.isToken)) {
    next()
  } else {
    next('/login')
  }
})

export default router
