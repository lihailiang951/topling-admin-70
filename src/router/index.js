import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
import { getUser } from '@/utils/auth'

Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   // 在整个目录项目中，模块路径中的 @ 表示的是src目录
    //   // 无论你当前模块在哪里，@都可以直接定位到 src
    //   // 加载一个目录可以默认加载它的 index.js、index.json、index.vue 。。。
    //   // component: () => import('@/view/home/index.vue')
    //   component: () => import('@/views/home')
    // },
    { // layout 显示到根数组的路由接口
      // name: 'layout', // 使用 JaavaScript 命名导航不会渲染默认子路由
      path: '/',
      component: () => import('@/views/layout'),
      children: [ // 所有 children 路由都显示到父路由的 router-view 中
        {
          name: 'home',
          path: '/home',
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'article',
          path: '/article',
          component: () => import('@/views/article')
        },
        {
          name: 'publish-edit',
          path: '/publish/:id',
          component: () => import('@/views/publish')
        },
        {
          name: 'comment',
          path: '/comment',
          component: () => import('@/views/comment')
        },
        {
          name: 'account',
          path: '/account',
          component: () => import('@/views/account')
        },
        {
          name: 'media',
          path: '/media',
          component: () => import('@/views/media')
        }
      ]
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

/*
  全局前置守卫
  当你访问路由页面的时候，会先进入这里
  to 要去哪里的相关数据
  from 来自哪里的相关数据
  next 允许通过的方法
*/

router.beforeEach((to, from, next) => {
  // 路由当行前， 开启进度条
  nprogress.start()
  // const userInfo = window.localStorage.getItem('user_info')
  const userInfo = getUser()
  if (to.path !== '/login') {
    // 如果是非登录页面
    //   没有登录，跳转到登录页
    if (!userInfo) {
      if (from.path === '/login') {
        nprogress.done()
      }
      next({ name: 'login' })
      // next('/login')
      // next({ path: '/login' })
    } else {
      //    登录了，允许通过
      next()
    }
  } else {
    // 如果是登录页面
    //   没有登录，允许通过
    if (!userInfo) {
      next()
    } else {
      console.log(123)
      //   登录了，不允许通过
      // next(false) // 中断当前导航
      // next({ name: 'home' })
      window.location.href = '/#/'
      window.location.reload()
    }
  }
})

router.afterEach((to, from) => {
  // 路由导航完成，结束进度条
  nprogress.done()
})

export default router
