import { ref, computed } from 'vue';
import { useClipboard } from '@vueuse/core';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import type { ExcelRow, MonthlyReport } from '@/types';

// 简单的通知函数
const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
  `;

  // 添加动画样式
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  // 3秒后移除通知
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
};

export function useExcelParser() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const excelData = ref<ExcelRow[]>([]);
  const selectedResponsible = ref<string>('');
  const selectedMonth = ref<string>('');

  // 使用 VueUse 的剪切板功能
  const { copy, isSupported } = useClipboard();

  // 获取所有负责人列表
  const responsibleList = computed(() => {
    const uniqueResponsible = new Set(excelData.value.map(row => row.responsible));
    return Array.from(uniqueResponsible).sort();
  });

  // 获取所有月份列表
  const monthList = computed(() => {
    const uniqueMonths = new Set(
      excelData.value.map(row => dayjs(row.endDate).format('YYYY-MM'))
    );
    return Array.from(uniqueMonths).sort();
  });

  // 过滤后的数据
  const filteredData = computed(() => {
    return excelData.value.filter(row => {
      const matchResponsible = !selectedResponsible.value || row.responsible === selectedResponsible.value;
      const matchMonth = !selectedMonth.value || dayjs(row.endDate).format('YYYY-MM') === selectedMonth.value;
      return matchResponsible && matchMonth;
    });
  });

  // 按日期分组的报告数据
  const monthlyReport = computed((): MonthlyReport => {
    const grouped: MonthlyReport = {};

    filteredData.value.forEach(row => {
      const dateKey = dayjs(row.endDate).format('YYYY-MM-DD');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(row.ticketSystem);
    });

    return grouped;
  });

  // 格式化的日报数据
  const formattedReports = computed(() => {
    const reports: Array<{ date: string, displayDate: string, content: string[] }> = [];

    Object.entries(monthlyReport.value)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([date, content]) => {
        const displayDate = dayjs(date).format('M月D日');
        reports.push({
          date,
          displayDate,
          content
        });
      });

    return reports;
  });

  // 解析Excel文件
  const parseExcel = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 检查文件类型
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];

      if (!allowedTypes.includes(file.type)) {
        const errorMsg = '请选择Excel文件（.xlsx或.xls格式）';
        error.value = errorMsg;
        reject(new Error(errorMsg));
        return;
      }

      isLoading.value = true;
      error.value = null;

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          if (!data) {
            throw new Error('文件读取失败');
          }

          const workbook = XLSX.read(data, { type: 'array' });

          // 查找"任务拆解"sheet
          const sheetName = workbook.SheetNames.find(name => name === '任务拆解');
          if (!sheetName) {
            throw new Error('未找到"任务拆解"工作表');
          }

          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

          if (jsonData.length < 2) {
            throw new Error('工作表数据不足');
          }

          // 获取表头
          const headers = jsonData[0];

          // 查找必需列的索引
          const requiredColumns = {
            '票务系统': headers.findIndex(h => h === '票务系统'),
            '负责人': headers.findIndex(h => h === '负责人'),
            '计划结束日期': headers.findIndex(h => h === '计划结束日期'),
            '进展': headers.findIndex(h => h === '进展')
          };

          // 检查是否所有必需列都存在
          const missingColumns = Object.entries(requiredColumns)
            .filter(([, index]) => index === -1)
            .map(([name]) => name);

          if (missingColumns.length > 0) {
            throw new Error(`缺少必需列: ${missingColumns.join(', ')}`);
          }

          // 处理数据行
          const processedData: ExcelRow[] = [];

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];

            // 提取必需字段
            const ticketSystem = row[requiredColumns['票务系统']];
            const responsible = row[requiredColumns['负责人']];
            const endDate = row[requiredColumns['计划结束日期']];
            const progress = row[requiredColumns['进展']];

            // 检查是否所有必需字段都存在
            if (!ticketSystem || !responsible || !endDate || !progress) {
              continue; // 跳过缺失字段的行
            }

            // 解析日期
            let parsedDate: Date | null = null;
            if (endDate) {
              // 处理多种日期格式
              const dateStr = endDate.toString();
              // 支持格式：2025-08-01 20:22 或 2025/8/1 20:22:00
              const dateMatch = dateStr.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
              if (dateMatch) {
                const [, year, month, day] = dateMatch;
                parsedDate = new Date(
                  parseInt(year),
                  parseInt(month) - 1, // 月份从0开始
                  parseInt(day)
                );
              }
            }

            if (parsedDate && !isNaN(parsedDate.getTime())) {
              processedData.push({
                ticketSystem: String(ticketSystem),
                responsible: String(responsible),
                endDate: parsedDate,
                progress: String(progress),
                originalRow: i + 1
              });
            }
          }

          excelData.value = processedData;

          // 自动选择第一个负责人和月份
          if (responsibleList.value.length > 0) {
            selectedResponsible.value = responsibleList.value[0];
          }
          if (monthList.value.length > 0) {
            selectedMonth.value = monthList.value[0];
          }

          isLoading.value = false;
          resolve();

        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : '解析Excel文件时出错';
          error.value = errorMsg;
          isLoading.value = false;
          reject(new Error(errorMsg));
        }
      };

      reader.onerror = () => {
        const errorMsg = '读取文件时出错';
        error.value = errorMsg;
        isLoading.value = false;
        reject(new Error(errorMsg));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  // 复制单天内容
  const copySingleDay = async (content: string[], displayDate: string) => {
    const text = `${displayDate}\n${content.join('\n')}`;

    try {
      if (isSupported.value) {
        await copy(text);
        showNotification('已复制到剪贴板');
      } else {
        // 降级处理：使用传统的复制方法
        await navigator.clipboard.writeText(text);
        showNotification('已复制到剪贴板');
      }
    } catch (err) {
      console.error('复制失败:', err);
      // 最后的降级方案：创建一个临时的 textarea 元素
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('已复制到剪贴板');
      } catch (fallbackErr) {
        console.error('降级复制也失败:', fallbackErr);
        showNotification('复制失败，请手动复制', 'error');
      }
    }
  };

  // 复制全月内容
  const copyAllDays = async () => {
    const allText = formattedReports.value
      .map(report => `${report.displayDate}\n${report.content.join('\n')}`)
      .join('\n\n');

    try {
      if (isSupported.value) {
        await copy(allText);
        showNotification('已复制到剪贴板');
      } else {
        // 降级处理：使用传统的复制方法
        await navigator.clipboard.writeText(allText);
        showNotification('已复制到剪贴板');
      }
    } catch (err) {
      console.error('复制失败:', err);
      // 最后的降级方案：创建一个临时的 textarea 元素
      try {
        const textArea = document.createElement('textarea');
        textArea.value = allText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('已复制到剪贴板');
      } catch (fallbackErr) {
        console.error('降级复制也失败:', fallbackErr);
        showNotification('复制失败，请手动复制', 'error');
      }
    }
  };

  // 重置数据
  const reset = () => {
    excelData.value = [];
    selectedResponsible.value = '';
    selectedMonth.value = '';
    error.value = null;
    isLoading.value = false;
  };

  return {
    isLoading,
    error,
    excelData,
    selectedResponsible,
    selectedMonth,
    responsibleList,
    monthList,
    filteredData,
    monthlyReport,
    formattedReports,
    parseExcel,
    copySingleDay,
    copyAllDays,
    reset
  };
}
