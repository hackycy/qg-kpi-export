<script setup lang="ts">
import { useExcelParser } from '@/composables/useExcelParser';
import FileUpload from '@/components/FileUpload.vue';
import ReportDisplay from '@/components/ReportDisplay.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const {
  isLoading,
  error,
  excelData,
  selectedResponsible,
  selectedMonth,
  responsibleList,
  monthList,
  formattedReports,
  parseExcel,
  copySingleDay,
  copyAllDays,
  reset
} = useExcelParser();

const handleFileSelected = async (file: File) => {
  try {
    await parseExcel(file);
  } catch (err) {
    console.error('解析文件失败:', err);
  }
};

const handleReset = () => {
  reset();
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 头部 -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">KPI日报导出工具</h1>
          <button
            v-if="excelData.length > 0"
            @click="handleReset"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            重新上传
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 错误提示 -->
      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              解析错误
            </h3>
            <div class="mt-2 text-sm text-red-700">
              {{ error }}
            </div>
          </div>
        </div>
      </div>

      <!-- 文件上传区域 -->
      <div v-if="excelData.length === 0" class="max-w-2xl mx-auto">
        <FileUpload @file-selected="handleFileSelected" />
        
        <div class="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">使用说明</h2>
          <div class="space-y-3 text-sm text-gray-600">
            <p>1. 请上传包含"任务拆解"工作表的Excel文件</p>
            <p>2. 工作表需包含以下列：票务系统、负责人、计划结束日期、进展</p>
            <p>3. 支持的日期格式：2025-08-01 20:22 或 2025/8/1 20:22:00</p>
            <p>4. 选择负责人和月份后，将显示该月份的日报数据</p>
            <p>5. 可以单独复制每天的日报，也可以一次性复制整月日报</p>
          </div>
        </div>
      </div>

      <!-- 报告显示区域 -->
      <div v-else>
        <ReportDisplay
          :formatted-reports="formattedReports"
          :responsible-list="responsibleList"
          :month-list="monthList"
          :selected-responsible="selectedResponsible"
          :selected-month="selectedMonth"
          @update:selected-responsible="selectedResponsible = $event"
          @update:selected-month="selectedMonth = $event"
          @copy-single-day="copySingleDay"
          @copy-all-days="copyAllDays"
        />
      </div>
    </main>

    <!-- 加载提示 -->
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>

<style scoped>
/* 可以在这里添加任何特定的样式 */
</style>
