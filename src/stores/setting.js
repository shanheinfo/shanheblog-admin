import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'

export const useSettingStore = defineStore('setting', () => {
  const settings = ref({})
  const loading = ref(false)

  const fetchSettings = async () => {
    loading.value = true
    try {
      const data = await request.get('/settings')
      settings.value = data
    } finally {
      loading.value = false
    }
  }

  const updateSettings = async (settingData) => {
    try {
      await request.put('/settings', settingData)
      await fetchSettings()
    } catch (error) {
      throw error
    }
  }

  return {
    settings,
    loading,
    fetchSettings,
    updateSettings
  }
}) 