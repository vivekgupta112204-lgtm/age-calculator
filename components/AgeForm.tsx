import React, { useState } from 'react';
import { Calendar, Clock, Calculator } from 'lucide-react';

interface AgeFormProps {
  onCalculate: (date: string, time: string) => void;
}

export const AgeForm: React.FC<AgeFormProps> = ({ onCalculate }) => {
  // Default to today for easier date picking context, but empty value
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState('');
  const [time, setTime] = useState('00:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date) {
      onCalculate(date, time);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Date of Birth
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="date"
              required
              max={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm"
            />
          </div>
        </div>

        {/* Time Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Time of Birth <span className="text-slate-400 font-normal text-xs">(Optional)</span>
          </label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all sm:text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-primary-500/30 transform transition-all active:scale-[0.98] hover:-translate-y-0.5"
        >
          <Calculator size={20} />
          Calculate Age
        </button>
      </form>
    </div>
  );
};