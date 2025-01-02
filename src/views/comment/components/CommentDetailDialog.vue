<template>
  <el-dialog
    title="评论详情"
    v-model="visible"
    width="600px"
  >
    <div class="comment-detail">
      <div class="info-item">
        <label>评论者：</label>
        <span>{{ comment?.author }}</span>
      </div>
      <div class="info-item">
        <label>邮箱：</label>
        <span>{{ comment?.email }}</span>
      </div>
      <div class="info-item">
        <label>IP地址：</label>
        <span>{{ comment?.ip }}</span>
      </div>
      <div class="info-item">
        <label>评论时间：</label>
        <span>{{ comment?.createdAt }}</span>
      </div>
      <div class="info-item">
        <label>文章：</label>
        <el-link @click="$router.push(`/posts/edit/${comment?.postId}`)">
          {{ comment?.post.title }}
        </el-link>
      </div>
      <div class="content-box">
        <label>评论内容：</label>
        <div class="content">{{ comment?.content }}</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  comment: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style lang="scss" scoped>
.comment-detail {
  .info-item {
    margin-bottom: 16px;
    
    label {
      color: #606266;
      margin-right: 8px;
    }
  }
  
  .content-box {
    label {
      color: #606266;
      display: block;
      margin-bottom: 8px;
    }
    
    .content {
      background-color: #f5f7fa;
      padding: 16px;
      border-radius: 4px;
      line-height: 1.6;
    }
  }
}
</style> 