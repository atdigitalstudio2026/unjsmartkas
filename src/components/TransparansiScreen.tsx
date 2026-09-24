import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import { MOCK_LPJ } from '../data/mockData';
import { MemberDue } from '../types';

export const TransparansiScreen: React.FC = () => {
  const {
    transparansiTab,
    setTransparansiTab,
    members,
    markMemberPaid,
    toggleMemberPaid,
    setWhatsappModalMember,
    setIsBroadcastModalOpen,
    setIsAddMemberOpen,
    setSelectedProker,
    exportPdf,
    exportExcel,
    exportMembersExcel,
    showToast,
    setIsLpjPdfModalOpen,
  } = useApp();

  const [activeDeptFilter, setActiveDeptFilter] = useState('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'lunas' | 'tunggakan'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const deptFilters = [
    { key: 'all', label: 'Semua Divisi' },
    { key: 'bph', label: 'BPH Inti' },
    { key: 'kominfo', label: 'Dept. Kominfo' },
    { key: 'acara', label: 'Dept. Acara' },
    { key: 'psdm', label: 'Dept. PSDM' },
    { key: 'danus', label: 'Dept. Danus' },
  ];

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // Dept filter
      if (activeDeptFilter !== 'all' && m.deptKey !== activeDeptFilter) return false;
      // Status filter
      if (activeStatusFilter !== 'all' && m.status !== activeStatusFilter) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q);
        const matchDept = m.department.toLowerCase().includes(q);
        const matchRole = m.role.toLowerCase().includes(q);
        if (!matchName && !matchDept && !matchRole) return false;
      }
      return true;
    });
  }, [members, activeDeptFilter, activeStatusFilter, searchQuery]);

  const unpaidCount = members.filter((m) => m.status === 'tunggakan').length;
  const paidCount = members.filter((m) => m.status === 'lunas').length;
  const totalCount = members.length;
  const compliancePercentage = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;

  const handleRemindDirect = (member: MemberDue) => {
    setWhatsappModalMember(member);
  };

  const handleTriggerBroadcast = () => {
    setIsBroadcastModalOpen(true);
  };

  return (
    <main className="flex-1 w-full bg-[#faf8ff] pt-16 pb-28">
      <div className="flex flex-col w-full px-4 max-w-md mx-auto space-y-5 pt-3">
        {/* Segmented Switch Tab */}
        <div className="w-full bg-[#e2e7ff] p-1 rounded-xl flex items-center justify-between shadow-xs">
          <button
            onClick={() => setTransparansiTab('iuran')}
            className={`flex-1 py-2 px-2 rounded-lg font-label-md text-[13px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              transparansiTab === 'iuran'
                ? 'bg-white text-[#006948] shadow-sm font-semibold'
                : 'text-[#3d4a42] hover:text-[#006948]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Iuran Wajib</span>
          </button>
          <button
            onClick={() => setTransparansiTab('lpj')}
            className={`flex-1 py-2 px-2 rounded-lg font-label-md text-[13px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              transparansiTab === 'lpj'
                ? 'bg-white text-[#006948] shadow-sm font-semibold'
                : 'text-[#3d4a42] hover:text-[#006948]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            <span>Laporan LPJ</span>
          </button>
        </div>

        {/* VIEW 1: IURAN WAJIB */}
        {transparansiTab === 'iuran' && (
          <div className="flex flex-col space-y-5">
            {/* Card Status Iuran Kas Bulan Mei 2025 */}
            <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#f2f3ff] to-[#006948]/5 rounded-2xl p-4 shadow-md border border-[#eaedff]">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#006948] font-bold">
                    Periode Berjalan
                  </span>
                  <h2 className="font-headline-sm text-[18px] text-[#131b2e] font-bold mt-0.5">
                    Kas Bulan Mei 2025
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#85f8c4] text-[#002114] font-label-sm text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006948] animate-pulse"></span>
                  Aktif
                </span>
              </div>

              {/* Compliance Stats & Metric */}
              <div className="mt-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl space-y-2.5 shadow-xs border border-[#eaedff]/70">
                <div className="flex justify-between items-baseline">
                  <span className="font-label-md text-[13px] text-[#3d4a42]">
                    Tingkat Kepatuhan
                  </span>
                  <span className="font-headline-sm text-[18px] text-[#006948] font-bold">
                    {compliancePercentage}%{' '}
                    <span className="font-body-sm text-[12px] text-[#3d4a42] font-normal">
                      ({paidCount}/{totalCount} Anggota)
                    </span>
                  </span>
                </div>

                {/* Custom Progress Bar */}
                <div className="w-full h-3 bg-[#dae2fd] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#006948] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${compliancePercentage}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center pt-1 text-[#131b2e]">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[11px] text-[#3d4a42]">
                      Saldo Terkumpul
                    </span>
                    <span className="font-label-lg text-[14px] text-[#006948] font-bold">
                      {formatRupiah(paidCount * 50000)}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-label-sm text-[11px] text-[#3d4a42]">
                      Target Iuran
                    </span>
                    <span className="font-label-lg text-[14px] text-[#131b2e] font-semibold">
                      {formatRupiah(totalCount * 50000)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Broadcast WhatsApp Reminder & Unduh Rekap */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleTriggerBroadcast}
                  className="h-11 bg-[#006948] hover:bg-[#00855d] text-white font-label-md text-[12px] font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Ingatkan WA ({unpaidCount})</span>
                </button>
                <button
                  type="button"
                  onClick={exportMembersExcel}
                  className="h-11 bg-white hover:bg-[#eaedff] text-[#006948] border border-[#eaedff] font-label-md text-[12px] font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Ekspor Excel Iuran</span>
                </button>
              </div>
            </div>

            {/* Search & Status Filter */}
            <div className="flex flex-col space-y-2.5">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#3d4a42] text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari anggota, divisi, atau jabatan..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#eaedff] bg-white text-[12px] text-[#131b2e] placeholder:text-[#6d7a72] focus:outline-none focus:ring-2 focus:ring-[#006948]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-[#6d7a72] hover:text-[#131b2e] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
              </div>

              {/* Status Segmented Control */}
              <div className="p-1 bg-[#eaedff] rounded-xl flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setActiveStatusFilter('all')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    activeStatusFilter === 'all'
                      ? 'bg-white text-[#131b2e] shadow-xs font-semibold'
                      : 'text-[#3d4a42] hover:text-[#131b2e]'
                  }`}
                >
                  Semua ({totalCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStatusFilter('lunas')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    activeStatusFilter === 'lunas'
                      ? 'bg-[#006948] text-white shadow-xs font-semibold'
                      : 'text-[#3d4a42] hover:text-[#131b2e]'
                  }`}
                >
                  Lunas ({paidCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStatusFilter('tunggakan')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    activeStatusFilter === 'tunggakan'
                      ? 'bg-[#ba1a1a] text-white shadow-xs font-semibold'
                      : 'text-[#3d4a42] hover:text-[#131b2e]'
                  }`}
                >
                  Tunggakan ({unpaidCount})
                </button>
              </div>

              {/* Filter Chips Horizontal Scroll */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
                {deptFilters.map((df) => {
                  const isActive = activeDeptFilter === df.key;
                  return (
                    <button
                      key={df.key}
                      onClick={() => setActiveDeptFilter(df.key)}
                      className={`shrink-0 px-3 py-1 rounded-full font-label-md text-[11px] transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#006948] text-white shadow-xs font-semibold'
                          : 'bg-[#e2e7ff] text-[#3d4a42] hover:text-[#131b2e]'
                      }`}
                    >
                      {df.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daftar Anggota & Status Pembayaran Kas */}
            <div className="flex flex-col space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
                    Daftar Pengurus
                  </h3>
                  <span className="text-[11px] text-[#3d4a42]">
                    ({filteredMembers.length} tampil)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(true)}
                  className="h-8 px-2.5 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white font-label-sm text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  <span>Tambah</span>
                </button>
              </div>

              {filteredMembers.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#eaedff]">
                  <span className="material-symbols-outlined text-[36px] text-[#6d7a72]">
                    search_off
                  </span>
                  <p className="font-semibold text-xs text-[#131b2e] mt-2">
                    Tidak ada anggota yang cocok
                  </p>
                  <p className="text-[11px] text-[#3d4a42] mt-1">
                    Coba sesuaikan kata kunci pencarian atau filter departemen.
                  </p>
                </div>
              ) : (
                filteredMembers.map((member) => {
                  const isLunas = member.status === 'lunas';

                  // Initial Avatar styling
                  let avatarClass = 'bg-[#85f8c4] text-[#002114]';
                  if (!isLunas) {
                    avatarClass = 'bg-[#ffdad6] text-[#93000a]';
                  } else if (member.initials === 'CD') {
                    avatarClass = 'bg-[#e2dfff] text-[#0f0069]';
                  }

                  return (
                    <div
                      key={member.id}
                      className="bg-white p-3.5 rounded-xl flex items-center justify-between shadow-xs border border-[#eaedff]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-label-lg text-[13px] font-bold ${avatarClass}`}
                        >
                          {member.initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-lg text-[14px] text-[#131b2e] font-semibold truncate">
                            {member.name}
                          </span>
                          <span className="font-body-sm text-[12px] text-[#3d4a42] truncate">
                            {member.department} • {member.role}
                          </span>
                        </div>
                      </div>

                      {isLunas ? (
                        <div className="flex flex-col items-end shrink-0 pl-2">
                          <button
                            type="button"
                            onClick={() => toggleMemberPaid(member.id)}
                            title="Klik untuk ubah status jika diperlukan"
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] font-label-sm text-[11px] font-semibold hover:opacity-85 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              check_circle
                            </span>
                            Lunas
                          </button>
                          <span className="font-numeral-table text-[12px] text-[#006948] mt-1 font-semibold">
                            {formatRupiah(member.amount)}
                          </span>
                          <span className="font-body-sm text-[10px] leading-tight text-[#3d4a42]">
                            {member.lastPaidDate || '16 Mei 2025'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          <div className="flex flex-col items-end mr-1">
                            <span className="text-[11px] font-bold text-[#b61722]">
                              {formatRupiah(member.dueAmount)}
                            </span>
                            <span className="text-[10px] text-[#3d4a42]">
                              {member.monthsDue || 'Belum Lunas'}
                            </span>
                          </div>
                          {/* Direct Mark Paid Button */}
                          <button
                            type="button"
                            onClick={() => markMemberPaid(member.id)}
                            title="Terima & Catat Lunas ke Buku Kas"
                            className="h-8 px-2.5 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white font-label-sm text-[11px] font-semibold flex items-center gap-1 active:scale-95 transition-all shadow-xs cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">check</span>
                            <span>Lunas</span>
                          </button>
                          {/* Tagih via WhatsApp */}
                          <button
                            type="button"
                            onClick={() => handleRemindDirect(member)}
                            title="Kirim pesan penagihan WhatsApp"
                            className="h-8 w-8 rounded-lg bg-[#f2f3ff] hover:bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center active:scale-95 transition-all border border-[#eaedff] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">send</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: LAPORAN LPJ & REKAP KEUANGAN */}
        {transparansiTab === 'lpj' && (
          <div className="flex flex-col space-y-5">
            {/* Hero Card LPJ Overview */}
            <div className="bg-white rounded-2xl p-4 shadow-md space-y-4 border border-[#eaedff]">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[11px] uppercase tracking-wider text-[#4b41e1] font-bold">
                    Arsip Transparansi Kampus
                  </span>
                  <h2 className="font-headline-sm text-[18px] text-[#131b2e] font-bold mt-1">
                    {MOCK_LPJ.title}
                  </h2>
                  <p className="font-body-sm text-[12px] text-[#3d4a42] mt-1 leading-relaxed">
                    Diaudit langsung oleh Dewan Pengawas Organisasi &amp; Bendahara Umum BEM.
                  </p>
                </div>
              </div>

              {/* Quick Balance Sheet Audit */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#f2f3ff] p-3 rounded-xl border border-[#eaedff]">
                  <span className="font-label-sm text-[11px] text-[#3d4a42]">
                    Total Pemasukan
                  </span>
                  <p className="font-label-lg text-[15px] text-[#006948] font-bold mt-0.5">
                    {formatRupiah(MOCK_LPJ.totalInflow)}
                  </p>
                  <span className="font-body-sm text-[10px] text-[#3d4a42]">
                    Iuran, Spons &amp; Danus
                  </span>
                </div>
                <div className="bg-[#f2f3ff] p-3 rounded-xl border border-[#eaedff]">
                  <span className="font-label-sm text-[11px] text-[#3d4a42]">
                    Total Pengeluaran
                  </span>
                  <p className="font-label-lg text-[15px] text-[#b61722] font-bold mt-0.5">
                    {formatRupiah(MOCK_LPJ.totalOutflow)}
                  </p>
                  <span className="font-body-sm text-[10px] text-[#3d4a42]">
                    Kegiatan &amp; Logistik
                  </span>
                </div>
              </div>

              <div className="bg-[#006948]/10 p-3 rounded-xl flex items-center justify-between border border-[#006948]/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006948] text-[20px]">
                    account_balance_wallet
                  </span>
                  <span className="font-label-md text-[12px] text-[#131b2e] font-semibold">
                    Sisa Saldo Kas Terverifikasi
                  </span>
                </div>
                <span className="font-label-lg text-[14px] text-[#006948] font-bold">
                  {formatRupiah(MOCK_LPJ.verifiedBalance)}
                </span>
              </div>

              {/* Documentation Photo */}
              <div className="relative rounded-xl overflow-hidden shadow-xs h-40 bg-[#dae2fd]">
                <img
                  src={MOCK_LPJ.photoUrl}
                  alt="Sidang Pleno Pertanggungjawaban Keuangan"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#283044]/90 via-transparent to-transparent flex items-end p-3">
                  <span className="font-label-sm text-[12px] text-white flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[15px] text-[#85f8c4]">
                      history_edu
                    </span>
                    Sidang Pleno Pertanggungjawaban Keuangan
                  </span>
                </div>
              </div>

              {/* Download Action Buttons */}
              <div className="flex flex-col space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[11px] text-[#3d4a42] font-semibold">
                    Unduh Dokumen Neraca Resmi
                  </span>
                  <span className="text-[10px] text-[#006948] font-semibold bg-[#85f8c4]/30 px-2 py-0.5 rounded-full">
                    A4 PDF Berstempel
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => exportPdf()}
                    className="h-12 bg-[#da3437] hover:bg-[#b61722] text-white font-label-md text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      picture_as_pdf
                    </span>
                    <span>Unduh PDF Resmi</span>
                  </button>
                  <button
                    type="button"
                    onClick={exportExcel}
                    className="h-12 bg-[#006948] hover:bg-[#00855d] text-white font-label-md text-[13px] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">table_view</span>
                    <span>Excel Neraca Kas</span>
                  </button>
                </div>

                {/* Additional Action: Preview & Customize LPJ PDF */}
                <button
                  type="button"
                  onClick={() => setIsLpjPdfModalOpen(true)}
                  className="w-full py-2.5 px-3 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#283044] rounded-xl font-label-sm text-[12px] font-semibold flex items-center justify-center gap-2 transition-colors border border-[#eaedff] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px] text-[#4b41e1]">
                    tune
                  </span>
                  <span>Pratinjau Dokumen &amp; Opsi Kirim WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Security & Sign-off badge */}
            <div className="bg-[#f2f3ff] p-4 rounded-xl flex items-start gap-3 border border-[#eaedff]">
              <div className="w-10 h-10 rounded-full bg-[#e2dfff] flex items-center justify-center text-[#0f0069] shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">encrypted</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-[13px] text-[#131b2e] font-semibold">
                  Tanda Tangan Digital Sah
                </span>
                <span className="font-body-sm text-[11px] text-[#3d4a42] mt-0.5 leading-relaxed">
                  Dokumen dilindungi SHA-256 ({MOCK_LPJ.verificationHash.slice(0, 16)}...) dan telah diverifikasi oleh Bendahara 1 &amp; Ketua Himpunan.
                </span>
              </div>
            </div>

            {/* List of Proker Audited */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-[16px] text-[#131b2e] font-bold">
                  Daftar Program Kerja Tervalidasi
                </span>
                <span className="text-[11px] text-[#3d4a42]">Klik untuk rincian belanja</span>
              </div>
              {MOCK_LPJ.events.map((ev) => (
                <div
                  key={ev.name}
                  onClick={() => setSelectedProker(ev)}
                  className="bg-white p-3.5 rounded-xl border border-[#eaedff] flex flex-col gap-1.5 shadow-xs hover:bg-[#faf8ff] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-[13px] text-[#131b2e] font-semibold group-hover:text-[#006948] transition-colors">
                      {ev.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] text-[10px] font-semibold">
                      {ev.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#3d4a42] pt-1">
                    <span>Anggaran: {formatRupiah(ev.budget)}</span>
                    <div className="flex items-center gap-1 font-semibold text-[#006948]">
                      <span>Realisasi: {formatRupiah(ev.realized)}</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
