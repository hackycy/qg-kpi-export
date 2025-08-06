<template>
  <div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <Card class="w-auto max-w-sm">
      <CardContent class="flex items-center space-x-4 p-6">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <div>
          <h3 class="text-base font-medium">正在解析Excel文件</h3>
          <p class="text-sm text-muted-foreground">请稍候...</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
</script>
