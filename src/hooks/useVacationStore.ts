import { useState, useCallback } from "react";

type VacationMap = Record<string, Set<number>>;

export function useVacationStore() {
  const [vacations, setVacations] = useState<VacationMap>({});

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
