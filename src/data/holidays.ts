export const HOLIDAYS_2026: Record<string, string> = {
  "2026-01-01": "New Year's Day",
  "2026-01-06": "Epiphany",
  "2026-04-06": "Easter Monday",
  "2026-05-01": "Labor Day",
  "2026-05-14": "Ascension Day",
  "2026-05-25": "Whit Monday",
  "2026-06-04": "Corpus Christi",
  "2026-08-15": "Assumption Day",
  "2026-10-26": "National Day",
  "2026-11-01": "All Saints' Day",
  "2026-12-08": "Immaculate Conception",
  "2026-12-25": "Christmas Day",
  "2026-12-26": "St. Stephen's Day",
};

// Austrian School Holidays 2026 (Vienna region dates used as reference)
// Source: publicholidays.at
export const SCHOOL_HOLIDAYS_2026: Record<string, string> = {
  // Christmas Holidays (Dec 24, 2025 - Jan 6, 2026)
  "2026-01-02": "Christmas Holidays",
  "2026-01-03": "Christmas Holidays",
  "2026-01-04": "Christmas Holidays",
  "2026-01-05": "Christmas Holidays",
  // Semester Holidays Vienna/Lower Austria (Feb 2-7, 2026)
  "2026-02-02": "Semester Holidays",
  "2026-02-03": "Semester Holidays",
  "2026-02-04": "Semester Holidays",
  "2026-02-05": "Semester Holidays",
  "2026-02-06": "Semester Holidays",
  "2026-02-07": "Semester Holidays",
  // Easter Holidays (Mar 28 - Apr 6, 2026)
  "2026-03-28": "Easter Holidays",
  "2026-03-29": "Easter Holidays",
  "2026-03-30": "Easter Holidays",
  "2026-03-31": "Easter Holidays",
  "2026-04-01": "Easter Holidays",
  "2026-04-02": "Easter Holidays",
  "2026-04-03": "Easter Holidays",
  "2026-04-04": "Easter Holidays",
  "2026-04-05": "Easter Holidays",
  // Pentecost Holidays (May 23-25, 2026)
  "2026-05-23": "Pentecost Holidays",
  "2026-05-24": "Pentecost Holidays",
  // Summer Holidays Vienna (Jul 4 - Sep 6, 2026)
  ...Object.fromEntries(
    Array.from({ length: 65 }, (_, i) => {
      const date = new Date(2026, 6, 4 + i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return [dateStr, "Summer Holidays"];
    })
  ),
};

export const TEAM_MEMBERS = [
  "Team Member 1",
  "Team Member 2",
  "Team Member 3",
  "Team Member 4",
  "Team Member 5",
];

export const YEAR = 2026;

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
