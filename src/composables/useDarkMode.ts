import { ref, watch, onMounted, nextTick } from 'vue'
import { usePreferredDark, useStorage } from '@vueuse/core'

export function useDarkMode() {
  // 获取系统偏好
  const prefersDark = usePreferredDark()
  
  // 使用storage，如果没有存储值则使用系统偏好
  const storedTheme = useStorage('theme-dark', prefersDark.value)
  
  // 创建响应式的isDark状态
  const isDark = ref(storedTheme.value)

  const toggleDark = () => {
    isDark.value = !isDark.value
    storedTheme.value = isDark.value
    console.log('useDarkMode: toggleDark called, new value:', isDark.value)
  }

  // 应用暗色模式类
  const applyTheme = (dark: boolean) => {
    console.log('useDarkMode: applyTheme called with:', dark)
    if (typeof document !== 'undefined') {
      nextTick(() => {
        if (dark) {
          document.documentElement.classList.add('dark')
          console.log('Added dark class to html')
        } else {
          document.documentElement.classList.remove('dark')
          console.log('Removed dark class from html')
        }
      })
    }
  }

  // 监听isDark变化
  watch(
    isDark,
    (dark) => {
      console.log('useDarkMode: isDark watcher triggered, value:', dark)
      applyTheme(dark)
      storedTheme.value = dark
    },
    { immediate: true }
  )

  // 监听存储变化（其他标签页的变化）
  watch(
    storedTheme,
    (stored) => {
      if (stored !== isDark.value) {
        isDark.value = stored
      }
    }
  )

  // 确保组件挂载时应用正确的主题
  onMounted(() => {
    console.log('useDarkMode: onMounted, current value:', isDark.value)
    applyTheme(isDark.value)
  })

  return {
    isDark,
    toggleDark
  }
}
