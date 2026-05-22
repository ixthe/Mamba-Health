<script setup>
defineProps({ meal: Object })
defineEmits(['edit', 'delete'])

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl group">
    <div class="flex-1 min-w-0">
      <p class="font-medium text-gray-900 dark:text-white truncate">{{ meal.name }}</p>
      <p class="text-xs text-gray-400 mt-0.5">{{ fmtTime(meal.time) }}</p>
    </div>
    <span class="font-bold text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap">
      {{ meal.calories }} kcal
    </span>
    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button @click="$emit('edit', meal)"
        class="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        title="Editar">✏️</button>
      <button @click="$emit('delete', meal.id)"
        class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        title="Excluir">🗑️</button>
    </div>
  </div>
</template>
