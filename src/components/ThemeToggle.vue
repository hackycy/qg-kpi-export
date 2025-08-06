<template>
  <Button
    variant="outline"
    size="sm"
    @click="toggleDark"
    class="h-9 w-9 p-0"
    :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
  >
    <Sun v-if="isDark" class="h-4 w-4" />
    <Moon v-else class="h-4 w-4" />
  </Button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, toggleDark } = useDarkMode()
</script>
