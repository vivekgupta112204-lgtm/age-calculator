import React, { useState, useEffect } from 'react';
import { AgeForm } from './components/AgeForm';
import { ResultCard } from './components/ResultCard';
import { AdPlaceholder } from './components/AdPlaceholder';
import { calculateAge } from './utils/calculator';
import { CalculationResult } from './types';
import { Moon, Sun, CalendarClock } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [dob, setDob] = useState<Date | null>(null);
  const [tob, setTob] = useState<string>("00:00");
  const [darkMode, setDarkMode] = useState(false);

  // Initialize Dark Mode based on system preference
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Toggle Body Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleCalculate = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr);
    const calculated = calculateAge(date, timeStr);
    setDob(date);
    setTob(timeStr);
    setResult(calculated);
    
    // Smooth scroll to result
    setTimeout(() => {
        const resultElement = document.getElementById('result-section');
        if (resultElement) {
            resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg text-white">
                <CalendarClock size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Age Calculator</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Exact Age & Birthday Stats</p>
            </div>
        </div>
        <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            aria-label="Toggle Dark Mode"
        >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="w-full space-y-6">
        {/* Intro Text */}
        {!result && (
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                    How old are you, exactly?
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                    Calculate your exact age in years, months, days, and seconds. Find out your zodiac sign and how long until your next birthday.
                </p>
            </div>
        )}

        {/* Input Card */}
        <AgeForm onCalculate={handleCalculate} />

        {/* Ad Space */}
        <AdPlaceholder label="Advertisement" />

        {/* Results */}
        {result && dob && (
          <div id="result-section" className="scroll-mt-6">
            <ResultCard initialResult={result} dob={dob} tob={tob} />
            <AdPlaceholder label="Bottom Ad Unit" className="mt-8" />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400 space-y-2 pb-20">
        <p>&copy; {new Date().getFullYear()} Age Calculator Pro. All rights reserved.</p>
        <p className="text-xs">
            Using highly accurate date algorithms. Results may vary slightly based on time zones.
        </p>
      </footer>
    </div>
  );
};

export default App;