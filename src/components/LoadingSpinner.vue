<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
      <div class="flex items-center space-x-3">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div>
          <h3 class="text-lg font-medium text-gray-900">正在解析Excel文件</h3>
          <p class="text-sm text-gray-500">请稍候...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>
