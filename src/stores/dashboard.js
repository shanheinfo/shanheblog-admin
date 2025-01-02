import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'

export const useDashboardStore = defineStore('dashboard', () => {
  const loading = ref(false)
  const stats = ref({
    postCount: 0,
    commentCount: 0,
    viewCount: 0,
    userCount: 0
  })
  const trendData = ref([])
  const categoryData = ref([])
  const latestPosts = ref([])
  const latestComments = ref([])

  // 获取统计数据
  const fetchStats = async () => {
    loading.value = true
    try {
      const data = await request.get('/dashboard/stats')
      stats.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  // 获取趋势数据
  const fetchTrend = async (range = 'week') => {
    try {
      const data = await request.get('/dashboard/trend', { params: { range } })
      trendData.value = data
      return data
    } catch (error) {
      throw error
    }
  }

  // 获取分类统计
  const fetchCategoryStats = async () => {
    try {
      const data = await request.get('/dashboard/categories')
      categoryData.value = data
      return data
    } catch (error) {
      throw error
    }
  }

  // 获取最新文章
  const fetchLatestPosts = async () => {
    try {
      const data = await request.get('/dashboard/latest-posts')
      latestPosts.value = data
      return data
    } catch (error) {
      throw error
    }
  }

  // 获取最新评论
  const fetchLatestComments = async () => {
    try {
      const data = await request.get('/dashboard/latest-comments')
      latestComments.value = data
      return data
    } catch (error) {
      throw error
    }
  }

  return {
    loading,
    stats,
    trendData,
    categoryData,
    latestPosts,
    latestComments,
    fetchStats,
    fetchTrend,
    fetchCategoryStats,
    fetchLatestPosts,
    fetchLatestComments
  }
}) 