<script setup>
import { ref, computed, onMounted } from 'vue'
import FastingCircle from '../components/FastingCircle.vue'
import { useFastingStore }  from '../stores/fasting.js'
import { useSettingsStore } from '../stores/settings.js'
import { useTimer }         from '../composables/useTimer.js'
import { useNotification }  from '../composables/useNotification.js'

const fasting  = useFastingStore()
const settings = useSettingsStore()
const { elapsed, start, stop, fmt } = useTimer()
const { notify } = useNotification()

const WINDOWS     = ['16:8', '18:6', '20:4', 'Custom']
const selWindow   = ref(settings.fastingWindow)
const customHours = ref(16)

onMounted(() => {
  if (fasting.isActive) start(fasting.currentFast.startTime)
})

const targetMs = computed(() => {
  const h = selWindow.value === 'Custom' ? customHours.value : parseInt(selWindow.value)
  return h * 3_600_000
})

const goalReached = computed(() => fasting.isActive && elapsed.value >= targetMs.value)

const startStr = computed(() => {
  if (!fasting.currentFast) return ''
  return new Date(fasting.currentFast.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
})

function setWindow(w) {
  if (fasting.isActive) return
  selWindow.value = w
  settings.fastingWindow = w
}

function toggle() {
  if (fasting.isActive) {
    const entry = fasting.stop()
    stop()
    notify(`Jejum finalizado! ${(entry.duration / 3_600_000).toFixed(1)}h 💪`, 'success')
  } else {
    fasting.start()
    start(fasting.currentFast.startTime)
    notify('Jejum iniciado! 🚀', 'success')
  }
}

const fmtDate = ts => new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
const fmtHour = ts => new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
const fmtHrs  = ms => (ms / 3_600_000).toFixed(1)
</script>

<template>
  <div class="max-w-lg mx-auto space-y-4">
    <h2 class="page-title">⏱️ Jejum Intermitente</h2>

    <div class="card p-5">
      <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Janela de Jejum</p>
      <div class="grid grid-cols-4 gap-2">
        <button v-for="w in WINDOWS" :key="w" @click="setWindow(w)" :disabled="fasting.isActive"
          class="py-2 text-sm font-semibold rounded-xl transition-all disabled:opacity-40"
          :class="selWindow === w ? 'bg-emerald-500 text-white' : 'btn-gray'">
          {{ w }}
        </button>
      </div>
      <div v-if="selWindow === 'Custom'" class="mt-3 flex items-center gap-3">
        <input v-model.number="customHours" type="number" min="1" max="23" :disabled="fasting.isActive"
          class="w-24 px-3 py-2 text-center border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-50" />
        <span class="text-sm text-gray-500">horas de jejum</span>
      </div>
    </div>

    <div class="card p-8 flex flex-col items-center gap-4">
      <div class="relative">
        <div v-if="fasting.isActive" class="absolute inset-0 rounded-full bg-emerald-500/20 pulse-ring" />
        <FastingCircle
          :elapsed="elapsed"
          :target="fasting.isActive ? targetMs : 0"
          :time="fmt(elapsed)"
          :label="fasting.isActive ? (goalReached ? '🎉 Meta atingida!' : 'Em jejum') : 'Aguardando início'"
          :size="230" />
      </div>

      <div v-if="fasting.isActive" class="text-center space-y-1">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Iniciado às <span class="font-semibold text-gray-700 dark:text-gray-300">{{ startStr }}</span>
        </p>
        <p class="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          {{ goalReached ? '✅ Meta atingida!' : `⏳ Faltam ${fmt(targetMs - elapsed)} para a meta` }}
        </p>
      </div>

      <button @click="toggle"
        class="px-10 py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all hover:scale-105"
        :class="fasting.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'">
        {{ fasting.isActive ? '⏹ Finalizar Jejum' : '▶ Iniciar Jejum' }}
      </button>
    </div>

    <div class="card p-5">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-gray-900 dark:text-white">Histórico Recente</h3>
        <router-link to="/history" class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">Ver tudo →</router-link>
      </div>

      <div v-if="!fasting.history.length" class="empty-state">
        <span class="text-4xl mb-2">⏱️</span>
        <span>Nenhum jejum registrado ainda.</span>
      </div>

      <div v-else class="space-y-2">
        <div v-for="f in fasting.history.slice(0, 5)" :key="f.id"
          class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div>
            <p class="font-medium text-gray-900 dark:text-white text-sm">{{ fmtDate(f.startTime) }}</p>
            <p class="text-xs text-gray-400">{{ fmtHour(f.startTime) }} → {{ fmtHour(f.endTime) }}</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p class="font-bold text-emerald-600 dark:text-emerald-400">{{ fmtHrs(f.duration) }}h</p>
              <p class="text-xs" :class="f.duration >= 57_600_000 ? 'text-emerald-500' : 'text-gray-400'">
                {{ f.duration >= 57_600_000 ? '✅ 16h+' : '⏳ Parcial' }}
              </p>
            </div>
            <button @click="fasting.deleteEntry(f.id)"
              class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
