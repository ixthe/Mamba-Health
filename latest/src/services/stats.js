import { storage } from './storage.js'

export function getWeeklyStats() {
  const fasts = storage.get('fastingHistory', [])
  const meals = storage.get('meals', [])

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const ds = date.toDateString()

    const dayFasts = fasts.filter(f => f.endTime && new Date(f.endTime).toDateString() === ds)
    const dayMeals = meals.filter(m => new Date(m.time).toDateString() === ds)

    return {
      date,
      label: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      fastingHours: dayFasts.reduce((s, f) => s + f.duration / 3_600_000, 0),
      calories:     dayMeals.reduce((s, m) => s + m.calories, 0),
    }
  })
}
