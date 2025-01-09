import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const authStore = useAuthStore()
    // 如果有token则添加到请求头
    if (authStore.token) {
      // console.log('Current token:', authStore.token)  // 调试用
      config.headers['Authorization'] = `${authStore.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)


// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const { response } = error

    // 添加详细的错误日志
    console.log('Request URL:', error.config.url)
    console.log('Response status:', response?.status)
    console.log('Response data:', response?.data)

    // 使用 409 状态码处理未登录情况
    if (response?.status === 409) {
      const authStore = useAuthStore()
      // authStore.logout()
      // window.location.href = '/login'
      return Promise.reject(new Error('未登录或登录过期'))
    }

    // 其他错误正常提示
    ElMessage.error(response?.data?.message || '请求失败')
    return Promise.reject(error)
  }
)

export default request
