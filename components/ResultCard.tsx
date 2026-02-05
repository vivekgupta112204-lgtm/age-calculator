import React, { useEffect, useState } from 'react';
import { CalculationResult } from '../types';
import { calculateAge } from '../utils/calculator';
import { Copy, Cake, Clock, Calendar, Star, Check } from 'lucide-react';

interface ResultCardProps {
  initialResult: CalculationResult;
  dob: Date;
  tob: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ initialResult, dob, tob }) => {
  const [result, setResult] = useState<CalculationResult>(initialResult);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setResult(calculateAge(new Date(dob), tob));
    }, 1000);
    return () => clearInterval(timer);
  }, [dob, tob]);

  // Robust copy function
  const performCopy = (text: string, onSuccess: () => void) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Improved off-screen setup
    textArea.style.position = "absolute";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    textArea.setAttribute("readonly", ""); // Prevent keyboard on mobile
    
    document.body.appendChild(textArea);
    
    let success = false;
    try {
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        success = document.execCommand('copy');
    } catch (e) { 
        console.warn("execCommand failed", e);
    }
    document.body.removeChild(textArea);

    if (success) {
        onSuccess();
    } else {
         if (navigator.clipboard && navigator.clipboard.writeText) {
             navigator.clipboard.writeText(text).then(() => {
                onSuccess();
             }).catch(err => console.warn("Async Copy failed", err));
         }
    }
  };

  const handleCopy = () => {
    const text = `I am exactly ${result.age.years} years, ${result.age.months} months, and ${result.age.days} days old.`;
    performCopy(text, () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Main Age Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border-l-4 border-primary-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Cake size={100} />
        </div>
        
        <h2 className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide text-sm mb-2">Your Exact Age</h2>
        <div className="flex flex-wrap items-baseline gap-2 mb-4">
            <span className="text-5xl md:text-6xl font-bold text-slate-800 dark:text-white">{result.age.years}</span>
            <span className="text-xl text-slate-500 dark:text-slate-400">Years</span>
        </div>
        
        <div className="flex gap-4 text-lg md:text-xl text-slate-700 dark:text-slate-200 font-medium">
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-primary-600 dark:text-primary-400">{result.age.months}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Months</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-primary-600 dark:text-primary-400">{result.age.days}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">Days</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
           <div className="flex items-center gap-2 mb-2">
             <Clock className="w-4 h-4 text-primary-500" />
             <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Live Counter</span>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
             <div className="bg-slate-50 dark:bg-slate-900 rounded p-2">
                <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{result.age.totalDays.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Days</div>
             </div>
             <div className="bg-slate-50 dark:bg-slate-900 rounded p-2">
                <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{result.age.totalHours.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Hours</div>
             </div>
             <div className="bg-slate-50 dark:bg-slate-900 rounded p-2">
                <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{result.age.totalMinutes.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Mins</div>
             </div>
             <div className="bg-primary-50 dark:bg-primary-900/20 rounded p-2 ring-1 ring-primary-100 dark:ring-primary-900">
                <div className="text-lg font-bold text-primary-600 dark:text-primary-400 w-[80px] mx-auto tabular-nums">{result.age.totalSeconds.toLocaleString()}</div>
                <div className="text-xs text-primary-500 dark:text-primary-300">Seconds</div>
             </div>
           </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 py-2 rounded-lg text-sm font-medium transition-colors text-slate-700 dark:text-slate-200">
            {copied ? <Check size={16} /> : <Copy size={16} />} 
            {copied ? 'Copied!' : 'Copy Age'}
          </button>
        </div>
      </div>

      {/* Birthday Countdown */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 opacity-20 rotate-12">
            <Cake size={120} />
        </div>
        <h3 className="text-purple-100 text-sm font-medium uppercase tracking-wide mb-3 flex items-center gap-2">
            <Cake size={16} /> Next Birthday
        </h3>
        <div className="flex justify-between items-end relative z-10">
            <div className="text-center">
                <span className="block text-3xl font-bold">{result.nextBirthday.days}</span>
                <span className="text-xs text-purple-200">Days</span>
            </div>
            <div className="text-center">
                <span className="block text-3xl font-bold">{result.nextBirthday.hours}</span>
                <span className="text-xs text-purple-200">Hrs</span>
            </div>
            <div className="text-center">
                <span className="block text-3xl font-bold">{result.nextBirthday.minutes}</span>
                <span className="text-xs text-purple-200">Mins</span>
            </div>
            <div className="text-center">
                <span className="block text-3xl font-bold tabular-nums">{result.nextBirthday.seconds}</span>
                <span className="text-xs text-purple-200">Secs</span>
            </div>
        </div>
        <p className="mt-4 text-sm text-purple-200 text-right">
            {result.nextBirthday.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-2">
                <span className="text-xl">{result.zodiac.symbol}</span>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">Zodiac Sign</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{result.zodiac.name}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                <Calendar size={20} />
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">Born On</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{result.dayOfBirth}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
             <span className="text-sm text-slate-500 dark:text-slate-400">Total Weeks</span>
             <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{result.age.totalWeeks.toLocaleString()}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
             <span className="text-sm text-slate-500 dark:text-slate-400">Total Months</span>
             <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{result.age.totalMonths.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};