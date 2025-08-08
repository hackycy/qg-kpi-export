<template>
  <div
    class="border-2 border-dashed border-border rounded-xl p-8 sm:p-10 text-center transition-all duration-300 touch-manipulation relative overflow-hidden group"
    :class="{
      'border-primary/70 bg-primary/5 ring-2 ring-primary/30': isDragOver,
      'hover:border-primary/40 hover:bg-muted/30': !isDragOver,
    }"
    @drop="handleDrop"
    @dragover.prevent="isDragOver = true"
    @dragleave="isDragOver = false"
    @dragenter.prevent
  >
    <div
      class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,theme(colors.primary/5),transparent_70%)]"
    />

    <input
      ref="fileInput"
      type="file"
      accept=".xlsx,.xls"
      class="hidden"
      @change="handleFileSelect"
    />

    <div class="flex flex-col items-center gap-5 relative">
      <div
        class="p-4 rounded-full bg-primary/10 text-primary ring-4 ring-primary/10 ring-offset-2 ring-offset-background"
      >
        <Upload class="w-10 h-10 sm:w-12 sm:h-12" />
      </div>

      <div class="space-y-3 max-w-md mx-auto">
        <p class="text-base sm:text-lg font-medium text-foreground leading-relaxed">
          拖拽 Excel 文件到这里，或者
          <button
            @click="handleClick"
            class="text-primary hover:text-primary/80 underline underline-offset-4 touch-manipulation font-semibold"
            type="button"
          >
            点击选择文件
          </button>
        </p>
        <p class="text-xs sm:text-sm text-muted-foreground tracking-wide">
          支持 .xlsx 和 .xls 格式（最大 10MB）
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'

const emit = defineEmits<{
  fileSelected: [file: File]
  error: [message: string]
}>()

const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement>()

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    validateAndEmitFile(file)
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    const file = files[0]
    validateAndEmitFile(file)
  }
}

const handleClick = () => {
  fileInput.value?.click()
}

const validateAndEmitFile = (file: File) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ]

  if (!allowedTypes.includes(file.type)) {
    emit('error', '请选择Excel文件（.xlsx或.xls格式）')
    return
  }

  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    emit('error', '文件大小不能超过10MB')
    return
  }

  emit('fileSelected', file)
}
</script>
