<template>
  <div class="upload-image">
    <el-upload
      class="image-uploader"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :http-request="customUpload"
    >
      <img v-if="modelValue" :src="modelValue" class="preview" />
      <el-icon v-else class="upload-icon"><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

// 上传前验证
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 自定义上传
const customUpload = async ({ file }) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const { url } = await request.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    emit('update:modelValue', url)
    ElMessage.success('上传成功')
  } catch (error) {
    ElMessage.error('上传失败')
  }
}
</script>

<style lang="scss" scoped>
.upload-image {
  .image-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
    
    &:hover {
      border-color: var(--el-color-primary);
    }
    
    .preview {
      width: 178px;
      height: 178px;
      display: block;
      object-fit: cover;
    }
    
    .upload-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
      line-height: 178px;
    }
  }
}
</style> 