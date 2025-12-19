import { AuditEntry } from "@/hooks/useAuditTrail";
import { format } from "date-fns";
import { History, Trash2, UserPlus, UserMinus, Edit, Calendar, Save } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AuditTrailProps {
  entries: AuditEntry[];
  onClear: () => void;
}

const actionIcons: Record<AuditEntry["action"], React.ReactNode> = {
  vacation_added: <Calendar className="w-4 h-4 text-vacation" />,
  vacation_removed: <Calendar className="w-4 h-4 text-muted-foreground" />,
  member_added: <UserPlus className="w-4 h-4 text-green-600" />,
  member_removed: <UserMinus className="w-4 h-4 text-destructive" />,
  member_renamed: <Edit className="w-4 h-4 text-blue-500" />,
  data_saved: <Save className="w-4 h-4 text-holiday" />,
};

const actionLabels: Record<AuditEntry["action"], string> = {
  vacation_added: "Vacation Added",
  vacation_removed: "Vacation Removed",
  member_added: "Member Added",
  member_removed: "Member Removed",
  member_renamed: "Member Renamed",
  data_saved: "Data Saved",
};

const AuditTrail = ({ entries, onClear }: AuditTrailProps) => {
  const reversedEntries = [...entries].reverse();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground font-bold uppercase tracking-wider text-sm hover:bg-accent hover:text-foreground transition-colors">
          <History className="w-4 h-4" />
          Audit Trail
        </button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl font-bold uppercase tracking-wider">
            <History className="w-5 h-5" />
            Change History
          </SheetTitle>
          <SheetDescription>
            All changes made to the vacation tracker are logged here.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
            {entries.length > 0 && (
              <button
                onClick={onClear}
                className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear History
              </button>
            )}
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            {reversedEntries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No changes recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reversedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-border p-3 bg-muted/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {actionIcons[entry.action]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                            {actionLabels[entry.action]}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(entry.timestamp), "MMM d, HH:mm")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 break-words">
                          {entry.details}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AuditTrail;
