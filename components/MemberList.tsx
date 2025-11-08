import React, { useState, useCallback, useMemo } from 'react';
import type { Member, Payment } from '../types';

interface MemberListProps {
  members: Member[];
  payments: Payment[];
  onUpdateMember: (id: number, newName: string) => void;
  onAddMember: (name: string) => void;
  totalPaymentTarget: number;
}

const MemberList: React.FC<MemberListProps> = ({ members, payments, onUpdateMember, onAddMember, totalPaymentTarget }) => {
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [newMemberName, setNewMemberName] = useState('');
  const [addError, setAddError] = useState('');

  const memberPayments = useMemo(() => {
    const totals = new Map<number, number>();
    for (const payment of payments) {
        const currentTotal = totals.get(payment.memberId) || 0;
        totals.set(payment.memberId, currentTotal + payment.amount);
    }
    return totals;
  }, [payments]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) {
      setAddError('Nama ahli tidak boleh kosong.');
      return;
    }
    onAddMember(newMemberName.trim());
    setNewMemberName('');
    setAddError('');
  };

  const handleEditClick = useCallback((member: Member) => {
    setEditingMemberId(member.id);
    setEditedName(member.name);
  }, []);

  const handleCancelClick = useCallback(() => {
    setEditingMemberId(null);
    setEditedName('');
  }, []);

  const handleSaveClick = useCallback(() => {
    if (editingMemberId && editedName.trim()) {
      onUpdateMember(editingMemberId, editedName.trim());
    }
    handleCancelClick();
  }, [editingMemberId, editedName, onUpdateMember, handleCancelClick]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveClick();
    } else if (e.key === 'Escape') {
      handleCancelClick();
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Tambah Ahli Baru</h2>
        {addError && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{addError}</p>}
        <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-grow w-full">
            <label htmlFor="new-member-name" className="sr-only">
              Nama Ahli Baru
            </label>
            <input
              type="text"
              id="new-member-name"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Masukkan nama ahli baru"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              aria-label="New member name"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Tambah Ahli</span>
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Senarai Ahli ({members.length} orang)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {members.map((member) => {
            const amountPaid = memberPayments.get(member.id) || 0;
            const balance = totalPaymentTarget - amountPaid;
            const balanceColor = balance > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400';
            
            return (
                <div key={member.id} className="flex items-start space-x-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-base">
                    {member.name.charAt(0).toUpperCase() || '?'}
                </div>
                {editingMemberId === member.id ? (
                    <div className="flex-grow flex items-center space-x-1">
                    <input
                        type="text"
                        value={editedName}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        className="w-full text-sm px-2 py-1 border border-slate-300 rounded-md dark:bg-slate-600 dark:border-slate-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        autoFocus
                        aria-label={`Edit name for ${member.name}`}
                    />
                    <button onClick={handleSaveClick} className="p-1 text-green-600 hover:text-green-800 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500" aria-label="Save name">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </button>
                    <button onClick={handleCancelClick} className="p-1 text-red-600 hover:text-red-800 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500" aria-label="Cancel edit">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                    </div>
                ) : (
                    <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate" title={member.name}>
                                {member.name}
                            </p>
                            <button onClick={() => handleEditClick(member)} className="p-1 -mt-1 -mr-1 flex-shrink-0 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label={`Edit ${member.name}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                            </button>
                        </div>
                        <div className="mt-2 space-y-1.5 text-xs">
                            <p className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Target Bayaran:</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">RM {totalPaymentTarget.toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Jumlah Dibayar:</span>
                                <span className="font-semibold text-green-600 dark:text-green-400">RM {amountPaid.toFixed(2)}</span>
                            </p>
                            <hr className="border-slate-200 dark:border-slate-600 my-1"/>
                            <p className="flex justify-between text-sm">
                                <span className="font-medium text-slate-600 dark:text-slate-300">Baki:</span>
                                <span className={`font-bold ${balanceColor}`}>RM {balance.toFixed(2)}</span>
                            </p>
                        </div>
                    </div>
                )}
                </div>
            )
          })}
        </div>
      </div>
    </>
  );
};

export default MemberList;