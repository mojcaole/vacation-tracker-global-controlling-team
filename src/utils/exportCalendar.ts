import { HOLIDAYS_2026, YEAR, MONTHS } from "@/data/holidays";
import { format } from "date-fns";
import XLSX from "xlsx-js-style";

type VacationChecker = (dateStr: string, memberIndex: number) => boolean;

// Color definitions matching the web design
const COLORS = {
  headerBg: "1A1A1A", // --header-bg: 0 0% 10%
  headerText: "FFFFFF",
  weekend: "F2F2F2", // --weekend: 0 0% 95%
  holiday: "FF6600", // --primary: 22 100% 50% (International Orange)
  holidayText: "FFFFFF",
  vacation: "0047AB", // --secondary: 214 100% 33% (Cobalt Blue)
  vacationText: "FFFFFF",
  border: "E5E5E5", // --border: 0 0% 90%
  background: "FAFAFA", // --background: 0 0% 98%
};

const borderStyle = {
  top: { style: "thin", color: { rgb: COLORS.border } },
  bottom: { style: "thin", color: { rgb: COLORS.border } },
  left: { style: "thin", color: { rgb: COLORS.border } },
  right: { style: "thin", color: { rgb: COLORS.border } },
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function exportToExcel(
  teamMembers: string[],
  hasVacation: VacationChecker
): void {
  const workbook = XLSX.utils.book_new();

  // Create a sheet for each month
  MONTHS.forEach((monthName, monthIndex) => {
    const rows: any[][] = [];
    const daysInMonth = getDaysInMonth(YEAR, monthIndex);

    // Header row
    const headerRow = ["Date", "Day", ...teamMembers];
    rows.push(headerRow);

    // Day rows
    for (let day = 1; day <= daysInMonth; day++) {
      const m = String(monthIndex + 1).padStart(2, "0");
      const d = String(day).padStart(2, "0");
      const dateStr = `${YEAR}-${m}-${d}`;
      const date = new Date(YEAR, monthIndex, day);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const holidayName = HOLIDAYS_2026[dateStr];
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      const dateCell = holidayName
        ? `${String(day).padStart(2, "0")} ${dayNames[dayOfWeek]} (${holidayName})`
        : `${String(day).padStart(2, "0")}`;

      const row = [dateCell, dayNames[dayOfWeek]];

      teamMembers.forEach((_, memberIdx) => {
        if (holidayName || isWeekend) {
          row.push("");
        } else {
          row.push(hasVacation(dateStr, memberIdx) ? "●" : "");
        }
      });

      rows.push(row);
    }

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(rows);

    // Apply styles
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) {
          worksheet[cellAddress] = { v: "", t: "s" };
        }
        const cell = worksheet[cellAddress];

        // Header row styling
        if (R === 0) {
          cell.s = {
            fill: { fgColor: { rgb: COLORS.headerBg } },
            font: { bold: true, color: { rgb: COLORS.headerText }, sz: 11 },
            alignment: { horizontal: "center", vertical: "center" },
            border: borderStyle,
          };
        } else {
          // Data rows
          const day = R; // Row 1 = Day 1
          const m = String(monthIndex + 1).padStart(2, "0");
          const d = String(day).padStart(2, "0");
          const dateStr = `${YEAR}-${m}-${d}`;
          const date = new Date(YEAR, monthIndex, day);
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const isHoliday = !!HOLIDAYS_2026[dateStr];

          // Date column (C === 0) or Day column (C === 1)
          if (C <= 1) {
            if (isHoliday) {
              cell.s = {
                fill: { fgColor: { rgb: COLORS.holiday } },
                font: { bold: true, color: { rgb: COLORS.holidayText }, sz: 10 },
                alignment: { horizontal: C === 0 ? "left" : "center", vertical: "center" },
                border: borderStyle,
              };
            } else if (isWeekend) {
              cell.s = {
                fill: { fgColor: { rgb: COLORS.weekend } },
                font: { color: { rgb: "666666" }, sz: 10 },
                alignment: { horizontal: C === 0 ? "left" : "center", vertical: "center" },
                border: borderStyle,
              };
            } else {
              cell.s = {
                fill: { fgColor: { rgb: COLORS.background } },
                font: { sz: 10 },
                alignment: { horizontal: C === 0 ? "left" : "center", vertical: "center" },
                border: borderStyle,
              };
            }
          } else {
            // Team member columns
            const memberIdx = C - 2;
            const isVacation = hasVacation(dateStr, memberIdx);

            if (isHoliday) {
              cell.s = {
                fill: { fgColor: { rgb: "FFE5CC" } }, // Light orange for holiday
                alignment: { horizontal: "center", vertical: "center" },
                border: borderStyle,
              };
            } else if (isWeekend) {
              cell.s = {
                fill: { fgColor: { rgb: COLORS.weekend } },
                alignment: { horizontal: "center", vertical: "center" },
                border: borderStyle,
              };
            } else if (isVacation) {
              cell.s = {
                fill: { fgColor: { rgb: COLORS.vacation } },
                font: { color: { rgb: COLORS.vacationText }, sz: 12 },
                alignment: { horizontal: "center", vertical: "center" },
                border: borderStyle,
              };
            } else {
              cell.s = {
                fill: { fgColor: { rgb: COLORS.background } },
                alignment: { horizontal: "center", vertical: "center" },
                border: borderStyle,
              };
            }
          }
        }
      }
    }

    // Set column widths
    worksheet["!cols"] = [
      { wch: 25 }, // Date column
      { wch: 6 }, // Day column
      ...teamMembers.map(() => ({ wch: 15 })), // Team member columns
    ];

    // Set row heights
    worksheet["!rows"] = rows.map((_, idx) => ({
      hpt: idx === 0 ? 24 : 20,
    }));

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, monthName.slice(0, 3));
  });

  // Download
  XLSX.writeFile(workbook, `vacation_tracker_${YEAR}.xlsx`);
}
