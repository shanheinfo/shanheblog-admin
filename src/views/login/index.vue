<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>登录</h2>
      </template>
      
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码" />
        </el-form-item>
      </el-form>

      <!-- 验证码组件,只在需要时显示 -->
      <gocaptcha-slide
        v-if="showCaptcha"
        :config="slideConfig"
        :data="captchaStore.captchaData"
        :events="slideEvents"
        ref="slideRef"
      />

      <el-button type="primary" @click="handleLogin">登录</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useCaptchaStore } from '@/stores/captcha'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const captchaStore = useCaptchaStore()
const authStore = useAuthStore()
const showCaptcha = ref(false)
const slideRef = ref(null)
const router = useRouter()

const loginForm = reactive({
  username: '',
  password: '',
})

// 验证码事件
const slideEvents = {
  confirm(point, reset) {
    authStore.login({
      username: loginForm.username,
      password: loginForm.password,
      captcha_key: captchaStore.captchaId,
      point: {
        x: point.x,
        y: point.y
      }
    }).then(() => {
      showCaptcha.value = false
      // 登录成功后跳转到仪表盘
      router.push('/dashboard')
    }).catch((error) => {
      if (error.response?.status === 500) {
        ElMessage.error('服务器异常')
      } else {
        ElMessage.error(error.response?.data?.msg || '未知错误')
      }
      captchaStore.getCaptcha()
    })
  },
  refresh() {
    captchaStore.getCaptcha()
  },
  close() {
    showCaptcha.value = false
  }
}

const handleLogin = async () => {
  showCaptcha.value = true
  await captchaStore.getCaptcha()
}

const slideConfig = reactive({
  width: 300,
  height: 220,
  scope: true
})
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;

  .login-card {
    width: 400px;

    :deep(.el-card__header) {
      text-align: center;

      h2 {
        margin: 0;
        font-size: 24px;
        color: #303133;
      }
    }

    .login-button {
      width: 100%;
      margin-top: 20px;
    }
  }
}

// 验证码弹窗样式
:deep(.el-dialog) {
  border-radius: 8px;
  
  .el-dialog__header {
    margin-right: 0;
    text-align: center;
    padding: 15px;
    margin: 0;
  }
  
  .el-dialog__body {
    padding: 0;
    
    .captcha-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
  }
}
</style>
