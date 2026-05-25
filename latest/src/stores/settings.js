import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { storage } from '../services/storage.js'

export const useSettingsStore = defineStore('settings', () => {
  const darkMode         = ref(storage.get('darkMode', false))
  const dailyCalorieGoal = ref(storage.get('dailyCalorieGoal', 2000))
  const fastingWindow    = ref(storage.get('fastingWindow', '16:8'))

  // Apply dark class immediately on load
  watch(darkMode, v => {
    storage.set('darkMode', v)
    document.documentElement.classList.toggle('dark', v)
  }, { immediate: true })

  watch(dailyCalorieGoal, v => storage.set('dailyCalorieGoal', v))
  watch(fastingWindow,    v => storage.set('fastingWindow', v))

  return { darkMode, dailyCalorieGoal, fastingWindow }
})
