<template>
  <div class="comment-list">
    <page-header title="评论管理" />

    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" class="search-form">
        <el-form-item label="文章标题">
          <el-input
            v-model="searchForm.postTitle"
            placeholder="搜索文章标题"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="评论者">
          <el-input
            v-model="searchForm.author"
            placeholder="搜索评论者"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 评论列表 -->
      <el-table
        v-loading="commentStore.loading"
        :data="commentStore.comments"
        style="width: 100%"
      >
        <el-table-column prop="content" label="评论内容" show-overflow-tooltip>
          <template #default="{ row }">
            <el-button text @click="showCommentDetail(row)">
              {{ row.content }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="post.title" label="文章" width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link @click="$router.push(`/posts/edit/${row.postId}`)">
              {{ row.post.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="评论者" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="评论时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                v-if="row.status === 'pending'"
                size="small"
                type="success"
                @click="handleUpdateStatus(row.id, 'approved')"
              >
                通过
              </el-button>
              <el-button
                v-if="row.status === 'pending'"
                size="small"
                type="warning"
                @click="handleUpdateStatus(row.id, 'rejected')"
              >
                拒绝
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
          :total="commentStore.total"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 评论详情对话框 -->
    <comment-detail-dialog
      v-model="detailDialogVisible"
      :comment="currentComment"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useCommentStore } from '@/stores/comment'
import CommentDetailDialog from './components/CommentDetailDialog.vue'

const commentStore = useCommentStore()
const detailDialogVisible = ref(false)
const currentComment = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)

const searchForm = reactive({
  postTitle: '',
  author: '',
  status: ''
})

// 获取评论列表
const fetchComments = () => {
  commentStore.fetchComments({
    page: currentPage.value,
    pageSize: pageSize.value,
    ...searchForm
  })
}

// 显示评论详情
const showCommentDetail = (comment) => {
  currentComment.value = comment
  detailDialogVisible.value = true
}

// 处理状态更新
const handleUpdateStatus = async (id, status) => {
  try {
    await commentStore.updateCommentStatus(id, status)
    ElMessage.success('操作成功')
    fetchComments()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 处理删除
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
      type: 'warning'
    })
    await commentStore.deleteComment(id)
    ElMessage.success('删除成功')
    fetchComments()
  } catch {
    // 用户取消删除或删除失败
  }
}

// 获取状态类型
const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return texts[status] || status
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchComments()
}

// 重置搜索
const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  handleSearch()
}

// 处理分页变化
const handlePageChange = () => {
  fetchComments()
}

// 初始化
fetchComments()
</script>

<style lang="scss" scoped>
.comment-list {
  .search-form {
    margin-bottom: 20px;
  }
  
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>