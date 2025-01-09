import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'

export const useDashboardStore = defineStore('dashboard', () => {
  const loading = ref(false)
  const stats = ref({
    articleCount: 0,
    commentCount: 0,
    userCount: 0,
    pageViewCount: 0
  })
  const trendData = ref([])
  const categoryData = ref([])
  const latestPosts = ref([])
  const latestComments = ref([])

  // 获取统计数据
  const fetchStats = async () => {
    loading.value = true
    try {
      const { data } = await request.get('/admin/dashboard/stats')
      stats.value = {
        articleCount: data.article_count,
        commentCount: data.comment_count,
        userCount: data.user_count,
        pageViewCount: data.page_view_count
      }
      return data
    } finally {
      loading.value = false
    }
  }

  // 获取趋势数据
  const fetchTrend = async (period = 'week') => {
    try {
      const { data } = await request.get('/admin/dashboard/trend', { 
        params: { period } 
      })
      trendData.value = data.map(item => ({
        date: item.date,
        articleCount: item.article_count,
        commentCount: item.comment_count,
        viewCount: item.view_count
      }))
      return data
    } catch (error) {
      throw error
    }
  }

  // 获取分类统计
  const fetchCategoryStats = async () => {
    try {
      const data = await request.get('/admin/dashboard/categories')
      categoryData.value = data
      return data
    } catch (error) {
      throw error
    }
  }

  // 获取最新文章
  const fetchLatestPosts = async () => {
    try {
      const data = await request.get('/admin/dashboard/latest-posts')
      latestPosts.value = data
      return data
    } catch (error) {
      throw error
    }
  }

  // 获取最新评论
  const fetchLatestComments = async () => {
    try {
      const data = await request.get('/admin/dashboard/latest-comments')
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