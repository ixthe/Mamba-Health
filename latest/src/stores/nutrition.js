import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../services/storage.js'

export const useNutritionStore = defineStore('nutrition', () => {
  const meals = ref(storage.get('meals', []))

  const todayMeals = computed(() => {
    const today = new Date().toDateString()
    return meals.value.filter(m => new Date(m.time).toDateString() === today)
  })

  const todayCalories = computed(() =>
    todayMeals.value.reduce((s, m) => s + m.calories, 0)
  )

  function add(meal) {
    const entry = { id: Date.now(), time: Date.now(), ...meal }
    meals.value.unshift(entry)
    storage.set('meals', meals.value)
    return entry
  }

  function update(id, data) {
    const i = meals.value.findIndex(m => m.id === id)
    if (i !== -1) {
      meals.value[i] = { ...meals.value[i], ...data }
      storage.set('meals', meals.value)
    }
  }

  function remove(id) {
    meals.value = meals.value.filter(m => m.id !== id)
    storage.set('meals', meals.value)
  }

  return { meals, todayMeals, todayCalories, add, update, remove }
})
