import { HOLIDAYS_2026, YEAR, MONTHS } from "@/data/holidays";
import { format } from "date-fns";

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

export function exportToCSV(
  teamMembers: string[],
  hasVacation: VacationChecker
): void {
  const days = getDaysInYear(YEAR);
  
  // Header row
  const headers = ["Date", "Day", "Holiday", ...teamMembers];
  const rows: string[][] = [headers];
  
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
  
  // Convert to CSV string
  const csvContent = rows
    .map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
  
  // Download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `vacation_tracker_${YEAR}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
