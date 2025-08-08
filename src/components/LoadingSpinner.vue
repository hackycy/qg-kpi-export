<template>
  <div
    class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <Card class="w-auto max-w-sm shadow-lg border border-border/60">
      <CardContent class="flex items-center gap-4 p-6">
        <div class="relative">
          <div
            class="size-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin"
          />
          <div class="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        </div>
        <div class="space-y-1">
          <h3 class="text-base font-medium tracking-tight">正在解析 Excel 文件</h3>
          <p class="text-xs text-muted-foreground">请稍候...</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
</script>
