import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { ScheduleEntry } from '../types';

interface ScheduleViewProps {
  schedule: ScheduleEntry[];
  onUpdateSchedule: (newSchedule: ScheduleEntry[]) => void;
  startDate: Date;
}

// --- Calendar Modal Component ---
const CalendarModal: React.FC<{ entry: ScheduleEntry, startDate: Date, onClose: () => void }> = ({ entry, startDate, onClose }) => {
  const payoutDate = useMemo(() => {
    const date = new Date(startDate.getTime());
    date.setDate(date.getDate() + (entry.week - 1) * 7);
    return date;
  }, [entry, startDate]);

  const month = payoutDate.getMonth();
  const year = payoutDate.getFullYear();
  const payoutDay = payoutDate.getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysOfWeek = ['A', 'I', 'S', 'R', 'K', 'J', 'S']; // Ahad, Isnin, ... Sabtu

  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm m-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {payoutDate.toLocaleString('ms-MY', { month: 'long', year: 'numeric' })}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Tutup Kalendar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {daysOfWeek.map(day => (
            <div key={day} className="text-xs font-bold text-slate-500 dark:text-slate-400">{day}</div>
          ))}
          {blanks.map((_, index) => <div key={`blank-${index}`}></div>)}
          {days.map(day => (
            <div 
              key={day} 
              className={`py-1 rounded-full ${day === payoutDay ? 'bg-indigo-600 text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}
            >
              {day}
            </div>
          ))}
        </div>
         <p className="text-center mt-4 text-sm text-slate-600 dark:text-slate-400">
            Giliran bayaran untuk <span className="font-bold text-indigo-500">{entry.member.name}</span>.
        </p>
      </div>
    </div>
  );
};


const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule, onUpdateSchedule, startDate }) => {
  const [list, setList] = useState<ScheduleEntry[]>(schedule);
  const [selectedEntry, setSelectedEntry] = useState<ScheduleEntry | null>(null);

  // Sync local state if the prop changes from parent
  useEffect(() => {
    setList(schedule);
  }, [schedule]);

  const draggedItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    draggedItemIndex.current = index;
  };

  const handleDragEnter = (index: number) => {
    if (draggedItemIndex.current === null || draggedItemIndex.current === index) {
      return;
    }
    dragOverItemIndex.current = index;
    const newList = [...list];
    const draggedItem = newList.splice(draggedItemIndex.current, 1)[0];
    newList.splice(dragOverItemIndex.current, 0, draggedItem);
    draggedItemIndex.current = dragOverItemIndex.current;
    setList(newList);
  };

  const handleDragEnd = () => {
    onUpdateSchedule(list);
    draggedItemIndex.current = null;
    dragOverItemIndex.current = null;
  };

  // Simple logic to determine the current week. In a real app, this would be based on a start date.
  const currentWeek = 1;

  const getPayoutDate = (week: number) => {
    const date = new Date(startDate.getTime());
    date.setDate(date.getDate() + (week - 1) * 7);
    return date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Jadual Giliran Bayaran Kutu</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Klik pada giliran untuk lihat kalendar. Seret dan lepas untuk menyusun semula.</p>
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          <ol className="relative border-l border-slate-200 dark:border-slate-700">
            {list.map((entry, index) => {
              const weekNumber = index + 1;
              const isPast = weekNumber < currentWeek;
              const isCurrent = weekNumber === currentWeek;

              const statusClasses = {
                iconBg: isPast ? 'bg-green-500 text-white' : isCurrent ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-700',
                cardBg: isPast ? 'bg-green-50 dark:bg-green-900/50' : isCurrent ? 'bg-indigo-50 dark:bg-indigo-900/50' : 'bg-slate-50 dark:bg-slate-800/50',
                cardBorder: isPast ? 'border-green-300 dark:border-green-700' : isCurrent ? 'border-indigo-300 dark:border-indigo-700' : 'border-slate-200 dark:border-slate-700',
              };

              return (
                <li
                  key={entry.member.id}
                  className="mb-10 ml-6 group"
                >
                  <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white dark:ring-slate-900 ${statusClasses.iconBg}`}>
                    {isPast ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    ) : isCurrent ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                    )}
                  </span>
                  <div
                    onClick={() => setSelectedEntry(entry)}
                    className={`p-4 rounded-lg border transition-shadow duration-200 group-hover:shadow-lg cursor-pointer ${statusClasses.cardBg} ${statusClasses.cardBorder}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <h3 className="flex items-center justify-between mb-1 text-lg font-semibold text-slate-900 dark:text-white">
                      Minggu {weekNumber}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 dark:text-slate-500" title="Seret untuk susun semula">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                      </span>
                    </h3>
                    <time className="block mb-2 text-xs font-normal leading-none text-slate-500 dark:text-slate-400">
                      Anggaran Tarikh: {getPayoutDate(weekNumber)}
                    </time>
                    <p className="text-sm font-normal text-slate-600 dark:text-slate-300">
                      {isPast ? 'Telah Terima' : 'Giliran'}: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{entry.member.name}</span>
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
      {selectedEntry && <CalendarModal entry={selectedEntry} startDate={startDate} onClose={() => setSelectedEntry(null)} />}
    </>
  );
};

export default ScheduleView;