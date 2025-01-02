<template>
  <div class="post-edit">
    <page-header :title="isEdit ? '编辑文章' : '新建文章'">
      <template #actions>
        <el-button @click="$router.back()">返回</el-button>
      </template>
    </page-header>

    <el-card>
      <post-form
        ref="formRef"
        :initial-data="postData"
        @submit="handleSubmit"
        @save-draft="handleSaveDraft"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { ElMessage } from 'element-plus'
import PostForm from '@/components/post/PostForm.vue'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()

const formRef = ref(null)
const postData = ref({})
const isEdit = computed(() => !!route.params.id)

// 获取文章详情
const fetchPost = async () => {
  if (!route.params.id) return
  try {
    const data = await postStore.fetchPost(route.params.id)
    postData.value = data
  } catch (error) {
    ElMessage.error('获取文章失败')
    router.push('/posts')
  }
}

// 提交表单
const handleSubmit = async (formData) => {
  try {
    if (isEdit.value) {
      await postStore.updatePost(route.params.id, { ...formData, status: 'published' })
      ElMessage.success('更新成功')
    } else {
      await postStore.createPost({ ...formData, status: 'published' })
      ElMessage.success('发布成功')
    }
    router.push('/posts')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 保存草稿
const handleSaveDraft = async (formData) => {
  try {
    if (isEdit.value) {
      await postStore.updatePost(route.params.id, { ...formData, status: 'draft' })
    } else {
      await postStore.createPost({ ...formData, status: 'draft' })
    }
    ElMessage.success('保存草稿成功')
    router.push('/posts')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  fetchPost()
})
</script>
</script>`