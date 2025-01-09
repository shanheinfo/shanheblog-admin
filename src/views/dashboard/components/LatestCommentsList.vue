<template>
  <el-table :data="comments" style="width: 100%" size="small">
    <el-table-column prop="content" label="评论内容">
      <template #default="{ row }">
        <el-tooltip 
          :content="row.content" 
          placement="top" 
          :hide-after="2000"
          v-if="row.content.length > 30"
        >
          <span>{{ row.content.slice(0, 30) }}...</span>
        </el-tooltip>
        <span v-else>{{ row.content }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="nickname" label="评论者" width="120" />
    <el-table-column prop="created_at" label="评论时间" width="180">
      <template #default="{ row }">
        {{ formatDate(row.created_at) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { defineProps } from 'vue'
import { formatDate } from '@/utils/format'

defineProps({
  comments: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.comment-content {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 