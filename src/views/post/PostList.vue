<template>
  <div class="post-list">
    <page-header title="文章管理">
      <template #actions>
        <el-button type="primary" @click="$router.push('/posts/create')">
          写文章
        </el-button>
      </template>
    </page-header>

    <el-card>
      <!-- 搜索过滤 -->
      <el-form :inline="true" class="search-form">
        <el-form-item label="标题">
          <el-input v-model="searchForm.title" placeholder="搜索文章标题" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" placeholder="选择分类">
            <el-option
              v-for="category in categoryStore.categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态">
            <el-option label="全部" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 文章列表 -->
      <el-table v-loading="postStore.loading" :data="postStore.posts">
        <el-table-column prop="title" label="标题" show-overflow-tooltip />
        <el-table-column prop="category.name" label="分类" width="120" />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" @click="handlePreview(row)">
                预览
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="$router.push(`/posts/edit/${row.id}`)"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(row)"
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
          :total="postStore.total"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="文章预览"
      width="800px"
    >
      <div v-if="currentPost" class="preview-content">
        <h1>{{ currentPost.title }}</h1>
        <div v-html="currentPost.content" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { usePostStore } from '@/stores/post'
import { useCategoryStore } from '@/stores/category'
import { ElMessageBox } from 'element-plus'

const postStore = usePostStore()
const categoryStore = useCategoryStore()

// 搜索表单
const searchForm = reactive({
  title: '',
  categoryId: '',
  status: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 预览
const previewVisible = ref(false)
const currentPost = ref(null)

// 初始化
onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    fetchPosts()
  ])
})

// 获取文章列表
const fetchPosts = () => {
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value,
    ...searchForm
  }
  return postStore.fetchPosts(params)
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchPosts()
}

// 重置搜索
const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  handleSearch()
}

// 分页变化
const handlePageChange = () => {
  fetchPosts()
}

// 预览文章
const handlePreview = (post) => {
  currentPost.value = post
  previewVisible.value = true
}

// 删除文章
const handleDelete = async (post) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
      type: 'warning'
    })
    await postStore.deletePost(post.id)
    ElMessage.success('删除成功')
  } catch (error) {
    // 用户取消删除或删除失败
  }
}
</script>

<style lang="scss" scoped>
.post-list {
  .search-form {
    margin-bottom: 20px;
  }
  
  .pagination {
    margin-top: 20px;
    text-align: right;
  }

  .preview-content {
    padding: 20px;
    
    h1 {
      margin-bottom: 20px;
      text-align: center;
    }
  }
}
</style>