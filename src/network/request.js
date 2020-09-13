import axios from 'axios'
export function request (config) {
  // 1.创建axios实例
  const instance = axios.create({
    baseURL: 'http://112.74.99.5:3000/web/api',
    timeout: 3000
  })
  // 2.1请求拦截
  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  })
  // 2.2响应拦截
  instance.interceptors.response.use(res => {
    return res
  })
  return instance(config)
}
