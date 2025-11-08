
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md p-4 sm:p-6 mb-6 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-500 rounded-full text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Sistem Pengurusan Kutu
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Jejak bayaran, ahli, dan giliran kutu dengan mudah.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
