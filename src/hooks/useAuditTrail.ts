import { useState, useCallback, useEffect } from "react";

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: "vacation_added" | "vacation_removed" | "member_added" | "member_removed" | "member_renamed" | "data_saved";
  details: string;
}

const AUDIT_STORAGE_KEY = "vacation-tracker-audit";
const MAX_ENTRIES = 100;

function loadAuditFromStorage(): AuditEntry[] {
  try {
    const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load audit trail from storage", e);
  }
  return [];
}

function saveAuditToStorage(entries: AuditEntry[]) {
  try {
    // Keep only the last MAX_ENTRIES
    const trimmed = entries.slice(-MAX_ENTRIES);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error("Failed to save audit trail to storage", e);
  }
}

export function useAuditTrail() {
  const [entries, setEntries] = useState<AuditEntry[]>(loadAuditFromStorage);

  useEffect(() => {
    saveAuditToStorage(entries);
  }, [entries]);

  const addEntry = useCallback((action: AuditEntry["action"], details: string) => {
    const entry: AuditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    setEntries((prev) => [...prev, entry]);
  }, []);

  const clearAudit = useCallback(() => {
    setEntries([]);
  }, []);

  return { entries, addEntry, clearAudit };
}
