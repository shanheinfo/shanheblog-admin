import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'

export const useCommentStore = defineStore('comment', () => {
  const comments = ref([])
  const total = ref(0)
  const loading = ref(false)

  // 获取评论列表
  const fetchComments = async (params) => {
    loading.value = true
    try {
      const data = await request.get('/comments', { params })
      comments.value = data.items
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  // 更新评论状态
  const updateCommentStatus = async (id, status) => {
    try {
      return await request.patch(`/comments/${id}/status`, { status })
    } catch (error) {
      throw error
    }
  }

  // 删除评论
  const deleteComment = async (id) => {
    try {
      await request.delete(`/comments/${id}`)
    } catch (error) {
      throw error
    }
  }

  return {
    comments,
    total,
    loading,
    fetchComments,
    updateCommentStatus,
    deleteComment
  }
})