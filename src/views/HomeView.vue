<script setup lang="ts">
import { useExcelParser } from '@/composables/useExcelParser'
import FileUpload from '@/components/FileUpload.vue'
import ReportDisplay from '@/components/ReportDisplay.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
} = useExcelParser()

const handleFileSelected = async (file: File) => {
  try {
    await parseExcel(file)
  } catch (err) {
    console.error('解析文件失败:', err)
  }
}

const handleFileError = (message: string) => {
  // 这里可以设置一个临时错误状态，或者使用toast通知
  console.error('文件错误:', message)
}
</script>

<template>
  <div class="space-y-8">
    <!-- 错误提示 -->
    <Alert v-if="error" variant="destructive" class="mb-8">
      <AlertTitle>解析错误</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <!-- 文件上传区域 -->
    <div v-if="excelData.length === 0" class="flex justify-center">
      <div class="w-full max-w-4xl space-y-8">
        <FileUpload @file-selected="handleFileSelected" @error="handleFileError" />

        <Card class="shadow-sm">
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
    </div>

    <!-- 报告显示区域 -->
    <div v-else class="space-y-8">
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

    <!-- 加载提示 -->
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>
