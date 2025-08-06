<template>
  <div class="space-y-6">
    <!-- 筛选器 -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            负责人
          </label>
          <select
            v-model="selectedResponsible"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label class="block text-sm font-medium text-gray-700 mb-2">
            月份
          </label>
          <select
            v-model="selectedMonth"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </div>

    <!-- 统计信息 -->
    <div v-if="formattedReports.length > 0" class="bg-blue-50 p-4 rounded-lg">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="text-sm text-blue-700">
          共找到 {{ formattedReports.length }} 天的日报记录，
          总计 {{ totalReports }} 条任务
        </div>
        <button
          @click="copyAllDays"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Copy class="w-4 h-4" />
          复制全部
        </button>
      </div>
    </div>

    <!-- 日报列表 -->
    <div v-if="formattedReports.length > 0" class="space-y-4">
      <div
        v-for="report in formattedReports"
        :key="report.date"
        class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-800">
            {{ report.displayDate }}
          </h3>
          <button
            @click="copySingleDay(report.content, report.displayDate)"
            class="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
          >
            <Copy class="w-3 h-3" />
            复制
          </button>
        </div>
        
        <div class="space-y-2">
          <div
            v-for="(content, index) in report.content"
            :key="index"
            class="text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-400"
          >
            {{ content }}
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12 text-gray-500">
      <Calendar class="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <p class="text-lg">暂无日报数据</p>
      <p class="text-sm">请选择负责人和月份查看日报</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Copy, Calendar } from 'lucide-vue-next';
import dayjs from 'dayjs';

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
