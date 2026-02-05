import { AgeStats, NextBirthday, ZodiacInfo, CalculationResult } from '../types';

export const getDayOfWeek = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const getZodiacSign = (date: Date): ZodiacInfo => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // 1-12

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: "Aquarius", symbol: "♒", dateRange: "Jan 20 - Feb 18" };
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return { name: "Pisces", symbol: "♓", dateRange: "Feb 19 - Mar 20" };
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: "Aries", symbol: "♈", dateRange: "Mar 21 - Apr 19" };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: "Taurus", symbol: "♉", dateRange: "Apr 20 - May 20" };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: "Gemini", symbol: "♊", dateRange: "May 21 - Jun 20" };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: "Cancer", symbol: "♋", dateRange: "Jun 21 - Jul 22" };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: "Leo", symbol: "♌", dateRange: "Jul 23 - Aug 22" };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: "Virgo", symbol: "♍", dateRange: "Aug 23 - Sep 22" };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: "Libra", symbol: "♎", dateRange: "Sep 23 - Oct 22" };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: "Scorpio", symbol: "♏", dateRange: "Oct 23 - Nov 21" };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: "Sagittarius", symbol: "♐", dateRange: "Nov 22 - Dec 21" };
  return { name: "Capricorn", symbol: "♑", dateRange: "Dec 22 - Jan 19" };
};

export const calculateAge = (dob: Date, tob: string = "00:00"): CalculationResult => {
  const now = new Date();
  
  // Parse TOB
  const [hours, minutes] = tob.split(':').map(Number);
  dob.setHours(hours || 0, minutes || 0, 0, 0);

  const diffTime = now.getTime() - dob.getTime();
  
  // Basic Stats
  const totalSeconds = Math.floor(diffTime / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());

  // Exact Age Calculation
  let years = now.getFullYear() - dob.getFullYear();
  let m = now.getMonth() - dob.getMonth();
  let d = now.getDate() - dob.getDate();

  if (d < 0) {
      m--;
      // Get days in previous month
      const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
      d += prevMonthDate.getDate();
  }
  if (m < 0) {
      years--;
      m += 12;
  }

  // Next Birthday
  const nextBirthdayDate = new Date(now.getFullYear(), dob.getMonth(), dob.getDate(), hours, minutes);
  if (now > nextBirthdayDate) {
    nextBirthdayDate.setFullYear(now.getFullYear() + 1);
  }

  const diffNextBirthday = nextBirthdayDate.getTime() - now.getTime();
  const nbSeconds = Math.floor(diffNextBirthday / 1000);
  const nbMinutes = Math.floor(nbSeconds / 60);
  const nbHours = Math.floor(nbMinutes / 60);
  const nbDays = Math.floor(nbHours / 24);

  return {
    age: {
      years,
      months: m,
      days: d,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds
    },
    nextBirthday: {
      days: nbDays,
      hours: nbHours % 24,
      minutes: nbMinutes % 60,
      seconds: nbSeconds % 60,
      date: nextBirthdayDate
    },
    zodiac: getZodiacSign(dob),
    dayOfBirth: getDayOfWeek(dob),
    dateOfBirth: dob
  };
};