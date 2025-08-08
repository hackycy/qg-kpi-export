<template>
  <div class="space-y-10">
    <!-- 筛选器 -->
    <Card class="shadow-sm border border-border/70 relative overflow-hidden">
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,theme(colors.primary/5),transparent_65%)]"
      />
      <CardContent class="relative p-5 sm:p-7 space-y-6">
        <div class="flex flex-wrap items-center gap-4 text-xs text-muted-foreground/80">
          <span class="inline-flex items-center gap-1"
            ><span class="size-1.5 rounded-full bg-primary"></span>条件筛选</span
          >
          <span class="hidden sm:inline text-border/60">|</span>
          <span class="inline-flex items-center gap-1">负责人数：{{ responsibleList.length }}</span>
          <span class="inline-flex items-center gap-1">可选月份：{{ monthList.length }}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- 负责人 -->
          <div class="flex flex-col gap-2 relative">
            <label class="text-[13px] font-medium text-muted-foreground tracking-wide uppercase"
              >负责人</label
            >
            <div class="relative group">
              <select
                v-model="selectedResponsible"
                class="peer w-full h-11 rounded-lg border border-input bg-background/60 backdrop-blur px-3 pr-9 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all disabled:cursor-not-allowed disabled:opacity-50 appearance-none shadow-[0_1px_0_0_rgba(0,0,0,0.04)] focus:shadow-[0_0_0_1px_hsl(var(--ring))]"
              >
                <option value="">全部负责人</option>
                <option
                  v-for="responsible in responsibleList"
                  :key="responsible"
                  :value="responsible"
                >
                  {{ responsible }}
                </option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground group-focus-within:text-foreground/80 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
            <p class="text-[11px] text-muted-foreground/70">选择要查看的负责人（为空表示全部）</p>
          </div>
          <!-- 月份 -->
          <div class="flex flex-col gap-2 relative">
            <label class="text-[13px] font-medium text-muted-foreground tracking-wide uppercase"
              >月份</label
            >
            <div class="relative group">
              <select
                v-model="selectedMonth"
                class="peer w-full h-11 rounded-lg border border-input bg-background/60 backdrop-blur px-3 pr-9 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all disabled:cursor-not-allowed disabled:opacity-50 appearance-none shadow-[0_1px_0_0_rgba(0,0,0,0.04)] focus:shadow-[0_0_0_1px_hsl(var(--ring))]"
              >
                <option value="">全部月份</option>
                <option v-for="month in monthList" :key="month" :value="month">
                  {{ formatMonth(month) }}
                </option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground group-focus-within:text-foreground/80 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
            <p class="text-[11px] text-muted-foreground/70">按计划结束日期所在月份聚合</p>
          </div>
          <!-- 操作 -->
          <div class="flex flex-col gap-2 md:pt-6">
            <div class="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                size="sm"
                class="h-11 rounded-lg font-medium gap-2 justify-center shadow-sm hover:shadow-md transition-shadow w-full md:w-auto"
                @click="copyAllDays"
                :disabled="!formattedReports.length"
              >
                <Copy class="w-4 h-4" />
                复制全部
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="h-11 rounded-lg font-medium gap-2 justify-center w-full md:w-auto"
                @click="exportPlain"
                :disabled="!formattedReports.length"
              >
                TXT
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="h-11 rounded-lg font-medium gap-2 justify-center w-full md:w-auto"
                @click="exportMarkdown"
                :disabled="!formattedReports.length"
              >
                MD
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 统计信息 -->
    <Card
      v-if="formattedReports.length > 0"
      class="relative overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 !my-4"
    >
      <div
        class="absolute -inset-px bg-[linear-gradient(120deg,theme(colors.primary/40),transparent_35%,transparent_65%,theme(colors.primary/40))] opacity-20 pointer-events-none"
      />
      <CardContent class="relative p-5 sm:p-7">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div class="flex flex-wrap items-center gap-3 text-sm">
            <div
              class="inline-flex items-center gap-2 rounded-md bg-background/70 backdrop-blur px-3 py-1.5 border border-border/60"
            >
              <span class="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
                >天数</span
              >
              <span class="text-foreground font-medium">{{ formattedReports.length }}</span>
            </div>
            <div
              class="inline-flex items-center gap-2 rounded-md bg-background/70 backdrop-blur px-3 py-1.5 border border-border/60"
            >
              <span class="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
                >任务条数</span
              >
              <span class="text-foreground font-medium">{{ totalReports }}</span>
            </div>
            <div
              v-if="selectedResponsible"
              class="inline-flex items-center gap-2 rounded-md bg-background/70 backdrop-blur px-3 py-1.5 border border-border/60"
            >
              <span class="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
                >负责人</span
              >
              <span class="text-foreground font-medium">{{ selectedResponsible }}</span>
            </div>
            <div
              v-if="selectedMonth"
              class="inline-flex items-center gap-2 rounded-md bg-background/70 backdrop-blur px-3 py-1.5 border border-border/60"
            >
              <span class="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
                >月份</span
              >
              <span class="text-foreground font-medium">{{ formatMonth(selectedMonth) }}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Button @click="copyAllDays" size="sm" variant="outline" class="gap-2">
              <Copy class="w-4 h-4" />复制全部
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 日报列表 -->
    <div
      v-if="formattedReports.length > 0"
      class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
    >
      <Card
        v-for="report in formattedReports"
        :key="report.date"
        class="group hover:shadow-md transition-all duration-300 border border-border/60 hover:border-primary/30 relative overflow-hidden"
      >
        <div
          class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity"
        />
        <CardHeader class="pb-4">
          <div class="flex items-center justify-between">
            <CardTitle class="text-base font-semibold text-foreground tracking-tight">
              {{ report.displayDate }}
            </CardTitle>
            <Button
              @click="copySingleDay(report.content, report.displayDate)"
              variant="outline"
              size="sm"
              class="h-8 px-3"
            >
              <Copy class="w-3 h-3" />
              <span class="ml-1">复制</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="space-y-3">
            <div
              v-for="(content, index) in report.content"
              :key="index"
              class="daily-report-item text-sm leading-relaxed text-foreground bg-muted/40 px-4 py-3 rounded-md border border-border/60 shadow-xs hover:shadow-sm transition-all duration-200 relative"
            >
              <span class="inline-block">{{ content }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 空状态 -->
    <Card v-else class="text-center py-14 shadow-sm border-dashed border-2 border-border/60">
      <CardContent>
        <Calendar class="w-14 h-14 mx-auto mb-4 text-muted-foreground/40" />
        <CardTitle class="text-lg mb-2 text-muted-foreground font-medium tracking-tight"
          >暂无日报数据</CardTitle
        >
        <p class="text-sm text-muted-foreground">请选择负责人和月份查看日报</p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Copy, Calendar } from 'lucide-vue-next'
import dayjs from 'dayjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { saveAs } from 'file-saver'

interface Props {
  formattedReports: Array<{
    date: string
    displayDate: string
    content: string[]
  }>
  responsibleList: string[]
  monthList: string[]
  selectedResponsible: string
  selectedMonth: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:selectedResponsible': [value: string]
  'update:selectedMonth': [value: string]
  copySingleDay: [content: string[], displayDate: string]
  copyAllDays: []
}>()

const selectedResponsible = computed({
  get: () => props.selectedResponsible,
  set: (value) => emit('update:selectedResponsible', value),
})

const selectedMonth = computed({
  get: () => props.selectedMonth,
  set: (value) => emit('update:selectedMonth', value),
})

const totalReports = computed(() => {
  return props.formattedReports.reduce((total, report) => {
    return total + report.content.length
  }, 0)
})

const getLastMonth = () => {
  return dayjs().subtract(1, 'month').format('YYYY-MM')
}

onMounted(() => {
  const lastMonth = getLastMonth()
  emit('update:selectedMonth', lastMonth)
})

const formatMonth = (month: string) => {
  return dayjs(month + '-01').format('YYYY年M月')
}

const copySingleDay = (content: string[], displayDate: string) => {
  emit('copySingleDay', content, displayDate)
}

const copyAllDays = () => {
  emit('copyAllDays')
}

// 导出为纯文本
const exportPlain = () => {
  if (!props.formattedReports.length) return
  const content = props.formattedReports
    .map((r) => `${r.displayDate}\n${r.content.join('\n')}`)
    .join('\n\n')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const fileNameBase = selectedResponsible.value || '日报'
  saveAs(blob, `${fileNameBase}-${selectedMonth.value || '全部月份'}.txt`)
}

// 导出为 Markdown
const exportMarkdown = () => {
  if (!props.formattedReports.length) return
  const lines: string[] = []
  lines.push(
    `# 日报（${selectedResponsible.value || '全部负责人'} / ${selectedMonth.value || '全部月份'}）`,
  )
  props.formattedReports.forEach((report) => {
    lines.push(`\n## ${report.displayDate}`)
    report.content.forEach((item) => {
      lines.push(`- ${item}`)
    })
  })
  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' })
  const fileNameBase = selectedResponsible.value || '日报'
  saveAs(blob, `${fileNameBase}-${selectedMonth.value || '全部月份'}.md`)
}
</script>
