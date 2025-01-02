<template>
  <div ref="chartRef" class="category-chart"></div>
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
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: props.data.map(item => ({
          name: item.name,
          value: item.count
        }))
      }
    ]
  }
  chart.setOption(option)
}

watch(() => props.data, () => {
  chart?.setOption({
    series: [
      {
        data: props.data.map(item => ({
          name: item.name,
          value: item.count
        }))
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