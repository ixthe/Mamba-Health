import { ref, onUnmounted } from 'vue'

export function useTimer() {
  const elapsed = ref(0)
  let tid = null

  function start(startTime) {
    elapsed.value = Date.now() - startTime
    tid = setInterval(() => { elapsed.value = Date.now() - startTime }, 1000)
  }

  function stop() { clearInterval(tid); tid = null }

  function fmt(ms) {
    const s = Math.floor(Math.abs(ms) / 1000)
    return [Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60]
      .map(n => String(n).padStart(2, '0')).join(':')
  }

  onUnmounted(stop)
  return { elapsed, start, stop, fmt }
}
