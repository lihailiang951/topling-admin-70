import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      // 在整个目录项目中，模块路径中的 @ 表示的是src目录
      // 无论你当前模块在哪里，@都可以直接定位到 src
      // 加载一个目录可以默认加载它的 index.js、index.json、index.vue 。。。
      // component: () => import('@/view/home/index.vue')
      component: () => import('@/views/home')
    },
    {
      name: 'login',
      path: '/login',
      // 在整个目录项目中，模块路径中的 @ 表示的是src目录
      // 无论你当前模块在哪里，@都可以直接定位到 src
      component: () => import('@/views/login')
    }
  ]
})
