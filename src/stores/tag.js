import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'

export const useTagStore = defineStore('tag', () => {
  const tags = ref([])
  const total = ref(0)
  const loading = ref(false)

  // 获取标签列表
  const fetchTags = async (params) => {
    loading.value = true
    try {
      const data = await request.get('/tags', { params })
      tags.value = data.items
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  // 创建标签
  const createTag = async (tagData) => {
    try {
      return await request.post('/tags', tagData)
    } catch (error) {
      throw error
    }
  }

  // 更新标签
  const updateTag = async (id, tagData) => {
    try {
      return await request.put(`/tags/${id}`, tagData)
    } catch (error) {
      throw error
    }
  }

  // 删除标签
  const deleteTag = async (id) => {
    try {
      await request.delete(`/tags/${id}`)
    } catch (error) {
      throw error
    }
  }

  return {
    tags,
    total,
    loading,
    fetchTags,
    createTag,
    updateTag,
    deleteTag
  }
})