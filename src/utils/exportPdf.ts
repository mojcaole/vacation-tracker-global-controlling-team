import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { HOLIDAYS_2026, YEAR, MONTHS } from "@/data/holidays";

type VacationChecker = (dateStr: string, memberIndex: number) => boolean;

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function exportToPdf(
  teamMembers: string[],
  hasVacation: VacationChecker,
  getMemberColorRgb?: (memberIndex: number) => [number, number, number]
): void {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  MONTHS.forEach((monthName, monthIndex) => {
    if (monthIndex > 0) doc.addPage();

    const daysInMonth = getDaysInMonth(YEAR, monthIndex);

    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${monthName} ${YEAR} — Vacation Tracker`, 14, 14);

    const head = [["Date", "Day", ...teamMembers]];
    const body: (string | { content: string; styles: object })[][] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const m = String(monthIndex + 1).padStart(2, "0");
      const d = String(day).padStart(2, "0");
      const dateStr = `${YEAR}-${m}-${d}`;
      const date = new Date(YEAR, monthIndex, day);
      const dow = date.getDay();
      const isWeekend = dow === 0 || dow === 6;
      const holidayName = HOLIDAYS_2026[dateStr];

      const dateLabel = holidayName
        ? `${d} ${DAY_NAMES[dow]} (${holidayName})`
        : `${d} ${DAY_NAMES[dow]}`;

      const rowStyles: { fillColor?: [number, number, number] } = {};
      if (holidayName) {
        rowStyles.fillColor = [255, 102, 0];
      } else if (isWeekend) {
        rowStyles.fillColor = [235, 235, 235];
      }

      const row: (string | { content: string; styles: object })[] = [
        { content: dateLabel, styles: { ...rowStyles, ...(holidayName ? { textColor: [255, 255, 255] } : {}) } },
        { content: DAY_NAMES[dow], styles: { ...rowStyles, halign: "center" as const, ...(holidayName ? { textColor: [255, 255, 255] } : {}) } },
      ];

      teamMembers.forEach((_, memberIdx) => {
        if (holidayName || isWeekend) {
          row.push({ content: "", styles: rowStyles });
        } else {
          const isVac = hasVacation(dateStr, memberIdx);
          const rgb = getMemberColorRgb ? getMemberColorRgb(memberIdx) : [0, 71, 171] as [number, number, number];
          row.push({
            content: isVac ? "●" : "",
            styles: isVac
              ? { fillColor: rgb, textColor: [255, 255, 255], halign: "center" as const }
              : { halign: "center" as const },
          });
        }
      });

      body.push(row);
    }

    autoTable(doc, {
      startY: 18,
      head,
      body,
      theme: "grid",
      headStyles: {
        fillColor: [26, 26, 26],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        fontSize: 7,
      },
      styles: { fontSize: 6.5, cellPadding: 1.2 },
      columnStyles: {
        0: { cellWidth: 38 },
        1: { cellWidth: 10, halign: "center" },
      },
      margin: { left: 8, right: 8 },
    });
  });

  // Yearly Summary Page
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Yearly Summary ${YEAR} — Vacation Tracker`, 14, 14);

  const summaryHead = [["Team Member", ...MONTHS.map(m => m.substring(0, 3)), "Total"]];
  const summaryBody: { content: string; styles: object }[][] = [];

  teamMembers.forEach((member, memberIdx) => {
    const rgb = getMemberColorRgb ? getMemberColorRgb(memberIdx) : [0, 71, 171] as [number, number, number];
    const monthlyCounts: number[] = [];

    MONTHS.forEach((_, monthIndex) => {
      const daysInMonth = getDaysInMonth(YEAR, monthIndex);
      let count = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const m = String(monthIndex + 1).padStart(2, "0");
        const d = String(day).padStart(2, "0");
        if (hasVacation(`${YEAR}-${m}-${d}`, memberIdx)) count++;
      }
      monthlyCounts.push(count);
    });

    const total = monthlyCounts.reduce((a, b) => a + b, 0);

    const row: { content: string; styles: object }[] = [
      { content: member, styles: { fillColor: rgb, textColor: [255, 255, 255], fontStyle: "bold" } },
      ...monthlyCounts.map(c => ({
        content: c > 0 ? String(c) : "–",
        styles: { halign: "center" as const, ...(c > 0 ? { fontStyle: "bold" as const } : {}) },
      })),
      { content: String(total), styles: { halign: "center" as const, fontStyle: "bold" as const, fillColor: rgb, textColor: [255, 255, 255] } },
    ];

    summaryBody.push(row);
  });

  autoTable(doc, {
    startY: 22,
    head: summaryHead,
    body: summaryBody,
    theme: "grid",
    headStyles: {
      fillColor: [26, 26, 26],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      fontSize: 8,
    },
    styles: { fontSize: 8, cellPadding: 2.5 },
    columnStyles: { 0: { cellWidth: 40 } },
    margin: { left: 14, right: 14 },
  });

  doc.save(`vacation_tracker_${YEAR}.pdf`);
}
