import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../services/storage.js'

export const useFastingStore = defineStore('fasting', () => {
  const currentFast = ref(storage.get('currentFast', null))
  const history     = ref(storage.get('fastingHistory', []))

  const isActive = computed(() => !!currentFast.value)

  function start() {
    currentFast.value = { startTime: Date.now() }
    storage.set('currentFast', currentFast.value)
  }

  function stop() {
    if (!currentFast.value) return null
    const entry = {
      id:        Date.now(),
      startTime: currentFast.value.startTime,
      endTime:   Date.now(),
      duration:  Date.now() - currentFast.value.startTime,
    }
    history.value.unshift(entry)
    storage.set('fastingHistory', history.value)
    currentFast.value = null
    storage.remove('currentFast')
    return entry
  }

  function deleteEntry(id) {
    history.value = history.value.filter(f => f.id !== id)
    storage.set('fastingHistory', history.value)
  }

  return { currentFast, history, isActive, start, stop, deleteEntry }
})
