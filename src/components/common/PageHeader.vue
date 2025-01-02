`<template>
  <div class="page-header">
    <div class="left">
      <h2 class="title">{{ title }}</h2>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </div>
    <div class="right">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  .title {
    font-size: 24px;
    font-weight: 500;
    margin: 0;
  }
  
  .subtitle {
    margin: 8px 0 0;
    color: #666;
  }
}
</style>`