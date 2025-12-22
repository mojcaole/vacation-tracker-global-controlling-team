import { HOLIDAYS_2026, SCHOOL_HOLIDAYS_2026, YEAR } from "@/data/holidays";
import { cn } from "@/lib/utils";
import EditableName from "./EditableName";
import { X } from "lucide-react";

interface MonthCalendarProps {
  month: number;
  monthName: string;
  teamMembers: string[];
  onUpdateMember: (index: number, name: string) => void;
  onRemoveMember: (index: number) => void;
  hasVacation: (dateStr: string, memberIndex: number) => boolean;
  toggleVacation: (dateStr: string, memberIndex: number) => void;
}

const MonthCalendar = ({
  month,
  monthName,
  teamMembers,
  onUpdateMember,
  onRemoveMember,
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
    const schoolHolidayName = SCHOOL_HOLIDAYS_2026[dateStr];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return {
      date,
      dateStr,
      isWeekend,
      isHoliday: !!holidayName,
      holidayName,
      isSchoolHoliday: !!schoolHolidayName,
      schoolHolidayName,
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
            gridTemplateColumns: `minmax(180px, 1fr) 80px repeat(${teamMembers.length}, minmax(100px, 1fr))`,
          }}
        >
          {/* Header Row */}
          <div className="bg-header-bg text-primary-foreground px-4 py-3 font-bold uppercase tracking-wider text-sm">
            Date
          </div>
          <div className="bg-school-holiday text-school-holiday-foreground px-2 py-3 font-bold uppercase tracking-wider text-xs text-center">
            School
          </div>
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-header-bg/90 text-primary-foreground px-2 py-2 font-semibold text-xs uppercase tracking-wider text-center relative group"
            >
              <EditableName
                value={member}
                onChange={(name) => onUpdateMember(idx, name)}
              />
              {teamMembers.length > 1 && (
                <button
                  onClick={() => onRemoveMember(idx)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  title="Remove member"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          {/* Day Rows */}
          {days.map((day) => {
            const { dateStr, isWeekend, isHoliday, holidayName, isSchoolHoliday, schoolHolidayName, dayName } = getDayInfo(day);

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

                {/* School Holiday Cell */}
                <div
                  key={`school-${dateStr}`}
                  className={cn(
                    "border-b border-border flex items-center justify-center",
                    isSchoolHoliday && "bg-school-holiday",
                    isWeekend && !isSchoolHoliday && "bg-weekend",
                    isHoliday && !isSchoolHoliday && "bg-primary/10"
                  )}
                  title={schoolHolidayName}
                >
                  {isSchoolHoliday && (
                    <div className="w-2.5 h-2.5 bg-school-holiday-foreground rounded-full" />
                  )}
                </div>

                {/* Team Member Cells */}
                {teamMembers.map((_, memberIdx) => {
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
