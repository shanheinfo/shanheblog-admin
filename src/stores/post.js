import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'

export const usePostStore = defineStore('post', () => {
  const posts = ref([])
  const total = ref(0)
  const loading = ref(false)

  // 获取文章列表
  const fetchPosts = async (params) => {
    loading.value = true
    try {
      const data = await request.get('/posts', { params })
      posts.value = data.items
      total.value = data.total
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取文章详情
  const fetchPost = async (id) => {
    try {
      return await request.get(`/posts/${id}`)
    } catch (error) {
      throw error
    }
  }

  // 创建文章
  const createPost = async (postData) => {
    try {
      return await request.post('/posts', postData)
    } catch (error) {
      throw error
    }
  }

  // 更新文章
  const updatePost = async (id, postData) => {
    try {
      return await request.put(`/posts/${id}`, postData)
    } catch (error) {
      throw error
    }
  }

  // 删除文章
  const deletePost = async (id) => {
    try {
      await request.delete(`/posts/${id}`)
      await fetchPosts()
    } catch (error) {
      throw error
    }
  }

  return {
    posts,
    total,
    loading,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost
  }
})