<template>
  <el-dialog
    title="编辑用户"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" disabled />
      </el-form-item>
      
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" />
      </el-form-item>
      
      <el-form-item label="角色" prop="role">
        <el-select v-model="formData.role">
          <el-option label="管理员" value="admin" />
          <el-option label="普通用户" value="user" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="$emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  modelValue: Boolean,
  user: Object
})

const emit = defineEmits(['update:modelValue', 'success'])
const userStore = useUserStore()
const formRef = ref(null)

const formData = reactive({
  username: '',
  email: '',
  role: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

watch(() => props.user, (newVal) => {
  if (newVal) {
    Object.assign(formData, newVal)
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await userStore.updateUser(props.user.id, formData)
        emit('success')
      } catch (error) {
        // Error is handled by the request interceptor
      }
    }
  })
}
</script>