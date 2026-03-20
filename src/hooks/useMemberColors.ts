import { useState, useCallback, useEffect } from "react";

export const MEMBER_COLORS = [
  { name: "Cobalt", bg: "214 100% 33%", bgDark: "214 100% 45%", rgb: [0, 71, 171] },
  { name: "Emerald", bg: "160 84% 39%", bgDark: "160 84% 45%", rgb: [16, 163, 127] },
  { name: "Rose", bg: "350 80% 55%", bgDark: "350 80% 60%", rgb: [214, 51, 74] },
  { name: "Amber", bg: "38 92% 50%", bgDark: "38 92% 55%", rgb: [245, 166, 10] },
  { name: "Violet", bg: "270 70% 50%", bgDark: "270 70% 60%", rgb: [115, 38, 217] },
  { name: "Teal", bg: "185 80% 35%", bgDark: "185 80% 45%", rgb: [18, 143, 161] },
  { name: "Crimson", bg: "0 72% 45%", bgDark: "0 72% 55%", rgb: [197, 32, 32] },
  { name: "Lime", bg: "85 65% 40%", bgDark: "85 65% 50%", rgb: [104, 168, 36] },
  { name: "Sky", bg: "200 90% 48%", bgDark: "200 90% 55%", rgb: [12, 147, 232] },
  { name: "Pink", bg: "330 80% 55%", bgDark: "330 80% 65%", rgb: [230, 46, 138] },
  { name: "Slate", bg: "215 20% 45%", bgDark: "215 20% 55%", rgb: [92, 104, 120] },
  { name: "Coral", bg: "16 85% 55%", bgDark: "16 85% 62%", rgb: [235, 107, 52] },
];

const STORAGE_KEY = "vacation-tracker-member-colors";

function loadColors(): Record<number, number> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}

export function useMemberColors() {
  const [colorMap, setColorMap] = useState<Record<number, number>>(loadColors);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colorMap));
  }, [colorMap]);

  const getMemberColorIndex = useCallback(
    (memberIndex: number): number => {
      return colorMap[memberIndex] ?? memberIndex % MEMBER_COLORS.length;
    },
    [colorMap]
  );

  const setMemberColor = useCallback((memberIndex: number, colorIndex: number) => {
    setColorMap((prev) => ({ ...prev, [memberIndex]: colorIndex }));
  }, []);

  const getMemberColor = useCallback(
    (memberIndex: number) => {
      return MEMBER_COLORS[getMemberColorIndex(memberIndex)];
    },
    [getMemberColorIndex]
  );

  return { getMemberColor, getMemberColorIndex, setMemberColor };
}
