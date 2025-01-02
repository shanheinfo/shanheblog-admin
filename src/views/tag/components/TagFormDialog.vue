<template>
  <el-dialog
    :title="isEdit ? '编辑标签' : '新建标签'"
    v-model="visible"
    width="500px"
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入标签名称" />
      </el-form-item>
      
      <el-form-item label="别名" prop="slug">
        <el-input v-model="formData.slug" placeholder="请输入标签别名">
          <template #append>.html</template>
        </el-input>
      </el-form-item>
      
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入标签描述"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useTagStore } from '@/stores/tag'

const props = defineProps({
  modelValue: Boolean,
  tag: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])
const tagStore = useTagStore()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEdit = computed(() => !!props.tag)
const loading = ref(false)
const formRef = ref(null)

const formData = ref({
  name: '',
  slug: '',
  description: ''
})

const rules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  slug: [
    { required: true, message: '请输入标签别名', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: '只能包含小写字母、数字和横线', trigger: 'blur' }
  ]
}

// 监听编辑数据变化
watch(() => props.tag, (tag) => {
  if (tag) {
    formData.value = { ...tag }
  } else {
    formData.value = {
      name: '',
      slug: '',
      description: ''
    }
  }
})

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    if (isEdit.value) {
      await tagStore.updateTag(props.tag.id, formData.value)
      ElMessage.success('更新成功')
    } else {
      await tagStore.createTag(formData.value)
      ElMessage.success('创建成功')
    }
    
    emit('success')
  } catch {
    // 表单验证失败或请求失败
  } finally {
    loading.value = false
  }
}

// 对话框关闭时重置表单
const handleClosed = () => {
  formRef.value?.resetFields()
}
</script> 