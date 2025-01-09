<template>
  <el-table :data="posts" style="width: 100%" size="small">
    <el-table-column prop="title" label="文章标题">
      <template #default="{ row }">
        <router-link 
          :to="{ name: 'article-edit', params: { id: row.id }}" 
          class="link-text"
        >
          {{ row.title }}
        </router-link>
      </template>
    </el-table-column>
    <el-table-column prop="created_at" label="发布时间" width="180">
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
  posts: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.link-text {
  color: #409EFF;
  text-decoration: none;
}

.link-text:hover {
  text-decoration: underline;
}
</style> 