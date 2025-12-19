import { HOLIDAYS_2026, YEAR } from "@/data/holidays";
import { format, parseISO } from "date-fns";

const HolidaysList = () => {
  const holidays = Object.entries(HOLIDAYS_2026).sort(
    ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <section className="mt-12 border-t-2 border-foreground pt-8">
      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6">
        Public Holidays {YEAR}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {holidays.map(([dateStr, name]) => (
          <div
            key={dateStr}
            className="flex items-center gap-4 p-4 bg-muted border-l-4 border-primary"
          >
            <span className="text-sm font-bold uppercase tracking-wider text-primary min-w-[90px]">
              {format(parseISO(dateStr), "MMM dd, EEE")}
            </span>
            <span className="text-sm font-medium text-foreground">{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HolidaysList;
