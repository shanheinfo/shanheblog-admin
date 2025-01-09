<template>
  <div>
    <h1>草稿管理</h1>
    <el-table :data="drafts" style="width: 100%">
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const postStore = usePostStore()
const drafts = ref([])

// 获取草稿列表
const fetchDrafts = async () => {
  try {
    const data = await postStore.fetchDrafts() // 修改: 直接调用 postStore 的 fetchDrafts 方法
    drafts.value = data.list
  } catch (error) {
    ElMessage.error('获取草稿列表失败')
  }
}

// 编辑草稿
const handleEdit = (id) => {
  router.push({ name: 'PostEdit', params: { id } })
}

// 删除草稿
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该草稿吗？', '提示', {
      type: 'warning'
    })
    await postStore.deleteDraft(id) // 修改: 直接调用 postStore 的 deleteDraft 方法
    ElMessage.success('草稿删除成功')
    fetchDrafts()
  } catch {
    // 用户取消操作
  }
}

onMounted(() => {
  fetchDrafts()
})
</script>

<style scoped>
/* ... existing code ... */
</style>