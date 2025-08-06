<template>
  <Button
    variant="outline"
    size="sm"
    @click="toggleDark"
    class="h-9 w-9 p-0 transition-all duration-200 hover:scale-105"
    :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
  >
    <Sun v-if="isDark" class="h-4 w-4 transition-transform duration-200" />
    <Moon v-else class="h-4 w-4 transition-transform duration-200" />
  </Button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, toggleDark } = useDarkMode()
</script>
