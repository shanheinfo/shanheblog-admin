<template>
  <div class="dashboard">
    <!-- 统计卡片部分 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in statsCards" :key="index">
        <el-card shadow="hover">
          <div class="stats-card">
            <div class="value">{{ stats[item.key] }}</div>
            <div class="label">{{ item.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 趋势图部分 -->
    <el-card class="trend-section">
      <template #header>
        <div class="card-header">
          <span>数据趋势</span>
          <el-radio-group v-model="timeRange" @change="handleTimeRangeChange">
            <el-radio-button label="week">最近7天</el-radio-button>
            <el-radio-button label="month">最近30天</el-radio-button>
            <el-radio-button label="year">最近一年</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <TrendChart :data="trendData" />
    </el-card>

    <!-- 分类统计和最新数据部分 -->
    <el-row :gutter="20" class="mt-4">
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>分类统计</span>
            </div>
          </template>
          <CategoryChart :data="categoryData" />
        </el-card>
      </el-col>
      
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最新动态</span>
            </div>
          </template>
          <!-- 最新文章和评论列表 -->
          <el-tabs>
            <el-tab-pane label="最新文章">
              <latest-posts-list :posts="latestPosts" />
            </el-tab-pane>
            <el-tab-pane label="最新评论">
              <latest-comments-list :comments="latestComments" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import TrendChart from './components/TrendChart.vue'
import CategoryChart from './components/CategoryChart.vue'
import LatestPostsList from './components/LatestPostsList.vue'
import LatestCommentsList from './components/LatestCommentsList.vue'

const dashboardStore = useDashboardStore()
const timeRange = ref('week')

const statsCards = [
  { label: '文章数量', key: 'articleCount' },
  { label: '评论数量', key: 'commentCount' },
  { label: '用户数量', key: 'userCount' },
  { label: '总访问量', key: 'pageViewCount' }
]

const handleTimeRangeChange = async (value) => {
  await dashboardStore.fetchTrend(value)
}

// 从 store 中获取响应式数据
const { stats, trendData, categoryData, latestPosts, latestComments } = dashboardStore

onMounted(async () => {
  await Promise.all([
    dashboardStore.fetchStats(),
    dashboardStore.fetchTrend(timeRange.value),
    dashboardStore.fetchCategoryStats(),
    dashboardStore.fetchLatestPosts(),
    dashboardStore.fetchLatestComments()
  ])
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats-card {
  text-align: center;
}

.stats-card .value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stats-card .label {
  color: #666;
}

.trend-section {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-4 {
  margin-top: 20px;
}
</style> 