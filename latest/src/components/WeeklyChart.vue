<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend,
} from 'chart.js'
import { useSettingsStore } from '../stores/settings.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  title:  String,
  labels: Array,
  data:   Array,
  color:  { type: String, default: '#10b981' },
  goal:   Number,
})

const settings = useSettingsStore()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [{
    data:            props.data,
    backgroundColor: props.color + '55',
    borderColor:     props.color,
    borderWidth:     2,
    borderRadius:    8,
  }],
}))

const chartOptions = computed(() => ({
  responsive:          true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      grid:  { color: settings.darkMode ? '#374151' : '#f3f4f6' },
      ticks: { color: settings.darkMode ? '#9ca3af' : '#6b7280', maxTicksLimit: 5 },
      beginAtZero: true,
    },
    x: {
      grid:  { display: false },
      ticks: { color: settings.darkMode ? '#9ca3af' : '#6b7280' },
    },
  },
}))
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
    <h3 class="font-semibold text-gray-900 dark:text-white mb-4">{{ title }}</h3>
    <div class="h-40">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
