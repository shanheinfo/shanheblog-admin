import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import request from '../utils/request'

export const useCaptchaStore = defineStore('captcha', () => {
  const captchaId = ref('')
  const captchaData = reactive({
    image: '',
    thumb: '',
    thumbX: 0,
    thumbY: 0,
    thumbWidth: 0,
    thumbHeight: 0
  })

  // 获取验证码
  const getCaptcha = async () => {
    try {
      const res = await request.get('/public/captcha')
      console.log('背景图:')  // 调试用
      if (res.code === 200) {
        console.log('背景图:', res.data.image_base64)  // 调试用
        console.log('滑块图:', res.data.tile_base64)   // 调试用
        
        captchaId.value = res.data.captcha_key
        // 确保完整保存 base64 字符串,包括 data:image/png;base64, 前缀
        captchaData.image = res.data.image_base64
        captchaData.thumb = res.data.tile_base64
        captchaData.thumbY = res.data.tile_y
        captchaData.thumbWidth = res.data.tile_width
        captchaData.thumbHeight = res.data.tile_height
      }
      return res.data
    } catch (error) {
      throw error
    }
  }

  // 重置验证码状态
  const resetCaptcha = () => {
    captchaId.value = ''
    Object.assign(captchaData, {
      thumbX: 0,
      thumbY: 0,
      image: '',
      thumb: ''
    })
  }

  return {
    captchaId,
    captchaData,
    getCaptcha,
    resetCaptcha
  }
})
