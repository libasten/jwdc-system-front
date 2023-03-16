import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import $router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 1) {
      // 后台约定，等于0的时候，表示没有权限
      if (res.status === 0) {
        return Promise.reject(res.info)
      }
      Message({
        message: res.info || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.info || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log(error.response) // for debug
    //登录过期
    if (error.response.status == 401) {
      Message({
        message: '登录已过期，请重新登录！',
        type: 'warning',
        duration: 5 * 1000
      })
      removeToken()
      // 这里之所以要清除token，是因为下在src/permission.js中判断hasToken就会直接跳转到起始页，会再次执行获取概览和提醒的方法，多次弹窗。
      store.dispatch('user/logout')
      $router.push({ path: '/login' })
      // return Promise.reject(error)
    }
    else {
      // Message({
      //   message: error.message,
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      return Promise.reject(error)
    }
  }
)

export default service
