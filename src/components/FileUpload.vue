<template>
  <div 
    class="border-2 border-dashed border-border rounded-lg p-6 sm:p-8 text-center hover:border-primary/50 transition-all duration-200 touch-manipulation"
    :class="{ 
      'border-primary bg-primary/5 drag-active': isDragOver,
      'hover:bg-muted/30': !isDragOver 
    }"
    @drop="handleDrop"
    @dragover.prevent="isDragOver = true"
    @dragleave="isDragOver = false"
    @dragenter.prevent
  >
    <input
      ref="fileInput"
      type="file"
      accept=".xlsx,.xls"
      class="hidden"
      @change="handleFileSelect"
    >
    
    <div class="flex flex-col items-center gap-4">
      <Upload class="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
      
      <div class="space-y-2">
        <p class="text-base sm:text-lg font-medium text-foreground">
          拖拽Excel文件到这里，或者
          <button 
            @click="handleClick"
            class="text-primary hover:text-primary/80 underline underline-offset-4 touch-manipulation"
          >
            点击选择文件
          </button>
        </p>
        <p class="text-sm text-muted-foreground">
          支持 .xlsx 和 .xls 格式
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Upload } from 'lucide-vue-next';

const emit = defineEmits<{
  fileSelected: [file: File];
  error: [message: string];
}>();

const isDragOver = ref(false);
const fileInput = ref<HTMLInputElement>();

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
  
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    validateAndEmitFile(file);
  }
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    const file = files[0];
    validateAndEmitFile(file);
  }
};

const handleClick = () => {
  fileInput.value?.click();
};

const validateAndEmitFile = (file: File) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    emit('error', '请选择Excel文件（.xlsx或.xls格式）');
    return;
  }
  
  // 检查文件大小（限制为10MB）
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    emit('error', '文件大小不能超过10MB');
    return;
  }
  
  emit('fileSelected', file);
};
</script>
