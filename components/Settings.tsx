import React, { useState, useEffect } from 'react';
import type { Settings } from '../types';

interface SettingsProps {
  settings: Settings;
  onUpdateSettings: (newSettings: Settings) => void;
}

const SettingsComponent: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const [formState, setFormState] = useState<Settings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formState);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000); // Hide message after 3 seconds
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Tetapan Kutu</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Uruskan konfigurasi utama untuk sistem kutu anda di sini. Perubahan akan disimpan dan digunakan di seluruh aplikasi.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="totalPaymentTarget" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Target Bayaran Keseluruhan (RM)
          </label>
          <input
            type="number"
            id="totalPaymentTarget"
            name="totalPaymentTarget"
            value={formState.totalPaymentTarget}
            onChange={handleChange}
            className="w-full max-w-md px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            min="0"
            step="1"
            placeholder="cth. 2500"
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Jumlah penuh yang perlu dibayar oleh setiap ahli.</p>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Tarikh Mula Kutu
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formState.startDate}
            onChange={handleChange}
            className="w-full max-w-md px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
           <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Tarikh ini digunakan untuk mengira anggaran tarikh bayaran dalam jadual.</p>
        </div>

        <div>
          <label htmlFor="paymentPerTurn" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Jumlah Bayaran Setiap Giliran (RM)
          </label>
          <input
            type="number"
            id="paymentPerTurn"
            name="paymentPerTurn"
            value={formState.paymentPerTurn}
            onChange={handleChange}
            className="w-full max-w-md px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            min="0"
            step="1"
            placeholder="cth. 50"
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Amaun yang perlu dibayar oleh ahli pada setiap giliran (cth., mingguan).</p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-6 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Simpan Tetapan</span>
          </button>
          {isSaved && (
            <div className="text-sm font-medium text-green-600 dark:text-green-400" role="status">
              Tetapan berjaya disimpan!
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SettingsComponent;
