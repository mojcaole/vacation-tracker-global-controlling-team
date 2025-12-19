import { HOLIDAYS_2026, TEAM_MEMBERS, YEAR } from "@/data/holidays";
import { cn } from "@/lib/utils";

interface MonthCalendarProps {
  month: number; // 0-indexed
  monthName: string;
  hasVacation: (dateStr: string, memberIndex: number) => boolean;
  toggleVacation: (dateStr: string, memberIndex: number) => void;
}

const MonthCalendar = ({
  month,
  monthName,
  hasVacation,
  toggleVacation,
}: MonthCalendarProps) => {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const formatDateStr = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${YEAR}-${m}-${d}`;
  };

  const getDayInfo = (day: number) => {
    const date = new Date(YEAR, month, day);
    const dateStr = formatDateStr(day);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const holidayName = HOLIDAYS_2026[dateStr];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return {
      date,
      dateStr,
      isWeekend,
      isHoliday: !!holidayName,
      holidayName,
      dayName: dayNames[dayOfWeek],
    };
  };

  const daysInMonth = getDaysInMonth(YEAR, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="animate-fade-in">
      {/* Month Header */}
      <div className="bg-header-bg text-primary-foreground px-4 py-3 mb-0">
        <h2 className="text-lg font-bold uppercase tracking-widest">{monthName}</h2>
      </div>

      {/* Table Header */}
      <div className="swiss-grid overflow-x-auto">
        <div
          className="grid min-w-[700px]"
          style={{
            gridTemplateColumns: `minmax(180px, 1fr) repeat(${TEAM_MEMBERS.length}, minmax(100px, 1fr))`,
          }}
        >
          {/* Header Row */}
          <div className="bg-header-bg text-primary-foreground px-4 py-3 font-bold uppercase tracking-wider text-sm">
            Date
          </div>
          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className="bg-header-bg/90 text-primary-foreground px-2 py-3 font-semibold text-xs uppercase tracking-wider text-center truncate"
            >
              {member}
            </div>
          ))}

          {/* Day Rows */}
          {days.map((day) => {
            const { dateStr, isWeekend, isHoliday, holidayName, dayName } = getDayInfo(day);

            return (
              <>
                {/* Date Cell */}
                <div
                  key={`date-${dateStr}`}
                  className={cn(
                    "px-4 py-2 font-medium text-sm flex items-center gap-2 border-b border-border",
                    isHoliday && "bg-primary text-primary-foreground font-bold",
                    isWeekend && !isHoliday && "bg-weekend text-muted-foreground"
                  )}
                >
                  <span className="font-bold w-8">{String(day).padStart(2, "0")}</span>
                  <span className="uppercase text-xs tracking-wide">{dayName}</span>
                  {holidayName && (
                    <span className="ml-2 text-xs opacity-90 truncate">({holidayName})</span>
                  )}
                </div>

                {/* Team Member Cells */}
                {TEAM_MEMBERS.map((_, memberIdx) => {
                  const isVacation = hasVacation(dateStr, memberIdx);
                  const isClickable = !isHoliday && !isWeekend;

                  return (
                    <div
                      key={`${dateStr}-${memberIdx}`}
                      onClick={() => isClickable && toggleVacation(dateStr, memberIdx)}
                      className={cn(
                        "relative border-b border-border transition-all duration-150",
                        isHoliday && "bg-primary/10",
                        isWeekend && !isHoliday && "bg-weekend",
                        isVacation && "bg-secondary",
                        isClickable && "cursor-pointer hover:bg-secondary/20 active:animate-cell-pop",
                        !isClickable && "cursor-not-allowed"
                      )}
                    >
                      {isVacation && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-secondary-foreground rounded-full" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthCalendar;
