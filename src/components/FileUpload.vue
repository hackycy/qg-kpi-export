<template>
  <div 
    class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
    :class="{ 'border-blue-500 bg-blue-50': isDragOver }"
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
      <Upload class="w-12 h-12 text-gray-400" />
      
      <div>
        <p class="text-lg font-medium text-gray-700 mb-2">
          拖拽Excel文件到这里，或者
          <button 
            @click="handleClick"
            class="text-blue-600 hover:text-blue-700 underline"
          >
            点击选择文件
          </button>
        </p>
        <p class="text-sm text-gray-500">
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
  fileSelected: [file: File]
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
    alert('请选择Excel文件（.xlsx或.xls格式）');
    return;
  }
  
  emit('fileSelected', file);
};
</script>
