<template>
  <div ref="chartRef" class="trend-chart"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const chartRef = ref(null)
let chart = null

const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['文章数', '评论数', '访问量']
    },
    xAxis: {
      type: 'category',
      data: props.data.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '文章数',
        data: props.data.map(item => item.articleCount),
        type: 'line',
        smooth: true
      },
      {
        name: '评论数',
        data: props.data.map(item => item.commentCount),
        type: 'line',
        smooth: true
      },
      {
        name: '访问量',
        data: props.data.map(item => item.viewCount),
        type: 'line',
        smooth: true
      }
    ]
  }
  chart.setOption(option)
}

watch(() => props.data, () => {
  chart?.setOption({
    xAxis: {
      data: props.data.map(item => item.date)
    },
    series: [
      {
        data: props.data.map(item => item.articleCount)
      },
      {
        data: props.data.map(item => item.commentCount)
      },
      {
        data: props.data.map(item => item.viewCount)
      }
    ]
  })
})

onMounted(() => {
  initChart()
  window.addEventListener('resize', chart?.resize)
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', chart?.resize)
})
</script> 