export type TransactionType = 'inflow' | 'outflow';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  category: string;
  dateString: string; // e.g., "16 Mei 2025"
  dateGroup: string; // e.g., "Hari Ini", "Kemarin", "14 Mei 2025"
  timeString: string; // e.g., "14:20 WIB"
  paymentMethod: 'Kas Tunai' | 'Bank Mandiri' | 'QRIS Kas' | 'Transfer Bank' | string;
  relatedPerson: string;
  nim?: string;
  notes?: string;
  receiptName?: string;
  receiptSize?: string;
  receiptImage?: string;
  verified: boolean;
  statusText?: string;
  statusBadgeColor?: string;
  referenceNumber: string;
  subDescription: string;
  isAutoReconciled?: boolean;
  contractNumber?: string;
  isPendingReview?: boolean;
}

export interface MemberDue {
  id: string;
  name: string;
  initials: string;
  department: string;
  deptKey: 'bph' | 'kominfo' | 'acara' | 'psdm' | 'danus' | 'humas';
  role: string;
  status: 'lunas' | 'tunggakan';
  amount: number;
  dueAmount: number;
  monthsDue?: string;
  lastPaidDate?: string;
  phone?: string;
}

export interface LPJReport {
  id: string;
  title: string;
  period: string;
  auditor: string;
  totalInflow: number;
  totalOutflow: number;
  verifiedBalance: number;
  photoUrl: string;
  verificationHash: string;
  signatories: { name: string; role: string }[];
  events: {
    name: string;
    date: string;
    budget: number;
    realized: number;
    status: 'Selesai & Audit Sah' | 'Dalam Review' | 'LPJ Lengkap';
  }[];
}

export interface ProkerDetail {
  name: string;
  date: string;
  budget: number;
  realized: number;
  status: 'Selesai & Audit Sah' | 'Dalam Review' | 'LPJ Lengkap' | string;
  committeeHead?: string;
  location?: string;
  efficiency?: number;
  breakdown?: {
    item: string;
    allocated: number;
    spent: number;
    note?: string;
  }[];
}
