import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'
import { useCaptchaStore } from './captcha'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))
  const userInfo = ref(null)
  const captchaStore = useCaptchaStore()

  const login = async (credentials) => {
    try {
      const { data } = await request.post('/public/login', {
        username: credentials.username,
        password: credentials.password,
        captcha_Key: captchaStore.captchaId,
        point: credentials.point
      })
      
      token.value = data.token
      userInfo.value = data.user
      localStorage.setItem('token', data.token)

      return data
    } catch (error) {
      // 登录失败时重新获取验证码
      await captchaStore.getCaptcha()
      throw error
    }
  }

  const logout = async () => {
    try {
      await request.post('/admin/logout')
    } finally {
      // 无论请求是否成功，都清除本地存储
      token.value = null
      userInfo.value = null
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
    }
  }

  const getUserInfo = async () => {
    try {
      const { data } = await request.get('/admin/user')
      userInfo.value = data
      return data
    } catch (error) {
      throw error
    }
  }

  return {
    token,
    userInfo,
    login,
    logout,
    getUserInfo
  }
})
