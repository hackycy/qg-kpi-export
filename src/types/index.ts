export interface ExcelRow {
  ticketSystem: string;
  responsible: string;
  endDate: Date;
  progress: string;
  originalRow: number;
}

export interface DailyReport {
  date: string; // YYYY-MM-DD 格式
  content: string[];
}

export interface MonthlyReport {
  [date: string]: string[];
}
