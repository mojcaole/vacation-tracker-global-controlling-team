import { useState, useCallback, useEffect } from "react";

type VacationMap = Record<string, Set<number>>;
type SerializedVacationMap = Record<string, number[]>;

const STORAGE_KEY = "vacation-tracker-data";

function loadFromStorage(): VacationMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: SerializedVacationMap = JSON.parse(stored);
      const result: VacationMap = {};
      Object.entries(parsed).forEach(([dateStr, members]) => {
        result[dateStr] = new Set(members);
      });
      return result;
    }
  } catch (e) {
    console.error("Failed to load vacations from storage", e);
  }
  return {};
}

function saveToStorage(vacations: VacationMap) {
  try {
    const serialized: SerializedVacationMap = {};
    Object.entries(vacations).forEach(([dateStr, set]) => {
      serialized[dateStr] = Array.from(set);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (e) {
    console.error("Failed to save vacations to storage", e);
  }
}

export function useVacationStore() {
  const [vacations, setVacations] = useState<VacationMap>(loadFromStorage);

  useEffect(() => {
    saveToStorage(vacations);
  }, [vacations]);

  const toggleVacation = useCallback((dateStr: string, memberIndex: number) => {
    setVacations((prev) => {
      const newVacations = { ...prev };
      const dateSet = new Set(prev[dateStr] || []);

      if (dateSet.has(memberIndex)) {
        dateSet.delete(memberIndex);
      } else {
        dateSet.add(memberIndex);
      }

      if (dateSet.size === 0) {
        delete newVacations[dateStr];
      } else {
        newVacations[dateStr] = dateSet;
      }

      return newVacations;
    });
  }, []);

  const hasVacation = useCallback(
    (dateStr: string, memberIndex: number) => {
      return vacations[dateStr]?.has(memberIndex) || false;
    },
    [vacations]
  );

  const getVacationCount = useCallback(
    (memberIndex: number) => {
      let count = 0;
      Object.values(vacations).forEach((set) => {
        if (set.has(memberIndex)) count++;
      });
      return count;
    },
    [vacations]
  );

  return { vacations, toggleVacation, hasVacation, getVacationCount };
}
