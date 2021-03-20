//封装插件
import axios from 'axios'

const MyHttpServer = {} 

MyHttpServer.install = (Vue) => {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  //添加请求拦截器
  axios.interceptors.request.use(function (config) {
      // const AUTH_TOKEN = localStorage.getItem("token");
      // axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
    config.headers.Authorization = localStorage.getItem('token')
    return config
  }, function (error) {
    return Promise.reject(error)
  })
  //添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpServer