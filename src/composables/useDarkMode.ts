import { watch } from 'vue'
import { usePreferredDark, useStorage } from '@vueuse/core'

const isDark = useStorage('theme-dark', usePreferredDark())

export function useDarkMode() {
  const toggleDark = () => {
    isDark.value = !isDark.value
  }

  watch(
    isDark,
    (dark) => {
      if (typeof document !== 'undefined') {
        if (dark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    },
    { immediate: true }
  )

  return {
    isDark,
    toggleDark
  }
}
