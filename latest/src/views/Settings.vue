<script setup>
import { useSettingsStore }  from '../stores/settings.js'
import { useFastingStore }   from '../stores/fasting.js'
import { useNutritionStore } from '../stores/nutrition.js'
import { useNotification }   from '../composables/useNotification.js'
import { storage }           from '../services/storage.js'

const settings   = useSettingsStore()
const fasting    = useFastingStore()
const nutrition  = useNutritionStore()
const { notify } = useNotification()

const WINDOWS = ['16:8', '18:6', '20:4', 'Custom']

function confirmReset() {
  if (!confirm('Tem certeza? Todos os dados serão apagados!')) return
  storage.clear()
  fasting.history.splice(0)
  fasting.currentFast = null
  nutrition.meals.splice(0)
  settings.dailyCalorieGoal = 2000
  settings.fastingWindow = '16:8'
  notify('Dados apagados.', 'info')
}
</script>

<template>
  <div class="max-w-lg mx-auto space-y-4">
    <h2 class="page-title">⚙️ Configurações</h2>

    <div class="card overflow-hidden">
      <p class="font-semibold text-gray-900 dark:text-white px-5 py-4 border-b border-gray-100 dark:border-gray-700">🎨 Aparência</p>
      <div class="flex items-center justify-between px-5 py-4">
        <div>
          <p class="font-medium text-gray-900 dark:text-white">Modo Escuro</p>
          <p class="text-sm text-gray-400">Interface em tema escuro</p>
        </div>
        <button @click="settings.darkMode = !settings.darkMode"
          class="relative w-12 h-6 rounded-full transition-colors"
          :class="settings.darkMode ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'">
          <div class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
            :class="settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'" />
        </button>
      </div>
    </div>

    <div class="card overflow-hidden">
      <p class="font-semibold text-gray-900 dark:text-white px-5 py-4 border-b border-gray-100 dark:border-gray-700">🎯 Metas</p>
      <div class="px-5 py-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meta diária de calorias (kcal)</label>
          <input v-model.number="settings.dailyCalorieGoal" type="number" min="500" max="6000" step="50" class="input-field" />
          <p class="text-xs text-gray-400 mt-1">Recomendado: 1800–2500 kcal</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Janela de jejum padrão</label>
          <div class="grid grid-cols-4 gap-2">
            <button v-for="w in WINDOWS" :key="w" @click="settings.fastingWindow = w"
              class="py-2 text-sm font-semibold rounded-xl transition-all"
              :class="settings.fastingWindow === w ? 'bg-emerald-500 text-white' : 'btn-gray'">
              {{ w }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card overflow-hidden">
      <p class="font-semibold text-gray-900 dark:text-white px-5 py-4 border-b border-gray-100 dark:border-gray-700">📊 Seus dados</p>
      <div class="grid grid-cols-2 gap-px bg-gray-100 dark:bg-gray-700">
        <div class="bg-white dark:bg-gray-800 px-5 py-4 text-center">
          <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ fasting.history.length }}</p>
          <p class="text-xs text-gray-400 mt-1">Jejuns registrados</p>
        </div>
        <div class="bg-white dark:bg-gray-800 px-5 py-4 text-center">
          <p class="text-2xl font-bold text-indigo-500">{{ nutrition.meals.length }}</p>
          <p class="text-xs text-gray-400 mt-1">Refeições registradas</p>
        </div>
      </div>
      <div class="px-5 py-4">
        <button @click="confirmReset"
          class="w-full py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-colors">
          🗑️ Limpar todos os dados
        </button>
      </div>
    </div>

    <p class="text-center text-xs text-gray-400 py-2">🐍 Mamba Health Tracker v1.0.0 · Vue 3 + Pinia + Tailwind</p>
  </div>
</template>
