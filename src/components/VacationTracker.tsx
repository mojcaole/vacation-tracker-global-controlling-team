import { useState } from "react";
import { MONTHS, YEAR, TEAM_MEMBERS as DEFAULT_TEAM } from "@/data/holidays";
import { useVacationStore } from "@/hooks/useVacationStore";
import Legend from "./Legend";
import MonthCalendar from "./MonthCalendar";
import Stats from "./Stats";
import HolidaysList from "./HolidaysList";
import { cn } from "@/lib/utils";

const VacationTracker = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [teamMembers, setTeamMembers] = useState<string[]>([...DEFAULT_TEAM]);
  const { hasVacation, toggleVacation, getVacationCount } = useVacationStore();

  const updateMemberName = (index: number, name: string) => {
    setTeamMembers((prev) => {
      const updated = [...prev];
      updated[index] = name;
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-4 border-foreground px-6 py-8 md:px-12 md:py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase">
            Vacation Tracker
          </h1>
          <p className="text-xl md:text-2xl font-medium text-muted-foreground mt-2 tracking-wide">
            {YEAR} · Austria
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 md:py-12 max-w-7xl mx-auto">
        <Legend />

        {/* Month Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-6">
          <button
            onClick={() => setSelectedMonth(null)}
            className={cn(
              "px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors",
              selectedMonth === null
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            All Months
          </button>
          {MONTHS.map((month, idx) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(idx)}
              className={cn(
                "px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                selectedMonth === idx
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {month.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="space-y-8">
          {selectedMonth !== null ? (
            <MonthCalendar
              key={selectedMonth}
              month={selectedMonth}
              monthName={MONTHS[selectedMonth]}
              teamMembers={teamMembers}
              onUpdateMember={updateMemberName}
              hasVacation={hasVacation}
              toggleVacation={toggleVacation}
            />
          ) : (
            MONTHS.map((monthName, idx) => (
              <MonthCalendar
                key={idx}
                month={idx}
                monthName={monthName}
                teamMembers={teamMembers}
                onUpdateMember={updateMemberName}
                hasVacation={hasVacation}
                toggleVacation={toggleVacation}
              />
            ))
          )}
        </div>

        {/* Stats */}
        <Stats teamMembers={teamMembers} getVacationCount={getVacationCount} />

        {/* Public Holidays List */}
        <HolidaysList />
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-foreground mt-12 px-6 py-6 md:px-12">
        <div className="max-w-7xl mx-auto text-sm text-muted-foreground">
          <p className="uppercase tracking-wider font-medium">
            Click on a cell to toggle vacation
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VacationTracker;
