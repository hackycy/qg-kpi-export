<template>
  <div class="space-y-6">
    <!-- 筛选器 -->
    <Card>
      <CardContent class="p-4 sm:p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              负责人
            </label>
            <select
              v-model="selectedResponsible"
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent touch-manipulation"
            >
              <option value="">请选择负责人</option>
              <option 
                v-for="responsible in responsibleList" 
                :key="responsible" 
                :value="responsible"
              >
                {{ responsible }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              月份
            </label>
            <select
              v-model="selectedMonth"
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent touch-manipulation"
            >
              <option value="">请选择月份</option>
              <option 
                v-for="month in monthList" 
                :key="month" 
                :value="month"
              >
                {{ formatMonth(month) }}
              </option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 统计信息 -->
    <Card v-if="formattedReports.length > 0" class="bg-primary/5">
      <CardContent class="p-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
            <span>共找到 {{ formattedReports.length }} 天的日报记录</span>
            <span class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">{{ totalReports }} 条任务</span>
          </div>
          <Button
            @click="copyAllDays"
            size="sm"
            class="flex items-center gap-2"
          >
            <Copy class="w-4 h-4" />
            复制全部
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- 日报列表 -->
    <div v-if="formattedReports.length > 0" class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card
        v-for="report in formattedReports"
        :key="report.date"
        class="report-card hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
      >
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <CardTitle class="text-lg font-semibold text-foreground">
              {{ report.displayDate }}
            </CardTitle>
            <Button
              @click="copySingleDay(report.content, report.displayDate)"
              variant="outline"
              size="sm"
              class="h-8 px-3"
            >
              <Copy class="w-3 h-3 mr-1" />
              复制
            </Button>
          </div>
        </CardHeader>
        
        <CardContent class="pt-0">
          <div class="space-y-4">
            <div
              v-for="(content, index) in report.content"
              :key="index"
              class="daily-report-item text-sm text-foreground bg-muted/30 p-4 rounded-md border-l-4 border-primary/60 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {{ content }}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 空状态 -->
    <Card v-else class="text-center py-12">
      <CardContent>
        <Calendar class="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
        <CardTitle class="text-lg mb-2 text-muted-foreground">暂无日报数据</CardTitle>
        <p class="text-sm text-muted-foreground">请选择负责人和月份查看日报</p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Copy, Calendar } from 'lucide-vue-next';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';

interface Props {
  formattedReports: Array<{ 
    date: string; 
    displayDate: string; 
    content: string[] 
  }>;
  responsibleList: string[];
  monthList: string[];
  selectedResponsible: string;
  selectedMonth: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:selectedResponsible': [value: string];
  'update:selectedMonth': [value: string];
  'copySingleDay': [content: string[], displayDate: string];
  'copyAllDays': [];
}>();

const selectedResponsible = computed({
  get: () => props.selectedResponsible,
  set: (value) => emit('update:selectedResponsible', value)
});

const selectedMonth = computed({
  get: () => props.selectedMonth,
  set: (value) => emit('update:selectedMonth', value)
});

const totalReports = computed(() => {
  return props.formattedReports.reduce((total, report) => {
    return total + report.content.length;
  }, 0);
});

const formatMonth = (month: string) => {
  return dayjs(month + '-01').format('YYYY年M月');
};

const copySingleDay = (content: string[], displayDate: string) => {
  emit('copySingleDay', content, displayDate);
};

const copyAllDays = () => {
  emit('copyAllDays');
};
</script>
