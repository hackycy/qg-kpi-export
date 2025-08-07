<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useExcelParser } from '@/composables/useExcelParser'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { Button } from '@/components/ui/button'

const router = useRouter()
const { excelData, reset } = useExcelParser()

const handleReset = () => {
  reset()
  // 如果不在首页，跳转到首页
  if (router.currentRoute.value.path !== '/') {
    router.push('/')
  }
}
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- 头部 -->
    <header class="bg-card border-b border-border sticky top-0 z-10">
      <div class="w-full flex justify-center">
        <div class="w-full max-w-7xl px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-6">
              <h1 class="text-xl sm:text-2xl font-bold text-foreground">KPI日报导出工具</h1>
              <nav class="hidden sm:flex items-center gap-4">
                <RouterLink
                  to="/"
                  class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  active-class="text-foreground font-medium"
                >
                  首页
                </RouterLink>
                <RouterLink
                  to="/about"
                  class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  active-class="text-foreground font-medium"
                >
                  关于
                </RouterLink>
              </nav>
            </div>
            <div class="flex items-center gap-2">
              <ThemeToggle />
              <Button
                v-if="excelData.length > 0"
                @click="handleReset"
                variant="outline"
                size="sm"
                class="h-9"
              >
                重新上传
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="flex-1 w-full flex justify-center">
      <div class="w-full max-w-7xl px-4 py-6">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 可以在这里添加任何特定的样式 */
</style>
