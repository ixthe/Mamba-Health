<script setup>
import { ref, computed } from 'vue'
import MealCard from '../components/MealCard.vue'
import { useFastingStore }   from '../stores/fasting.js'
import { useNutritionStore } from '../stores/nutrition.js'
import { useNotification }   from '../composables/useNotification.js'

const fasting    = useFastingStore()
const nutrition  = useNutritionStore()
const { notify } = useNotification()
const tab        = ref('fasting')

const totalHrs = computed(() => {
  const ms = fasting.history.reduce((s, f) => s + f.duration, 0)
  return (ms / 3_600_000).toFixed(1)
})

const avgHrs = computed(() => {
  if (!fasting.history.length) return '0.0'
  const ms = fasting.history.reduce((s, f) => s + f.duration, 0)
  return (ms / 3_600_000 / fasting.history.length).toFixed(1)
})

const groupedMeals = computed(() => {
  const groups = {}
  nutrition.meals.forEach(meal => {
    const key = new Date(meal.time).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
    if (!groups[key]) groups[key] = []
    groups[key].push(meal)
  })
  return groups
})

const fmtDate = ts => new Date(ts).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', year: '2-digit' })
const fmtHour = ts => new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
const fmtHrs  = ms => (ms / 3_600_000).toFixed(1)
const delMeal = id => { nutrition.remove(id); notify('Refeição removida', 'info') }
</script>

<template>
  <div class="space-y-5">
    <h2 class="page-title">📋 Histórico</h2>

    <div class="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
      <button @click="tab = 'fasting'"
        class="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
        :class="tab === 'fasting' ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'">
        ⏱️ Jejum
      </button>
      <button @click="tab = 'nutrition'"
        class="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
        :class="tab === 'nutrition' ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'">
        🍽️ Nutrição
      </button>
    </div>

    <div v-show="tab === 'fasting'">
      <div v-if="!fasting.history.length" class="empty-state">
        <span class="text-5xl mb-3">⏱️</span>
        <span>Nenhum jejum registrado.</span>
        <router-link to="/fasting" class="mt-2 text-emerald-600 dark:text-emerald-400 hover:underline">Iniciar primeiro jejum →</router-link>
      </div>

      <div v-else class="space-y-3">
        <div class="grid grid-cols-3 gap-3">
          <div class="card p-4 text-center">
            <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ fasting.history.length }}</p>
            <p class="text-xs text-gray-500 mt-1">Total</p>
          </div>
          <div class="card p-4 text-center">
            <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ totalHrs }}h</p>
            <p class="text-xs text-gray-500 mt-1">Horas totais</p>
          </div>
          <div class="card p-4 text-center">
            <p class="text-2xl font-bold text-indigo-500">{{ avgHrs }}h</p>
            <p class="text-xs text-gray-500 mt-1">Média</p>
          </div>
        </div>

        <div v-for="f in fasting.history" :key="f.id" class="card p-4 flex items-center justify-between">
          <div>
            <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ fmtDate(f.startTime) }}</p>
            <p class="text-xs text-gray-400">{{ fmtHour(f.startTime) }} → {{ fmtHour(f.endTime) }}</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p class="font-bold text-lg text-emerald-600 dark:text-emerald-400">{{ fmtHrs(f.duration) }}h</p>
              <p class="text-xs" :class="f.duration >= 57_600_000 ? 'text-emerald-500' : 'text-amber-500'">
                {{ f.duration >= 57_600_000 ? '✅ Meta atingida' : '⏳ Parcial' }}
              </p>
            </div>
            <button @click="fasting.deleteEntry(f.id)"
              class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-show="tab === 'nutrition'">
      <div v-if="!nutrition.meals.length" class="empty-state">
        <span class="text-5xl mb-3">🍽️</span>
        <span>Nenhuma refeição registrada.</span>
        <router-link to="/nutrition" class="mt-2 text-emerald-600 dark:text-emerald-400 hover:underline">Registrar primeira refeição →</router-link>
      </div>

      <div v-else class="space-y-4">
        <div v-for="(dayMeals, dateLabel) in groupedMeals" :key="dateLabel">
          <div class="flex justify-between items-baseline mb-2">
            <h3 class="font-semibold text-gray-700 dark:text-gray-300 capitalize text-sm">{{ dateLabel }}</h3>
            <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {{ dayMeals.reduce((s, m) => s + m.calories, 0) }} kcal
            </span>
          </div>
          <div class="space-y-2">
            <MealCard v-for="meal in dayMeals" :key="meal.id" :meal="meal" @edit="() => {}" @delete="delMeal" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
