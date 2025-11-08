import React, { useState, useEffect, useCallback } from 'react';
import type { Member, Payment, ScheduleEntry, Settings } from './types';
import { Tab } from './types';
import Header from './components/Header';
import PaymentForm from './components/PaymentForm';
import PaymentTable from './components/PaymentTable';
import MemberList from './components/MemberList';
import ScheduleView from './components/ScheduleView';
import PaymentSummary from './components/PaymentSummary';
import SettingsComponent from './components/Settings';

// Helper function to generate initial member data
const generateMembers = (count: number): Member[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Ahli ${i + 1}`,
  }));
};

// Helper function to shuffle an array (for schedule generation)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Payments);

  // Initialize state from localStorage or with default empty arrays
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem('kutu_members');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load members from localStorage', e);
      return [];
    }
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    try {
      const saved = localStorage.getItem('kutu_payments');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load payments from localStorage', e);
      return [];
    }
  });

  const [schedule, setSchedule] = useState<ScheduleEntry[]>(() => {
    try {
      const saved = localStorage.getItem('kutu_schedule');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load schedule from localStorage', e);
      return [];
    }
  });

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('kutu_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
    // Default settings
    return {
      totalPaymentTarget: 2500,
      startDate: new Date().toISOString().split('T')[0],
      paymentPerTurn: 50
    };
  });

  // Effect to generate initial data ONLY if localStorage was empty
  useEffect(() => {
    // This logic ensures we only generate data for first-time users.
    if (members.length === 0 && schedule.length === 0) {
      const initialMembers = generateMembers(50);
      setMembers(initialMembers);

      const shuffledMembers = shuffleArray(initialMembers);
      const initialSchedule = shuffledMembers.map((member, index) => ({
        week: index + 1,
        member: member,
      }));
      setSchedule(initialSchedule);
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Effects to persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('kutu_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('kutu_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('kutu_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('kutu_settings', JSON.stringify(settings));
  }, [settings]);

  const handleAddPayment = useCallback((newPaymentData: Omit<Payment, 'id' | 'date' | 'memberName'>) => {
    const member = members.find(m => m.id === newPaymentData.memberId);
    if (!member) return;

    const newPayment: Payment = {
      ...newPaymentData,
      id: Date.now(),
      memberName: member.name,
      date: new Date().toLocaleDateString('ms-MY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
    };

    setPayments(prevPayments => [newPayment, ...prevPayments]);
  }, [members]);

  const handleUpdateMemberName = useCallback((memberId: number, newName: string) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === memberId ? { ...member, name: newName } : member
      )
    );

    setSchedule(prevSchedule =>
      prevSchedule.map(entry =>
        entry.member.id === memberId
          ? { ...entry, member: { ...entry.member, name: newName } }
          : entry
      )
    );

    setPayments(prevPayments =>
      prevPayments.map(payment =>
        payment.memberId === memberId ? { ...payment, memberName: newName } : payment
      )
    );
  }, []);
  
  const handleAddMember = useCallback((name: string) => {
    setMembers(prevMembers => {
      const newId = prevMembers.length > 0 ? Math.max(...prevMembers.map(m => m.id)) + 1 : 1;
      const newMember: Member = { id: newId, name };
      
      // Also update schedule with the new member
      setSchedule(prevSchedule => [
        ...prevSchedule,
        { week: prevSchedule.length + 1, member: newMember }
      ]);

      return [...prevMembers, newMember];
    });
  }, []);

  const handleUpdateSchedule = useCallback((newSchedule: ScheduleEntry[]) => {
    const reIndexedSchedule = newSchedule.map((entry, index) => ({
      ...entry,
      week: index + 1,
    }));
    setSchedule(reIndexedSchedule);
  }, []);

  const handleUpdateSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
  }, []);

  const TabButton: React.FC<{tab: Tab, label: string, icon: React.ReactNode}> = ({tab, label, icon}) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeTab === tab
            ? 'bg-indigo-600 text-white shadow'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Members:
        return <MemberList members={members} payments={payments} onUpdateMember={handleUpdateMemberName} onAddMember={handleAddMember} totalPaymentTarget={settings.totalPaymentTarget} />;
      case Tab.Schedule:
        return <ScheduleView schedule={schedule} onUpdateSchedule={handleUpdateSchedule} startDate={new Date(settings.startDate)} />;
      case Tab.Settings:
        return <SettingsComponent settings={settings} onUpdateSettings={handleUpdateSettings} />;
      case Tab.Payments:
      default:
        return (
          <>
            <PaymentSummary payments={payments} />
            <PaymentForm members={members} onAddPayment={handleAddPayment} />
            <PaymentTable payments={payments} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="mb-6">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
                <TabButton 
                    tab={Tab.Payments} 
                    label="Rekod Bayaran" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>} 
                />
                <TabButton 
                    tab={Tab.Members} 
                    label="Senarai Ahli" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>}
                />
                <TabButton 
                    tab={Tab.Schedule} 
                    label="Jadual Giliran" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>}
                />
                 <TabButton 
                    tab={Tab.Settings} 
                    label="Tetapan" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>}
                />
            </div>
        </div>
        
        <main>
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;