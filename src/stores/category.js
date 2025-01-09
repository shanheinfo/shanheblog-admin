import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])
  const total = ref(0)
  const loading = ref(false)

  // 获取分类列表
  const fetchCategories = async (params = {}) => {
    loading.value = true
    try {
      const { data } = await request.get('/admin/categories', { 
        params: {
          page: Number(params.page || 1),
          size: Number(params.pageSize || 10)
        }
      })
      categories.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  // 创建分类
  const createCategory = async (categoryData) => {
    try {
      return await request.post('/admin/categories', categoryData)
    } catch (error) {
      throw error
    }
  }

  // 更新分类
  const updateCategory = async (id, categoryData) => {
    try {
      return await request.put(`/admin/categories/${id}`, categoryData)
    } catch (error) {
      throw error
    }
  }

  // 删除分类
  const deleteCategory = async (id) => {
    try {
      await request.delete(`/admin/categories/${id}`)
    } catch (error) {
      throw error
    }
  }

  return {
    categories,
    total,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
})