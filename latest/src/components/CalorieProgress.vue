<script setup>
import { computed } from 'vue'

const props = defineProps({
  consumed: { type: Number, default: 0 },
  goal:     { type: Number, default: 2000 },
})

const pct       = computed(() => props.goal > 0 ? Math.min(100, (props.consumed / props.goal) * 100) : 0)
const remaining = computed(() => props.goal - props.consumed)
const over      = computed(() => remaining.value < 0)
const barColor  = computed(() =>
  pct.value > 100 ? 'bg-red-500' : pct.value > 80 ? 'bg-amber-500' : 'bg-emerald-500'
)
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
    <div class="flex justify-between items-baseline mb-2">
      <h3 class="font-semibold text-gray-900 dark:text-white">🔥 Calorias Hoje</h3>
      <span class="text-xs text-gray-400">meta: {{ goal }} kcal</span>
    </div>

    <div class="flex items-end gap-1.5 mb-3">
      <span class="text-4xl font-bold" :class="over ? 'text-red-500' : 'text-emerald-500'">
        {{ consumed }}
      </span>
      <span class="text-gray-400 mb-1">/ {{ goal }} kcal</span>
    </div>

    <div class="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
      <div class="h-full rounded-full transition-all duration-700 ease-out"
        :class="barColor"
        :style="{ width: pct + '%' }" />
    </div>

    <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
      <span>{{ Math.round(pct) }}% atingido</span>
      <span :class="over ? 'text-red-500 font-semibold' : ''">
        {{ over ? Math.abs(remaining) + ' kcal excedidas' : remaining + ' kcal restantes' }}
      </span>
    </div>
  </div>
</template>
