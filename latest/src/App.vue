<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore } from './stores/settings.js'
import { useFastingStore } from './stores/fasting.js'
import NotificationToast from './components/NotificationToast.vue'

const settings = useSettingsStore()
const fasting  = useFastingStore()
const route    = useRoute()

const nav = [
  { path: '/',          icon: '🏠', label: 'Dashboard',     short: 'Início'   },
  { path: '/fasting',   icon: '⏱️', label: 'Jejum',          short: 'Jejum'    },
  { path: '/nutrition', icon: '🥗', label: 'Nutrição',       short: 'Nutrição' },
  { path: '/history',   icon: '📋', label: 'Histórico',      short: 'Histórico'},
  { path: '/settings',  icon: '⚙️', label: 'Configurações',  short: 'Config'   },
]

const active = (path) => route.path === path
</script>

<template>
  <div :class="{ dark: settings.darkMode }">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex transition-colors duration-300">

      <!-- ── Desktop sidebar ─────────────────────────────── -->
      <aside class="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full z-20">
        <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
          <span class="text-3xl">🐍</span>
          <div>
            <p class="font-bold text-gray-900 dark:text-white leading-tight">Mamba Health</p>
            <p class="text-xs text-gray-400">Tracker</p>
          </div>
        </div>

        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <router-link v-for="item in nav" :key="item.path" :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            :class="active(item.path)
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'">
            <span class="text-lg">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
            <!-- active fasting dot -->
            <span v-if="item.path === '/fasting' && fasting.isActive"
              class="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </router-link>
        </nav>

        <div class="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
          <button @click="settings.darkMode = !settings.darkMode"
            class="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all">
            <span>{{ settings.darkMode ? '☀️' : '🌙' }}</span>
            <span>{{ settings.darkMode ? 'Modo Claro' : 'Modo Escuro' }}</span>
          </button>
        </div>
      </aside>

      <!-- ── Main area ───────────────────────────────────── -->
      <div class="flex-1 md:ml-64 flex flex-col min-h-screen">

        <!-- Mobile top bar -->
        <header class="md:hidden sticky top-0 z-10 flex items-center justify-between
          px-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur border-b
          border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🐍</span>
            <span class="font-bold text-gray-900 dark:text-white">Mamba Health</span>
          </div>
          <button @click="settings.darkMode = !settings.darkMode" class="text-xl p-1">
            {{ settings.darkMode ? '☀️' : '🌙' }}
          </button>
        </header>

        <!-- Page content -->
        <main class="flex-1 p-4 md:p-8 pb-24 md:pb-8 w-full max-w-4xl mx-auto">
          <router-view v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
        </main>
      </div>

      <!-- ── Mobile bottom nav ───────────────────────────── -->
      <nav class="md:hidden fixed bottom-0 inset-x-0 z-20 flex
        bg-white/95 dark:bg-gray-800/95 backdrop-blur
        border-t border-gray-200 dark:border-gray-700">
        <router-link v-for="item in nav" :key="item.path" :to="item.path"
          class="flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-medium transition-colors"
          :class="active(item.path) ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'">
          <span class="text-xl leading-none">{{ item.icon }}</span>
          <span>{{ item.short }}</span>
        </router-link>
      </nav>

      <NotificationToast />
    </div>
  </div>
</template>
