<script setup lang="ts">
import { useExcelParser } from '@/composables/useExcelParser';
import FileUpload from '@/components/FileUpload.vue';
import ReportDisplay from '@/components/ReportDisplay.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

const handleFileError = (message: string) => {
  // 这里可以设置一个临时错误状态，或者使用toast通知
  console.error('文件错误:', message);
};

const handleReset = () => {
  reset();
};
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 头部 -->
    <header class="bg-card border-b border-border sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl sm:text-2xl font-bold text-foreground">KPI日报导出工具</h1>
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
    </header>

    <!-- 主要内容 -->
    <main class="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <!-- 错误提示 -->
      <Alert v-if="error" variant="destructive">
        <AlertTitle>解析错误</AlertTitle>
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <!-- 文件上传区域 -->
      <div v-if="excelData.length === 0" class="max-w-2xl mx-auto space-y-6">
        <FileUpload 
          @file-selected="handleFileSelected" 
          @error="handleFileError"
        />
        
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">使用说明</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="text-sm text-muted-foreground space-y-2">
              <p>1. 请上传包含"任务拆解"工作表的Excel文件</p>
              <p>2. 工作表需包含以下列：票务系统、负责人、计划结束日期、进展</p>
              <p>3. 支持的日期格式：2025-08-01 20:22 或 2025/8/1 20:22:00</p>
              <p>4. 选择负责人和月份后，将显示该月份的日报数据</p>
              <p>5. 可以单独复制每天的日报，也可以一次性复制整月日报</p>
            </div>
          </CardContent>
        </Card>
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
