<script setup>
import { computed, onMounted } from 'vue'
import StatsCard       from '../components/StatsCard.vue'
import CalorieProgress from '../components/CalorieProgress.vue'
import WeeklyChart     from '../components/WeeklyChart.vue'
import { useFastingStore }   from '../stores/fasting.js'
import { useNutritionStore } from '../stores/nutrition.js'
import { useSettingsStore }  from '../stores/settings.js'
import { useTimer }          from '../composables/useTimer.js'
import { getWeeklyStats }    from '../services/stats.js'

const fasting   = useFastingStore()
const nutrition = useNutritionStore()
const settings  = useSettingsStore()
const { elapsed, start, fmt } = useTimer()

onMounted(() => {
  if (fasting.isActive) start(fasting.currentFast.startTime)
})

const goal   = computed(() => settings.dailyCalorieGoal)
const weekly = computed(() => getWeeklyStats())

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia! 🌅'
  if (h < 18) return 'Boa tarde! ☀️'
  return 'Boa noite! 🌙'
})

const calPct = computed(() =>
  Math.round((nutrition.todayCalories / goal.value) * 100) + '%'
)

const streak = computed(() => {
  let s = 0
  for (let i = 0; i < 30; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const hasfast = fasting.history.some(f => new Date(f.endTime).toDateString() === d.toDateString())
    if (hasfast) s++
    else if (i > 0) break
  }
  return s
})
</script>

<template>
  <div class="space-y-5">
    <div>
      <h2 class="page-title">{{ greeting }}</h2>
      <p class="text-gray-500 dark:text-gray-400 mt-1 text-sm">
        {{ fasting.isActive ? 'Jejum ativo. Continue firme! 💪' : 'Acompanhe sua saúde com consistência.' }}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <StatsCard icon="⏱️" :value="fasting.isActive ? fmt(elapsed) : '--:--:--'" label="Jejum atual"
        :badge="fasting.isActive ? 'Ativo' : 'Inativo'"
        :badge-class="fasting.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'" />
      <StatsCard icon="🔥" :value="nutrition.todayCalories + ' kcal'" label="Calorias hoje" :badge="calPct" :sub="`Meta: ${goal} kcal`" />
      <StatsCard icon="📅" :value="fasting.history.length" label="Jejuns completos" badge="Total" />
      <StatsCard icon="🏆" :value="streak" label="Dias consecutivos" :badge="streak > 0 ? '🔥 Sequência' : 'Comece hoje'"
        :badge-class="streak > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'" />
    </div>

    <CalorieProgress :consumed="nutrition.todayCalories" :goal="goal" />

    <div class="grid md:grid-cols-2 gap-3">
      <WeeklyChart title="⏱️ Jejum (7 dias)"   :labels="weekly.map(d => d.label)" :data="weekly.map(d => +d.fastingHours.toFixed(1))" color="#10b981" />
      <WeeklyChart title="🔥 Calorias (7 dias)" :labels="weekly.map(d => d.label)" :data="weekly.map(d => d.calories)"                  color="#6366f1" />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <router-link to="/fasting" class="flex items-center gap-3 p-4 rounded-2xl text-white transition-all hover:scale-[1.02]"
        :class="fasting.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'">
        <span class="text-2xl">{{ fasting.isActive ? '⏹️' : '▶️' }}</span>
        <div>
          <p class="font-semibold">{{ fasting.isActive ? 'Finalizar Jejum' : 'Iniciar Jejum' }}</p>
          <p class="text-xs opacity-75">{{ fasting.isActive ? fmt(elapsed) + ' em andamento' : settings.fastingWindow }}</p>
        </div>
      </router-link>
      <router-link to="/nutrition" class="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white transition-all hover:scale-[1.02]">
        <span class="text-2xl">🥗</span>
        <div>
          <p class="font-semibold">Registrar Refeição</p>
          <p class="text-xs opacity-75">{{ nutrition.todayMeals.length }} refeições hoje</p>
        </div>
      </router-link>
    </div>
  </div>
</template>
