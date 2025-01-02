import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'

export const useUserStore = defineStore('user', () => {
  const users = ref([])
  const total = ref(0)
  const loading = ref(false)

  const fetchUsers = async (params) => {
    loading.value = true
    try {
      const data = await request.get('/users', { params })
      users.value = data.items
      total.value = data.total
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id, userData) => {
    try {
      await request.put(`/users/${id}`, userData)
      await fetchUsers()
    } catch (error) {
      throw error
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await request.patch(`/users/${id}/status`, { status })
      await fetchUsers()
    } catch (error) {
      throw error
    }
  }

  return {
    users,
    total,
    loading,
    fetchUsers,
    updateUser,
    updateStatus
  }
})