<template>
  <div class="tag-list">
    <page-header title="标签管理">
      <template #actions>
        <el-button type="primary" @click="showDialog()">
          新建标签
        </el-button>
      </template>
    </page-header>

    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" class="search-form">
        <el-form-item label="标签名">
          <el-input
            v-model="searchForm.name"
            placeholder="搜索标签名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 标签列表 -->
      <el-table
        v-loading="tagStore.loading"
        :data="tagStore.tags"
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

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="tagStore.total"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 标签表单对话框 -->
    <tag-form-dialog
      v-model="dialogVisible"
      :tag="currentTag"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useTagStore } from '@/stores/tag'
import TagFormDialog from './components/TagFormDialog.vue'

const tagStore = useTagStore()
const dialogVisible = ref(false)
const currentTag = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)

const searchForm = reactive({
  name: ''
})

// 获取标签列表
const fetchTags = () => {
  tagStore.fetchTags({
    page: currentPage.value,
    pageSize: pageSize.value,
    name: searchForm.name
  })
}

// 显示表单对话框
const showDialog = (tag = null) => {
  currentTag.value = tag
  dialogVisible.value = true
}

// 处理删除
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个标签吗？', '提示', {
      type: 'warning'
    })
    await tagStore.deleteTag(id)
    ElMessage.success('删除成功')
    fetchTags()
  } catch {
    // 用户取消删除或删除失败
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchTags()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  handleSearch()
}

// 处理表单提交成功
const handleSuccess = () => {
  dialogVisible.value = false
  fetchTags()
}

// 处理分页变化
const handlePageChange = () => {
  fetchTags()
}

// 初始化
fetchTags()
</script>

<style lang="scss" scoped>
.tag-list {
  .search-form {
    margin-bottom: 20px;
  }
  
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>