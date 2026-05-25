<script setup>
import { ref, reactive } from 'vue'
import CalorieProgress from '../components/CalorieProgress.vue'
import MealCard        from '../components/MealCard.vue'
import { useNutritionStore } from '../stores/nutrition.js'
import { useSettingsStore }  from '../stores/settings.js'
import { useNotification }   from '../composables/useNotification.js'

const nutrition  = useNutritionStore()
const settings   = useSettingsStore()
const { notify } = useNotification()

const editing = ref(null)
const form    = reactive({ name: '', calories: '', time: '' })

function nowTime() {
  return new Date().toTimeString().slice(0, 5)
}

function resetForm() {
  editing.value = null
  Object.assign(form, { name: '', calories: '', time: nowTime() })
}

function save() {
  if (!form.name.trim() || !(Number(form.calories) > 0))
    return notify('Preencha nome e calorias!', 'error')

  const [h, m] = form.time.split(':')
  const d = new Date()
  d.setHours(h, m, 0, 0)

  const payload = { name: form.name.trim(), calories: Number(form.calories), time: d.getTime() }

  if (editing.value) {
    nutrition.update(editing.value.id, payload)
    notify('Refeição atualizada! ✅', 'success')
  } else {
    nutrition.add(payload)
    notify('Refeição registrada! 🍽️', 'success')
  }
  resetForm()
}

function startEdit(meal) {
  editing.value = meal
  const d = new Date(meal.time)
  form.name     = meal.name
  form.calories = meal.calories
  form.time     = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function del(id) {
  nutrition.remove(id)
  notify('Refeição removida', 'info')
}

resetForm()
</script>

<template>
  <div class="max-w-lg mx-auto space-y-4">
    <h2 class="page-title">🥗 Nutrição</h2>

    <CalorieProgress :consumed="nutrition.todayCalories" :goal="settings.dailyCalorieGoal" />

    <div class="card p-5">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
        {{ editing ? '✏️ Editar Refeição' : '+ Nova Refeição' }}
      </h3>
      <div class="space-y-3">
        <input v-model="form.name" type="text" placeholder="Nome da refeição" class="input-field" />
        <div class="flex gap-2">
          <input v-model="form.calories" type="number" min="1" placeholder="Calorias (kcal)" class="input-field" />
          <input v-model="form.time" type="time"
            class="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>
        <div class="flex gap-2">
          <button @click="save" class="flex-1 py-2.5 btn-green">{{ editing ? 'Salvar' : 'Adicionar' }}</button>
          <button v-if="editing" @click="resetForm" class="px-5 py-2.5 btn-gray">Cancelar</button>
        </div>
      </div>
    </div>

    <div class="card p-5">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-gray-900 dark:text-white">Refeições de Hoje</h3>
        <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">{{ nutrition.todayCalories }} kcal</span>
      </div>
      <div v-if="!nutrition.todayMeals.length" class="empty-state">
        <span class="text-4xl mb-2">🍽️</span>
        <span>Nenhuma refeição registrada hoje.</span>
      </div>
      <div v-else class="space-y-2">
        <MealCard v-for="meal in nutrition.todayMeals" :key="meal.id" :meal="meal" @edit="startEdit" @delete="del" />
      </div>
    </div>
  </div>
</template>
