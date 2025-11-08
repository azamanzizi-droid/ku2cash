
export interface Member {
  id: number;
  name: string;
}

export interface Payment {
  id: number;
  memberId: number;
  memberName: string;
  amount: number;
  date: string;
}

export interface ScheduleEntry {
  week: number;
  member: Member;
}

export interface Settings {
  totalPaymentTarget: number;
  startDate: string; // Stored as YYYY-MM-DD string for input[type=date]
  paymentPerTurn: number;
}

export enum Tab {
  Payments = 'Payments',
  Members = 'Members',
  Schedule = 'Schedule',
  Settings = 'Settings'
}
