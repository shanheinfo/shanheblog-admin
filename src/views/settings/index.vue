<template>
  <div class="settings">
    <page-header title="系统设置" />
    
    <el-card>
      <el-tabs>
        <!-- 基本设置 -->
        <el-tab-pane label="基本设置">
          <basic-settings />
        </el-tab-pane>
        
        <!-- SEO设置 -->
        <el-tab-pane label="SEO设置">
          <seo-settings />
        </el-tab-pane>
        
        <!-- 评论设置 -->
        <el-tab-pane label="评论设置">
          <comment-settings />
        </el-tab-pane>
        
        <!-- 邮件设置 -->
        <el-tab-pane label="邮件设置">
          <email-settings />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template> 