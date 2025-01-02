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
        placeholder="请选择标签"
      >
        <el-option
          v-for="tag in tagStore.tags"
          :key="tag.id"
          :label="tag.name"
          :value="tag.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="封面图" prop="cover">
      <upload-image v-model="formData.cover" />
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
      emit('submit', formData)
    }
  })
}

// 保存草稿
const handleSaveDraft = async () => {
  emit('save-draft', formData)
}

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    tagStore.fetchTags()
  ])
})
</script>