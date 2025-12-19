import { HOLIDAYS_2026, YEAR } from "@/data/holidays";
import { format } from "date-fns";
import * as XLSX from "xlsx";

type VacationChecker = (dateStr: string, memberIndex: number) => boolean;

function getDaysInYear(year: number): Date[] {
  const days: Date[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
}

export function exportToExcel(
  teamMembers: string[],
  hasVacation: VacationChecker
): void {
  const days = getDaysInYear(YEAR);
  
  // Header row
  const headers = ["Date", "Day", "Holiday", ...teamMembers];
  const rows: (string | number)[][] = [headers];
  
  days.forEach((date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayName = format(date, "EEE");
    const holiday = HOLIDAYS_2026[dateStr] || "";
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    const memberVacations = teamMembers.map((_, idx) => {
      if (HOLIDAYS_2026[dateStr] || isWeekend) return "";
      return hasVacation(dateStr, idx) ? "VACATION" : "";
    });
    
    rows.push([
      format(date, "yyyy-MM-dd"),
      dayName,
      holiday,
      ...memberVacations,
    ]);
  });
  
  // Create workbook and worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Vacations");
  
  // Auto-size columns
  const colWidths = headers.map((h, i) => ({
    wch: Math.max(h.length, i === 0 ? 12 : i === 2 ? 20 : 15)
  }));
  worksheet["!cols"] = colWidths;
  
  // Download
  XLSX.writeFile(workbook, `vacation_tracker_${YEAR}.xlsx`);
}
