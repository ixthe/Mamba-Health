<script setup>
defineProps({
  icon:       String,
  value:      [String, Number],
  label:      String,
  badge:      String,
  sub:        String,
  badgeClass: { type: String, default: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
    <div class="flex items-start justify-between mb-3">
      <span class="text-2xl">{{ icon }}</span>
      <span v-if="badge" class="text-xs font-semibold px-2 py-0.5 rounded-full" :class="badgeClass">
        {{ badge }}
      </span>
    </div>
    <div class="text-2xl font-bold text-gray-900 dark:text-white truncate">{{ value }}</div>
    <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ label }}</div>
    <div v-if="sub" class="text-xs text-gray-400 dark:text-gray-500 mt-1.5">{{ sub }}</div>
  </div>
</template>
