import React from 'react';
import type { Payment } from '../types';

interface PaymentSummaryProps {
  payments: Payment[];
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ payments }) => {
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paymentCount = payments.length;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Ringkasan Kutipan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg flex items-center space-x-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Jumlah Kutipan Terkumpul</h3>
                <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                    RM {totalAmount.toFixed(2)}
                </p>
            </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg flex items-center space-x-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            </div>
            <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Bilangan Bayaran Diterima</h3>
                <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                    {paymentCount}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
