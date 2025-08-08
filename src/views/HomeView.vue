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
  console.error('文件错误:', message)
}
</script>

<template>
  <div class="space-y-10">
    <!-- 错误提示 -->
    <Alert
      v-if="error"
      variant="destructive"
      class="animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <AlertTitle>解析错误</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <!-- 文件上传区域 -->
    <div v-if="excelData.length === 0" class="flex justify-center">
      <div class="w-full max-w-5xl space-y-10">
        <FileUpload @file-selected="handleFileSelected" @error="handleFileError" />

        <Card class="shadow-sm border border-border/60 !mt-4">
          <CardHeader>
            <CardTitle class="text-lg tracking-tight">使用说明</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 text-sm leading-relaxed">
            <ol class="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>请上传包含 "任务拆解" 工作表的 Excel 文件</li>
              <li>工作表需包含以下列：票务系统、负责人、计划结束日期、进展</li>
              <li>支持的日期格式：2025-08-01 20:22 或 2025/8/1 20:22:00</li>
              <li>选择负责人和月份后，将显示该月份的日报数据</li>
              <li>可以单独复制每天的日报，也可以一次性复制整月日报</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- 报告显示区域 -->
    <div v-else class="space-y-8 animate-in fade-in-50 duration-300">
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
