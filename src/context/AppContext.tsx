import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, MemberDue, TransactionType, ProkerDetail } from '../types';
import { INITIAL_TRANSACTIONS, INITIAL_MEMBERS, MOCK_LPJ } from '../data/mockData';
import { downloadLpjPdfFile, PDFExportOptions } from '../utils/pdfGenerator';

export type ScreenType = 'beranda' | 'buku-kas' | 'catat-kas' | 'transparansi';

interface AppContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  catatKasInitialType: TransactionType;
  setCatatKasInitialType: (type: TransactionType) => void;
  transparansiTab: 'iuran' | 'lpj';
  setTransparansiTab: (tab: 'iuran' | 'lpj') => void;
  transactions: Transaction[];
  addTransaction: (newTx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (updatedTx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  members: MemberDue[];
  addMember: (member: Omit<MemberDue, 'id'>) => void;
  markMemberPaid: (memberId: string) => void;
  toggleMemberPaid: (memberId: string) => void;
  isSaldoVisible: boolean;
  toggleSaldoVisibility: () => void;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (tx: Transaction | null) => void;
  whatsappModalMember: MemberDue | null;
  setWhatsappModalMember: (member: MemberDue | null) => void;
  isBroadcastModalOpen: boolean;
  setIsBroadcastModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isLpjPdfModalOpen: boolean;
  setIsLpjPdfModalOpen: (open: boolean) => void;
  isAddMemberOpen: boolean;
  setIsAddMemberOpen: (open: boolean) => void;
  selectedProker: ProkerDetail | null;
  setSelectedProker: (proker: ProkerDetail | null) => void;
  lightboxImage: { url: string; title: string } | null;
  setLightboxImage: (img: { url: string; title: string } | null) => void;
  toast: { message: string; icon?: string; type?: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, icon?: string, type?: 'success' | 'info' | 'error') => void;
  totalSaldo: number;
  totalMasukBulanIni: number;
  totalKeluarBulanIni: number;
  selisihBersih: number;
  totalPaidMembers: number;
  totalMembersCount: number;
  collectedDues: number;
  targetDues: number;
  exportPdf: (options?: PDFExportOptions) => void;
  exportExcel: () => void;
  exportMembersExcel: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('beranda');
  const [catatKasInitialType, setCatatKasInitialType] = useState<TransactionType>('inflow');
  const [transparansiTab, setTransparansiTab] = useState<'iuran' | 'lpj'>('iuran');

  // Persistence for transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('kaskampus_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved transactions', e);
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  // Persistence for members
  const [members, setMembers] = useState<MemberDue[]>(() => {
    const saved = localStorage.getItem('kaskampus_members');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved members', e);
      }
    }
    return INITIAL_MEMBERS;
  });

  const [isSaldoVisible, setIsSaldoVisible] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [whatsappModalMember, setWhatsappModalMember] = useState<MemberDue | null>(null);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLpjPdfModalOpen, setIsLpjPdfModalOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedProker, setSelectedProker] = useState<ProkerDetail | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; icon?: string; type?: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    localStorage.setItem('kaskampus_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('kaskampus_members', JSON.stringify(members));
  }, [members]);

  const showToast = (message: string, icon = 'notifications_active', type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, icon, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  const toggleSaldoVisibility = () => {
    setIsSaldoVisible((prev) => !prev);
  };

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const id = `tx-${Date.now()}`;
    const fullTx: Transaction = {
      ...newTx,
      id,
    };
    setTransactions((prev) => [fullTx, ...prev]);

    // If related person is one of the members and it's dues, update member status
    if (fullTx.category === 'Uang Kas Wajib Mahasiswa' && fullTx.type === 'inflow') {
      setMembers((prev) =>
        prev.map((m) => {
          if (fullTx.relatedPerson.toLowerCase().includes(m.name.toLowerCase())) {
            return {
              ...m,
              status: 'lunas',
              amount: m.dueAmount,
              lastPaidDate: 'Hari Ini',
              monthsDue: undefined,
            };
          }
          return m;
        })
      );
    }

    showToast('Transaksi berhasil disimpan ke Buku Kas!', 'task_alt', 'success');
  };

  const updateTransaction = (updatedTx: Transaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === updatedTx.id ? updatedTx : t)));
    if (selectedTransaction?.id === updatedTx.id) {
      setSelectedTransaction(updatedTx);
    }
    showToast('Transaksi berhasil diperbarui!', 'edit_note', 'success');
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    if (selectedTransaction?.id === id) {
      setSelectedTransaction(null);
    }
    showToast('Transaksi berhasil dihapus.', 'delete', 'info');
  };

  const addMember = (newMem: Omit<MemberDue, 'id'>) => {
    const id = `mem-${Date.now()}`;
    const initials = newMem.name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('');
    const fullMember: MemberDue = {
      ...newMem,
      id,
      initials: newMem.initials || initials || 'AG',
    };
    setMembers((prev) => [fullMember, ...prev]);
    showToast(`Anggota ${newMem.name} berhasil ditambahkan!`, 'person_add', 'success');
  };

  const toggleMemberPaid = (memberId: string) => {
    const target = members.find((m) => m.id === memberId);
    if (!target) return;

    if (target.status === 'lunas') {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? {
                ...m,
                status: 'tunggakan',
                amount: 0,
                monthsDue: 'Mei belum bayar',
                lastPaidDate: undefined,
              }
            : m
        )
      );
      showToast(`Status ${target.name} diubah menjadi Tunggakan.`, 'undo', 'info');
    } else {
      markMemberPaid(memberId);
    }
  };

  const markMemberPaid = (memberId: string) => {
    const target = members.find((m) => m.id === memberId);
    if (!target) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              status: 'lunas',
              amount: m.dueAmount,
              lastPaidDate: 'Hari Ini',
              monthsDue: undefined,
            }
          : m
      )
    );

    // Also automatically append an inflow transaction to the ledger
    const newTx: Omit<Transaction, 'id'> = {
      type: 'inflow',
      title: `Iuran Kas Rutin - ${target.name}`,
      amount: target.dueAmount,
      category: 'Uang Kas Wajib Mahasiswa',
      dateString: 'Jumat, 16 Mei 2025',
      dateGroup: 'Hari Ini',
      timeString: '15:00 WIB',
      paymentMethod: 'QRIS Kas',
      relatedPerson: `${target.name} - ${target.department}`,
      subDescription: `${target.department} • Lunas via QRIS KasKampus`,
      verified: true,
      statusText: 'Auto-Reconciled',
      isAutoReconciled: true,
      referenceNumber: `Ref #KAS-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: `Pelunasan iuran kas wajib oleh bendahara melalui konfirmasi WhatsApp.`,
    };
    addTransaction(newTx);

    showToast(`Iuran ${target.name} telah dicatat lunas & masuk Buku Kas!`, 'verified', 'success');
  };

  // Compute live treasury sums
  // Baseline initial state from screenshots:
  // Saldo aktif: Rp 14.850.000
  // Masuk: Rp 6.200.000
  // Keluar: Rp 2.450.000
  // Selisih: +Rp 3.750.000
  // In additions after baseline:
  const baselineInflow = 6200000;
  const baselineOutflow = 2450000;
  const baselineTotalBalance = 14850000;

  // Track dynamic additions over initial mock
  const userAddedInflows = transactions
    .filter((t) => !INITIAL_TRANSACTIONS.some((init) => init.id === t.id) && t.type === 'inflow')
    .reduce((sum, t) => sum + t.amount, 0);

  const userAddedOutflows = transactions
    .filter((t) => !INITIAL_TRANSACTIONS.some((init) => init.id === t.id) && t.type === 'outflow')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalMasukBulanIni = baselineInflow + userAddedInflows;
  const totalKeluarBulanIni = baselineOutflow + userAddedOutflows;
  const totalSaldo = baselineTotalBalance + userAddedInflows - userAddedOutflows;
  const selisihBersih = totalMasukBulanIni - totalKeluarBulanIni;

  // Dues calculations
  const totalPaidMembers = members.filter((m) => m.status === 'lunas').length;
  const totalMembersCount = 40; // Organization total members
  const collectedDues = 1400000 + (totalPaidMembers - 28) * 50000;
  const targetDues = 2000000;

  const exportExcel = () => {
    // Generate CSV content
    const headers = ['ID Ref', 'Tanggal', 'Waktu', 'Tipe', 'Judul Transaksi', 'Kategori', 'Metode', 'Pihak Terkait', 'Nominal', 'Status'];
    const rows = transactions.map((t) => [
      t.referenceNumber,
      `"${t.dateString}"`,
      `"${t.timeString}"`,
      t.type === 'inflow' ? 'Pemasukan' : 'Pengeluaran',
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      `"${t.paymentMethod}"`,
      `"${t.relatedPerson}"`,
      t.type === 'inflow' ? t.amount : -t.amount,
      `"${t.statusText || (t.verified ? 'Terverifikasi' : 'Pending')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Buku_Kas_KasKampus_Mei_2025.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Laporan Excel (CSV) berhasil diunduh.', 'table_view', 'success');
  };

  const exportMembersExcel = () => {
    const headers = ['Nama Lengkap', 'Divisi', 'Jabatan', 'Status Iuran', 'Nominal Bayar', 'Tunggakan', 'Tanggal Bayar Terakhir', 'No Telepon'];
    const rows = members.map((m) => [
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.department}"`,
      `"${m.role}"`,
      m.status === 'lunas' ? 'LUNAS' : 'TUNGGAKAN',
      m.amount,
      m.dueAmount,
      `"${m.lastPaidDate || '-'}"`,
      `"${m.phone || '-'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Iuran_Kas_Pengurus_Mei_2025.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Rekap Iuran Anggota (CSV) berhasil diunduh.', 'table_view', 'success');
  };

  const exportPdf = (options?: PDFExportOptions) => {
    try {
      showToast('Menyiapkan dokumen PDF resmi LPJ...', 'hourglass_top', 'info');
      downloadLpjPdfFile(MOCK_LPJ, transactions, members, options);
      showToast('Laporan Keuangan LPJ Resmi (PDF) berhasil diunduh!', 'picture_as_pdf', 'success');
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('Gagal membuat file PDF. Coba kembali.', 'error', 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        catatKasInitialType,
        setCatatKasInitialType,
        transparansiTab,
        setTransparansiTab,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        members,
        addMember,
        markMemberPaid,
        toggleMemberPaid,
        isSaldoVisible,
        toggleSaldoVisibility,
        selectedTransaction,
        setSelectedTransaction,
        whatsappModalMember,
        setWhatsappModalMember,
        isBroadcastModalOpen,
        setIsBroadcastModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isProfileOpen,
        setIsProfileOpen,
        isLpjPdfModalOpen,
        setIsLpjPdfModalOpen,
        isAddMemberOpen,
        setIsAddMemberOpen,
        selectedProker,
        setSelectedProker,
        lightboxImage,
        setLightboxImage,
        toast,
        showToast,
        totalSaldo,
        totalMasukBulanIni,
        totalKeluarBulanIni,
        selisihBersih,
        totalPaidMembers,
        totalMembersCount,
        collectedDues,
        targetDues,
        exportPdf,
        exportExcel,
        exportMembersExcel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
