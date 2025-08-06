// Excel解析Web Worker
// 不使用CDN，而是在主线程传递XLSX库
let XLSX = null;

self.onmessage = function(e) {
  const { file, action, xlsx } = e.data;
  
  if (action === 'init' && xlsx) {
    XLSX = xlsx;
    self.postMessage({ success: true, message: 'Worker初始化完成' });
    return;
  }
  
  if (action === 'parse') {
    if (!XLSX) {
      self.postMessage({
        success: false,
        error: 'XLSX库未初始化'
      });
      return;
    }
    
    try {
      const reader = new FileReader();
      
      reader.onload = function(event) {
        try {
          const data = event.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          
          // 查找"任务拆解"sheet
          const sheetName = workbook.SheetNames.find(name => name === '任务拆解');
          if (!sheetName) {
            self.postMessage({
              success: false,
              error: '未找到"任务拆解"工作表'
            });
            return;
          }
          
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            self.postMessage({
              success: false,
              error: '工作表数据不足'
            });
            return;
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
            self.postMessage({
              success: false,
              error: `缺少必需列: ${missingColumns.join(', ')}`
            });
            return;
          }
          
          // 处理数据行
          const processedData = [];
          
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
            let parsedDate = null;
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
                ticketSystem,
                responsible,
                endDate: parsedDate.toISOString(),
                progress,
                originalRow: i + 1
              });
            }
          }
          
          self.postMessage({
            success: true,
            data: processedData
          });
          
        } catch (error) {
          self.postMessage({
            success: false,
            error: `解析Excel文件时出错: ${error.message}`
          });
        }
      };
      
      reader.onerror = function() {
        self.postMessage({
          success: false,
          error: '读取文件时出错'
        });
      };
      
      reader.readAsArrayBuffer(file);
      
    } catch (error) {
      self.postMessage({
        success: false,
        error: `处理文件时出错: ${error.message}`
      });
    }
  }
};
