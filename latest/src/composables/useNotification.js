import { ref } from 'vue'

// Shared singleton so any component can push notifications
const notifications = ref([])

export function useNotification() {
  function notify(message, type = 'success') {
    const id = Date.now() + Math.random()
    notifications.value.push({ id, message, type })
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }, 3500)
  }
  return { notifications, notify }
}
