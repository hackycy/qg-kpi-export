<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useExcelParser } from '@/composables/useExcelParser'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { Button } from '@/components/ui/button'
import { Toaster } from 'vue-sonner'

const router = useRouter()
const { excelData, reset } = useExcelParser()

const handleReset = () => {
  reset()
  if (router.currentRoute.value.path !== '/') {
    router.push('/')
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex flex-col"
  >
    <!-- 头部 -->
    <header
      class="backdrop-blur supports-[backdrop-filter]:bg-background/70 bg-background/90 border-b border-border sticky top-0 z-50"
    >
      <div class="w-full flex justify-center">
        <div class="w-full max-w-7xl px-4 sm:px-6 py-3 sm:py-4">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-6 min-w-0">
              <h1 class="text-lg sm:text-2xl font-bold tracking-tight text-foreground select-none">
                KPI 日报导出工具
              </h1>
              <nav class="hidden md:flex items-center gap-1">
                <RouterLink to="/" v-slot="{ isActive }">
                  <Button :variant="isActive ? 'default' : 'ghost'" size="sm" class="px-3"
                    >首页</Button
                  >
                </RouterLink>
                <RouterLink to="/about" v-slot="{ isActive }">
                  <Button :variant="isActive ? 'default' : 'ghost'" size="sm" class="px-3"
                    >关于</Button
                  >
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
                >重新上传</Button
              >
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="flex-1 w-full flex justify-center">
      <div class="w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <RouterView />
      </div>
    </main>

    <Toaster position="top-right" rich-colors close-button />
  </div>
</template>

<style scoped></style>
