import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'
import axios from 'axios'
import { getUser, removeUser } from '@/utils/auth'
import JSONbig from 'json-bigint'
import store from './store'

import router from './router'

// 引入公共样式文件，最好在 element 样式文件之后，可以自定义修改 element 内置样式
import './styles/index.less'

// 配置 axios 的基础路径
// 例如我要发请求，直接写 axios{{ url: '/authorizations' }}
// 路径最后的 /, 多退少补
// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'

/**
 * 如何解决后端返回数据中的数字超出安全整数范围问题？
 * axios 预留的自定义处理后端返回的原始数据
 * 可以理解成也是一个响应拦截器，这个比较特殊
 * 这里的 data 是后端返回的未经处理的原始数据
 * axios 默认使用 JONS.parse 去转换原始数据，如果其中有超出安全整数范围的数据就有问题了
 * 所以我们在这里可以手动处理这个原始数据
 *   npm i json-biginit
 *   JSONbig.parse(原始json格式字符串)
 */
axios.defaults.transformResponse = [function (data) {
  // console.log('transformResponse => ', data)
  // return data

  // 这里使用 JSONbig.parse 转换原始数据
  // 类似于 JSON.parse
  // 但是它会处理其中超出安全整数范围的整数问题。
  // 严谨一点，如果 data 不是 json 格式字符串就会报错
  try {
    // 如果是 json 格式字符串，那就转换并返回给后续使用
    return JSONbig.parse(data)
  } catch (err) {
    // 报错就意味着 data 不是 json 格式字符串，这里就直接原样返回给后续使用
    return data
  }
}]

/**
 * Axios 请求拦截器：axios 发出去的请求会先经过这里
 */

axios.interceptors.request.use(function (config) {
  const user = getUser()

  // return config 是允许请求发送的开关
  // 如果有 user 数据，则往本次请求中添加用户 token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // config 是本次请求相关的配置对象
  return config
}, error => {
  // 返回一个理解 reject 失败的 Promise
  //  这里抛出异常是为了能让你后续 Promise 调用能正确的收到这里的异常
  return Promise.reject(error)
})

/**
 * Axios 响应拦截器: axios 收到的响应会先经过这里
 */

axios.interceptors.response.use(response => { // >= 200 && <400 的状态码会进入这里
  // response 就是响应结果对象
  // 这里将 response 鸳鸯返回，那么你发请求的地方就是 response
  // 我们可以控制请求收到的响应数据格式
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => { // >=400 的状态码会进入这里
  // 如果用户 token 无效, 让其跳转到登录页面
  if (error.response.status === 401) {
    // 清除本地存储中无效 token 的用户信息
    removeUser()
    // 跳转到用户登录页面
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})

Vue.use(ElementUI)

// 所有组件都是 Vue 实例
// 我们可以把一些需要在组件中频繁使用的成员放到 Vue.prototype 中
// Vue.prototype.foo = 'bar'

// 给 Vue 原型扩展成员的时候，最好加上一个 $ 前缀，避免和组件内部的成员产生冲突
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store, // 将 store 配置到 Vue 根实例中，然后所有组件就可以通过 this.$store 来访问容器中的数据了
  render: h => h(App)
}).$mount('#app')
