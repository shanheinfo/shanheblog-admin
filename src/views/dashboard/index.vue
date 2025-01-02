<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <!-- 数据概览卡片 -->
      <el-col :span="6" v-for="card in statsCards" :key="card.title">
        <el-card shadow="hover" class="stats-card">
          <div class="card-content">
            <el-icon class="icon" :class="card.type">
              <component :is="card.icon" />
            </el-icon>
            <div class="info">
              <div class="title">{{ card.title }}</div>
              <div class="value">{{ card.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <!-- 文章趋势图 -->
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>文章发布趋势</span>
              <el-radio-group v-model="trendTimeRange" size="small">
                <el-radio-button label="week">最近一周</el-radio-button>
                <el-radio-button label="month">最近一月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <trend-chart :data="trendData" />
          </div>
        </el-card>
      </el-col>

      <!-- 分类统计图 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>文章分类统计</span>
            </div>
          </template>
          <div class="chart-container">
            <category-chart :data="categoryData" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="list-row">
      <!-- 最新文章 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最新文章</span>
              <el-button text @click="$router.push('/posts')">
                查看更多
              </el-button>
            </div>
          </template>
          <el-table :data="latestPosts" :show-header="false">
            <el-table-column prop="title" show-overflow-tooltip>
              <template #default="{ row }">
                <el-link @click="$router.push(`/posts/edit/${row.id}`)">
                  {{ row.title }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" width="180" align="right" />
          </el-table>
        </el-card>
      </el-col>

      <!-- 最新评论 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最新评论</span>
              <el-button text @click="$router.push('/comments')">
                查看更多
              </el-button>
            </div>
          </template>
          <el-table :data="latestComments" :show-header="false">
            <el-table-column prop="content" show-overflow-tooltip>
              <template #default="{ row }">
                <div class="comment-item">
                  <span class="author">{{ row.author }}：</span>
                  <span class="content">{{ row.content }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" width="180" align="right" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Document, ChatDotRound, View, User } from '@element-plus/icons-vue'
import TrendChart from './components/TrendChart.vue'
import CategoryChart from './components/CategoryChart.vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const trendTimeRange = ref('week')

// 数据概览卡片
const statsCards = ref([
  { title: '文章总数', value: 0, icon: Document, type: 'primary' },
  { title: '评论总数', value: 0, icon: ChatDotRound, type: 'success' },
  { title: '浏览总数', value: 0, icon: View, type: 'warning' },
  { title: '用户总数', value: 0, icon: User, type: 'danger' }
])

// 获取仪表盘数据
const fetchDashboardData = async () => {
  const data = await dashboardStore.fetchStats()
  statsCards.value[0].value = data.postCount
  statsCards.value[1].value = data.commentCount
  statsCards.value[2].value = data.viewCount
  statsCards.value[3].value = data.userCount
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style lang="scss" scoped>
.dashboard {
  .stats-card {
    margin-bottom: 20px;
    
    .card-content {
      display: flex;
      align-items: center;
      
      .icon {
        font-size: 48px;
        margin-right: 20px;
        
        &.primary { color: var(--el-color-primary); }
        &.success { color: var(--el-color-success); }
        &.warning { color: var(--el-color-warning); }
        &.danger { color: var(--el-color-danger); }
      }
      
      .info {
        .title {
          font-size: 14px;
          color: #909399;
        }
        
        .value {
          font-size: 24px;
          font-weight: bold;
          margin-top: 4px;
        }
      }
    }
  }

  .charts-row {
    margin-bottom: 20px;
    
    .chart-card {
      height: 400px;
      
      .chart-container {
        height: 340px;
      }
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .comment-item {
    .author {
      color: #409eff;
      margin-right: 8px;
    }
    
    .content {
      color: #606266;
    }
  }
}
</style> 