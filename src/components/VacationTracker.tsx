import { useState, useEffect, useRef } from "react";
import { MONTHS, YEAR, TEAM_MEMBERS as DEFAULT_TEAM } from "@/data/holidays";
import { useVacationStore } from "@/hooks/useVacationStore";
import { useAuditTrail } from "@/hooks/useAuditTrail";
import { exportToExcel } from "@/utils/exportCalendar";
import { exportToPdf } from "@/utils/exportPdf";
import Legend from "./Legend";
import MonthCalendar from "./MonthCalendar";
import Stats from "./Stats";
import HolidaysList from "./HolidaysList";
import AuditTrail from "./AuditTrail";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { Download, FileText, Plus, Save, Navigation } from "lucide-react";
import { toast } from "sonner";

const TEAM_STORAGE_KEY = "vacation-tracker-team";

function loadTeamFromStorage(): string[] {
  try {
    const stored = localStorage.getItem(TEAM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load team from storage", e);
  }
  return [...DEFAULT_TEAM];
}

const VacationTracker = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [teamMembers, setTeamMembers] = useState<string[]>(loadTeamFromStorage);
  const { hasVacation, toggleVacation, getVacationCount } = useVacationStore();
  const { entries, addEntry, clearAudit } = useAuditTrail();
  const prevTeamRef = useRef<string[]>(teamMembers);

  useEffect(() => {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamMembers));
  }, [teamMembers]);

  const updateMemberName = (index: number, name: string) => {
    const oldName = teamMembers[index];
    setTeamMembers((prev) => {
      const updated = [...prev];
      updated[index] = name;
      return updated;
    });
    if (oldName !== name) {
      addEntry("member_renamed", `"${oldName}" renamed to "${name}"`);
    }
  };

  const addMember = () => {
    const newName = `Team Member ${teamMembers.length + 1}`;
    setTeamMembers((prev) => [...prev, newName]);
    addEntry("member_added", `Added new member "${newName}"`);
  };

  const removeMember = (index: number) => {
    const removedName = teamMembers[index];
    setTeamMembers((prev) => prev.filter((_, i) => i !== index));
    addEntry("member_removed", `Removed member "${removedName}"`);
  };

  const handleToggleVacation = (dateStr: string, memberIndex: number) => {
    const memberName = teamMembers[memberIndex];
    const isCurrentlyOnVacation = hasVacation(dateStr, memberIndex);
    toggleVacation(dateStr, memberIndex);
    
    if (isCurrentlyOnVacation) {
      addEntry("vacation_removed", `Removed vacation for "${memberName}" on ${dateStr}`);
    } else {
      addEntry("vacation_added", `Added vacation for "${memberName}" on ${dateStr}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-4 border-foreground px-6 py-8 md:px-12 md:py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase">
              Vacation Tracker
            </h1>
            <p className="text-xl md:text-2xl font-medium text-muted-foreground mt-2 tracking-wide">
              {YEAR} · Austria
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addMember}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground font-bold uppercase tracking-wider text-sm hover:bg-secondary/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
            <button
              onClick={() => {
                localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamMembers));
                addEntry("data_saved", "All changes saved manually");
                toast.success("All changes saved successfully!");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-holiday text-white font-bold uppercase tracking-wider text-sm hover:bg-holiday/80 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => exportToExcel(teamMembers, hasVacation)}
              className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-bold uppercase tracking-wider text-sm hover:bg-primary transition-colors"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={() => exportToPdf(teamMembers, hasVacation)}
              className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-bold uppercase tracking-wider text-sm hover:bg-primary transition-colors"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
            <AuditTrail entries={entries} onClear={clearAudit} />
            <ThemeToggle />
          </div>
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
          {(() => {
            const now = new Date();
            const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
            const dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum);
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            const currentWeek = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
            return (
              <button
                onClick={() => {
                  setSelectedMonth(null);
                  setTimeout(() => {
                    const el = document.querySelector('[data-current-week="true"]');
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }, 100);
                }}
                className="ml-auto px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors bg-accent text-accent-foreground hover:bg-accent/80 flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                This Week · KW {currentWeek}
              </button>
            );
          })()}
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
              onRemoveMember={removeMember}
              hasVacation={hasVacation}
              toggleVacation={handleToggleVacation}
            />
          ) : (
            MONTHS.map((monthName, idx) => (
              <MonthCalendar
                key={idx}
                month={idx}
                monthName={monthName}
                teamMembers={teamMembers}
                onUpdateMember={updateMemberName}
                onRemoveMember={removeMember}
                hasVacation={hasVacation}
                toggleVacation={handleToggleVacation}
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
            Global Controlling 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VacationTracker;
