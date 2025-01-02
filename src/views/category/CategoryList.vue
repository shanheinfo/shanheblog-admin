<template>
  <div class="category-list">
    <page-header title="分类管理">
      <template #actions>
        <el-button type="primary" @click="showDialog()">
          新建分类
        </el-button>
      </template>
    </page-header>

    <el-card>
      <el-table
        v-loading="categoryStore.loading"
        :data="categoryStore.categories"
        style="width: 100%"
      >
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="slug" label="别名" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="postCount" label="文章数量" width="100" align="center" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                size="small"
                @click="showDialog(row)"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(row.id)"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="categoryStore.total"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 分类表单对话框 -->
    <category-form-dialog
      v-model="dialogVisible"
      :category="currentCategory"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useCategoryStore } from '@/stores/category'
import CategoryFormDialog from './components/CategoryFormDialog.vue'

const categoryStore = useCategoryStore()
const dialogVisible = ref(false)
const currentCategory = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)

// 获取分类列表
const fetchCategories = () => {
  categoryStore.fetchCategories({
    page: currentPage.value,
    pageSize: pageSize.value
  })
}

// 显示表单对话框
const showDialog = (category = null) => {
  currentCategory.value = category
  dialogVisible.value = true
}

// 处理删除
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个分类吗？', '提示', {
      type: 'warning'
    })
    await categoryStore.deleteCategory(id)
    ElMessage.success('删除成功')
    fetchCategories()
  } catch (error) {
    // 用户取消删除或删除失败
  }
}

// 处理表单提交成功
const handleSuccess = () => {
  dialogVisible.value = false
  fetchCategories()
}

// 处理分页变化
const handlePageChange = () => {
  fetchCategories()
}

// 初始化
fetchCategories()
</script>

<style lang="scss" scoped>
.category-list {
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>