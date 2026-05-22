<script setup>
import { useNotification } from '../composables/useNotification.js'
const { notifications } = useNotification()
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div v-for="n in notifications" :key="n.id"
          class="flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold pointer-events-auto max-w-xs"
          :class="{
            'bg-emerald-500 text-white': n.type === 'success',
            'bg-red-500    text-white': n.type === 'error',
            'bg-blue-500   text-white': n.type === 'info',
          }">
          <span class="shrink-0 text-base">
            {{ n.type === 'success' ? '✓' : n.type === 'error' ? '✕' : 'ℹ' }}
          </span>
          <span>{{ n.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
