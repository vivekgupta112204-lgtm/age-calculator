export interface AgeStats {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

export interface NextBirthday {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  date: Date;
}

export interface ZodiacInfo {
  name: string;
  symbol: string;
  dateRange: string;
}

export interface CalculationResult {
  age: AgeStats;
  nextBirthday: NextBirthday;
  zodiac: ZodiacInfo;
  dayOfBirth: string;
  dateOfBirth: Date;
}
