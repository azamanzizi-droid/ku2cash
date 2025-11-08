
import React, { useState } from 'react';
import type { Member, Payment } from '../types';

interface PaymentFormProps {
  members: Member[];
  onAddPayment: (payment: Omit<Payment, 'id' | 'date' | 'memberName'>) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ members, onAddPayment }) => {
  const [memberId, setMemberId] = useState<number | ''>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !amount || amount <= 0) {
      setError('Sila pilih ahli dan masukkan jumlah bayaran yang sah.');
      return;
    }
    onAddPayment({ memberId: Number(memberId), amount: Number(amount) });
    setMemberId('');
    setAmount('');
    setError('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Tambah Rekod Bayaran</h2>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-1">
          <label htmlFor="member" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Nama Ahli
          </label>
          <select
            id="member"
            value={memberId}
            onChange={(e) => setMemberId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          >
            <option value="" disabled>Pilih ahli</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1">
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Jumlah Bayaran (RM)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="cth. 50"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            min="0.01"
            step="0.01"
          />
        </div>
        <div className="md:col-span-1">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Tambah Bayaran</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
