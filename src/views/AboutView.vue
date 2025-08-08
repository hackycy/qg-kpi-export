<template>
  <div class="space-y-14">
    <!-- Hero -->
    <section
      class="relative overflow-hidden rounded-2xl border bg-card/60 backdrop-blur p-10 md:p-14 shadow-sm"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,theme(colors.primary/20),transparent_60%)] pointer-events-none"
      />
      <div class="relative max-w-3xl">
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
          关于 KPI 日报导出工具
        </h1>
        <p class="text-muted-foreground leading-relaxed text-sm md:text-base max-w-2xl">
          一个轻量、快速、可扩展的 Excel 日报提取与格式化工具。通过结构化解析、筛选与一键复制 /
          导出能力，帮助团队高效输出规范日报内容。
        </p>
        <div class="!mt-8 flex flex-wrap gap-3 text-xs">
          <span
            class="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
            >Vue 3</span
          >
          <span
            class="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
            >TypeScript</span
          >
          <span
            class="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
            >Tailwind</span
          >
          <span
            class="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
            >Pinia</span
          >
          <span
            class="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20"
            >Reka UI</span
          >
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
