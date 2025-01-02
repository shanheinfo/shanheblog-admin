<template>
  <div class="user-list">
    <page-header title="用户管理" />

    <el-card>
      <el-table v-loading="userStore.loading" :data="userStore.users">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'info'">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'warning'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginAt" label="最后登录" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                size="small"
                @click="showEditDialog(row)"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                :type="row.status === 'active' ? 'warning' : 'success'"
                @click="handleUpdateStatus(row)"
              >
                {{ row.status === 'active' ? '禁用' : '启用' }}
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="userStore.total"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <user-form-dialog
      v-model="dialogVisible"
      :user="currentUser"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessageBox, ElMessage } from 'element-plus'
import PageHeader from '@/components/common/PageHeader.vue'
import UserFormDialog from './components/UserFormDialog.vue'

const userStore = useUserStore()
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const currentUser = ref(null)

const loadUsers = () => {
  userStore.fetchUsers({
    page: currentPage.value,
    pageSize: pageSize.value
  })
}

const handlePageChange = () => {
  loadUsers()
}

const showEditDialog = (user) => {
  currentUser.value = user
  dialogVisible.value = true
}

const handleEditSuccess = () => {
  dialogVisible.value = false
  loadUsers()
  ElMessage.success('更新成功')
}

const handleUpdateStatus = async (user) => {
  const newStatus = user.status === 'active' ? 'disabled' : 'active'
  const actionText = newStatus === 'active' ? '启用' : '禁用'
  
  try {
    await ElMessageBox.confirm(`确定要${actionText}该用户吗？`, '提示', {
      type: 'warning'
    })
    await userStore.updateStatus(user.id, newStatus)
    ElMessage.success(`${actionText}成功`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`${actionText}失败`)
    }
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style lang="scss" scoped>
.user-list {
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>