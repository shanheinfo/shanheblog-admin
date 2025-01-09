import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'

export const usePostStore = defineStore('post', () => {
  const posts = ref([])
  const total = ref(0)
  const loading = ref(false)

  // 获取文章列表
  const fetchPosts = async (params = {}) => {
    loading.value = true
    try {
      const { data } = await request.get('/admin/articles', { 
        params: {
          page: Number(params.page || 1),
          size: Number(params.pageSize || 10),
          keyword: params.title || undefined,
          category_id: params.categoryId || undefined,
          tag_id: params.tagId || undefined,
          status: params.status || undefined,
          is_original: params.isOriginal,
          is_top: params.isTop,
          is_recommend: params.isRecommend,
          is_visible: params.isVisible
        }
      })
      posts.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  // 创建文章
  const createPost = async (postData) => {
    try {
      const { data } = await request.post('/admin/articles', {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        category_id: postData.categoryId,
        tag_ids: postData.tags.map(tag => tag.id || tag), // 支持直接创建的标签
        status: postData.status,
        is_top: postData.isTop,
        file_id: postData.fileId,        // 封面图文件ID
        is_original: postData.isOriginal,
        is_recommend: postData.isRecommend,
        is_visible: postData.isVisible
      })
      return data
    } catch (error) {
      throw error
    }
  }

  // 更新文章
  const updatePost = async (id, postData) => {
    try {
      const { data } = await request.put(`/admin/articles/${id}`, {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        category_id: postData.categoryId,
        tag_ids: postData.tags.map(tag => tag.id || tag), // 支持直接创建的标签
        status: postData.status,
        is_top: postData.isTop,
        file_id: postData.fileId,
        is_original: postData.isOriginal,
        is_recommend: postData.isRecommend,
        is_visible: postData.isVisible
      })
      return data
    } catch (error) {
      throw error
    }
  }

  // 获取文章详情
  const fetchPost = async (id) => {
    try {
      const { data } = await request.get(`/admin/articles/${id}`)
      return {
        ...data,
        categoryId: data.Category?.id,
        tags: data.Tags?.map(tag => ({ id: tag.id, name: tag.name })) || [], // 标签处理
        fileId: data.file_id,
        isTop: data.is_top,
        isOriginal: data.is_original,
        isRecommend: data.is_recommend,
        isVisible: data.is_visible
      }
    } catch (error) {
      throw error
    }
  }

  // 删除文章
  const deletePost = async (id) => {
    try {
      await request.delete(`/admin/articles/${id}`)
    } catch (error) {
      throw error
    }
  }

  // 保存草稿
  const saveDraft = async (draftData) => {
    try {
      const { data } = await request.post('/admin/drafts', draftData)
      return data
    } catch (error) {
      throw error
    }
  }

  // 获取草稿列表
  const fetchDrafts = async (params = {}) => {
    try {
      const { data } = await request.get('/admin/drafts', { params })
      return data
    } catch (error) {
      throw error
    }
  }

  // 获取草稿详情
  const fetchDraft = async (id) => {
    try {
      const { data } = await request.get(`/admin/drafts/${id}`)
      return data
    } catch (error) {
      throw error
    }
  }

  // 更新草稿
  const updateDraft = async (id, draftData) => {
    try {
      const { data } = await request.put(`/admin/drafts/${id}`, draftData)
      return data
    } catch (error) {
      throw error
    }
  }

  // 删除草稿
  const deleteDraft = async (id) => {
    try {
      await request.delete(`/admin/drafts/${id}`)
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
    deletePost,
    saveDraft,
    fetchDrafts,
    fetchDraft,
    updateDraft,
    deleteDraft
  }
})