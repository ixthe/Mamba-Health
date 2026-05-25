const P = 'mamba_'

export const storage = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(P + key)
      return v !== null ? JSON.parse(v) : fallback
    } catch { return fallback }
  },
  set(key, val) { localStorage.setItem(P + key, JSON.stringify(val)) },
  remove(key)   { localStorage.removeItem(P + key) },
  clear()       {
    Object.keys(localStorage)
      .filter(k => k.startsWith(P))
      .forEach(k => localStorage.removeItem(k))
  },
}
