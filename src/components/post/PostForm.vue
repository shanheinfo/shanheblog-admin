<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="100px"
  >
    <el-form-item label="标题" prop="title">
      <el-input v-model="formData.title" placeholder="请输入文章标题" />
    </el-form-item>

    <el-form-item label="分类" prop="categoryId">
      <el-select v-model="formData.categoryId" placeholder="请选择分类">
        <el-option
          v-for="category in categoryStore.categories"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="标签" prop="tags">
      <el-select
        v-model="formData.tags"
        multiple
        filterable
        allow-create
        default-first-option
        @change="handleTagChange"
        @keydown.enter.native="handleEnterKey"
        placeholder="请选择标签"
      >
        <el-option
          v-for="tag in tagStore.tags"
          :key="tag.id"
          :label="tag.name"
          :value="tag"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="封面图" prop="cover">
      <upload-image v-model="formData.cover" />
    </el-form-item>

    <el-form-item label="文件上传">
      <el-upload
        action="/admin/upload/file"
        :on-success="handleFileUploadSuccess"
        :before-upload="beforeFileUpload"
        :show-file-list="false"
      >
        <el-button type="primary">点击上传文件</el-button>
      </el-upload>
    </el-form-item>

    <el-form-item label="摘要" prop="summary">
      <el-input
        v-model="formData.summary"
        type="textarea"
        :rows="3"
        placeholder="请输入文章摘要"
      />
    </el-form-item>

    <el-form-item label="内容" prop="content">
      <md-editor
        v-model="formData.content"
        height="500px"
        :config="editorConfig"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">发布文章</el-button>
      <el-button @click="handleSaveDraft">保存草稿</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { MdEditor } from 'md-editor-v3'
import { useCategoryStore } from '@/stores/category'
import { useTagStore } from '@/stores/tag'
import UploadImage from '@/components/common/UploadImage.vue'
import { ElMessage } from 'element-plus'
import 'md-editor-v3/lib/style.css';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'save-draft'])
const categoryStore = useCategoryStore()
const tagStore = useTagStore()
const formRef = ref(null)

const formData = reactive({
  title: props.initialData.title || '',
  categoryId: props.initialData.categoryId || '',
  tags: props.initialData.tags || [],
  cover: props.initialData.cover || '',
  files: props.initialData.files || [],
  summary: props.initialData.summary || '',
  content: props.initialData.content || ''
})

const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ]
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', { ...formData, status: 'published' })
    }
  })
}

// 保存草稿
const handleSaveDraft = async () => {
  const draftData = {
    title: formData.title,
    slug: formData.slug,
    content: formData.content,
    category_id: formData.categoryId,
    tag_ids: formData.tags.map(tag => tag.id || tag),
    summary: formData.summary,
    cover: formData.cover,
    files: formData.files,
    status: 'draft'
  }

  try {
    await postStore.saveDraft(draftData)
    ElMessage.success('草稿保存成功')
  } catch (error) {
    ElMessage.error('草稿保存失败')
  }
}

// 图片上传处理
const handleImageUpload = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await request.post('/admin/upload/image', formData)
    return data.url
  } catch (error) {
    ElMessage.error('图片上传失败')
    return false
  }
}

// 文件上传成功处理
const handleFileUploadSuccess = (response, file, fileList) => {
  formData.files.push(response.data)
  ElMessage.success('文件上传成功')
}

// 文件上传前处理
const beforeFileUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('文件大小不能超过 2MB!')
  }
  return isLt2M
}

// 修改 md-editor 配置
const editorConfig = {
  upload: {
    handler: handleImageUpload
  }
}

// 标签变化处理
const handleTagChange = (tags) => {
  tags.forEach(async (tag) => {
    if (typeof tag === 'string') {
      // 如果是新创建的标签，先创建标签
      const newTag = await tagStore.createTag({ name: tag })
      formData.tags.push(newTag)
    }
  })
}

// 处理回车键事件
const handleEnterKey = async (event) => {
  const inputValue = event.target.value.trim()
  if (inputValue) {
    // 检查是否已经存在该标签
    const existingTag = tagStore.tags.find(tag => tag.name === inputValue)
    if (existingTag) {
      formData.tags.push(existingTag)
    } else {
      // 创建新标签
      const newTag = await tagStore.createTag({ name: inputValue })
      formData.tags.push(newTag)
    }
    // 清空输入框
    event.target.value = ''
  }
}

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    tagStore.fetchTags()
  ])
})
</script>