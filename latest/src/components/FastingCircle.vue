<script setup>
import { computed } from 'vue'

const props = defineProps({
  elapsed:     { type: Number, default: 0 },
  target:      { type: Number, default: 0 },
  time:        { type: String, default: '00:00:00' },
  label:       { type: String, default: '' },
  size:        { type: Number, default: 240 },
  strokeWidth: { type: Number, default: 14 },
})

const r            = computed(() => props.size / 2 - props.strokeWidth)
const circumference = computed(() => 2 * Math.PI * r.value)
const progress     = computed(() => props.target > 0 ? Math.min(1, props.elapsed / props.target) : 0)
const dashOffset   = computed(() => circumference.value * (1 - progress.value))
const pct          = computed(() => Math.min(100, Math.round(progress.value * 100)))
</script>

<template>
  <div class="relative flex items-center justify-center" :style="{ width: size + 'px', height: size + 'px' }">
    <!-- SVG ring -->
    <svg :width="size" :height="size" class="-rotate-90 absolute inset-0">
      <circle
        :cx="size/2" :cy="size/2" :r="r"
        fill="none" stroke-linecap="round"
        class="stroke-gray-100 dark:stroke-gray-700"
        :stroke-width="strokeWidth" />
      <circle
        :cx="size/2" :cy="size/2" :r="r"
        fill="none" stroke-linecap="round"
        class="stroke-emerald-500 transition-all duration-1000"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset" />
    </svg>

    <!-- Center text -->
    <div class="relative text-center select-none">
      <div class="text-3xl font-bold font-mono tabular-nums text-gray-900 dark:text-white tracking-tight">
        {{ time }}
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ label }}</div>
      <div v-if="target > 0" class="text-xs font-semibold mt-1"
        :class="pct >= 100 ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'">
        {{ pct }}% da meta
      </div>
    </div>
  </div>
</template>
