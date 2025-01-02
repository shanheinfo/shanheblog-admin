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
    xAxis: {
      type: 'category',
      data: props.data.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: props.data.map(item => item.count),
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        }
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
        data: props.data.map(item => item.count)
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