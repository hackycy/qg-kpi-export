<template>
  <div class="space-y-12">
    <div class="text-center space-y-4 max-w-2xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        关于 KPI 日报导出工具
      </h1>
      <p class="text-muted-foreground leading-relaxed text-sm sm:text-base">
        一个简单高效的 Excel 数据处理和日报生成工具，帮助你快速整理任务进展并输出规范化的日报内容。
      </p>
    </div>

    <div class="grid gap-6 md:gap-8 md:grid-cols-2">
      <div class="bg-card p-6 sm:p-8 rounded-xl border shadow-sm flex flex-col gap-4">
        <h2 class="text-xl font-semibold tracking-tight">主要功能</h2>
        <ul class="grid gap-2 text-sm text-muted-foreground">
          <li class="flex items-start gap-2">
            <span class="mt-1 size-1.5 rounded-full bg-primary"></span>Excel 文件解析和数据提取
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1 size-1.5 rounded-full bg-primary"></span>按负责人和月份筛选数据
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1 size-1.5 rounded-full bg-primary"></span>自动生成日报格式
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1 size-1.5 rounded-full bg-primary"></span>一键复制功能
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1 size-1.5 rounded-full bg-primary"></span>响应式设计，支持移动端
          </li>
        </ul>
      </div>

      <div class="bg-card p-6 sm:p-8 rounded-xl border shadow-sm flex flex-col gap-4">
        <h2 class="text-xl font-semibold tracking-tight">技术栈</h2>
        <ul class="grid gap-2 text-sm text-muted-foreground">
          <li class="flex items-start gap-2">
            <span class="mt-1 size-1.5 rounded-full bg-primary"></span>Vue 3 + TypeScript
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1 size-1.5 rounded-full bg-primary"></span>Tailwind CSS v4
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1 size-1.5 rounded-full bg-primary"></span>Vue Router
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1 size-1.5 rounded-full bg-primary"></span>Pinia 状态管理
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-1 size-1.5 rounded-full bg-primary"></span>Vite 构建工具
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
