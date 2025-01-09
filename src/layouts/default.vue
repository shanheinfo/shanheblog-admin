<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="logo">
        <img src="@/assets/logo.png" alt="logo">
        <span v-show="!isCollapsed">博客管理系统</span>
      </div>
      
      <el-menu
        :default-active="route.path"
        :collapse="isCollapsed"
        router
      >
        <el-menu-item index="/">
          <el-icon><Monitor /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        
        <el-sub-menu index="/posts">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>文章管理</span>
          </template>
          <el-menu-item index="/posts">文章列表</el-menu-item>
          <el-menu-item index="/posts/create">写文章</el-menu-item>
          <el-menu-item index="/drafts">草稿管理</el-menu-item>
        </el-sub-menu>
        
        <el-menu-item index="/categories">
          <el-icon><Files /></el-icon>
          <template #title>分类管理</template>
        </el-menu-item>
        
        <el-menu-item index="/tags">
          <el-icon><Collection /></el-icon>
          <template #title>标签管理</template>
        </el-menu-item>
        
        <el-menu-item index="/comments">
          <el-icon><ChatDotRound /></el-icon>
          <template #title>评论管理</template>
        </el-menu-item>
        
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 顶栏 -->
      <div class="header">
        <div class="left">
          <el-button
            type="text"
            class="collapse-btn"
            @click="isCollapsed = !isCollapsed"
          >
            <el-icon>
              <component :is="isCollapsed ? 'Expand' : 'Fold'" />
            </el-icon>
          </el-button>
          
          <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              {{ authStore.userInfo?.username }}
              <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 内容区 -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isCollapsed = ref(false)

const handleCommand = async (command) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        type: 'warning'
      })
      authStore.logout()
      router.push('/login')
    } catch {
      // 用户取消操作
    }
  } else if (command === 'profile') {
    // 跳转到个人信息页面
    router.push('/profile')
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  height: 100vh;
  
  .sidebar {
    width: 240px;
    height: 100%;
    background-color: #304156;
    transition: width 0.3s;
    
    &.collapsed {
      width: 64px;
    }
    
    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      color: #fff;
      
      img {
        width: 32px;
        height: 32px;
        margin-right: 12px;
      }
    }
  }
  
  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    .header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      border-bottom: 1px solid #dcdfe6;
      
      .left {
        display: flex;
        align-items: center;
        
        .collapse-btn {
          margin-right: 20px;
        }
      }
      
      .user-info {
        display: flex;
        align-items: center;
        cursor: pointer;
        
        .el-icon {
          margin-left: 4px;
        }
      }
    }
    
    .content {
      flex: 1;
      padding: 20px;
      overflow: auto;
    }
  }
}
</style>